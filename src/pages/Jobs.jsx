
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  DollarSign,
  Eye,
  LoaderCircle,
  MapPin,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  UserRound,
  Users,
  Wrench,
  X,
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import { useOrganization } from "../context/OrganizationContext";

import {
  getJobs,
  getJobStats,
  getJobById,
  createJob,
  updateJob,
  cancelJob,
} from "../api/jobApi";

import { getBookings } from "../api/bookingApi";
import { getCustomers } from "../api/customerApi";
import { getServices } from "../api/serviceApi";
import { getStaff } from "../api/staffApi";

// =====================================================
// CONSTANTS + HELPERS
// =====================================================

const STATUSES = [
  "pending",
  "assigned",
  "in_progress",
  "completed",
  "cancelled",
];

const PRIORITIES = ["low", "medium", "high", "urgent"];

const EMPTY_FORM = {
  booking: "",
  customer: "",
  service: "",
  staff: "",
  title: "",
  description: "",
  scheduledDate: "",
  startTime: "",
  endTime: "",
  status: "pending",
  priority: "medium",
  price: "",
  taxRate: "0",
  notes: "",
  address: "",
  city: "",
  postalCode: "",
  locationNotes: "",
};

const unwrapList = (response) => {
  if (Array.isArray(response?.data?.data)) {
    return response.data.data;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  return [];
};

const unwrapObject = (response) =>
  response?.data?.data ?? response?.data ?? {};

const getId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value._id || value.id || "";
};

const getName = (value, fallback = "—") => {
  if (!value) return fallback;
  if (typeof value === "string") return value;

  return (
    value.name ||
    value.title ||
    value.fullName ||
    value.businessName ||
    value.email ||
    fallback
  );
};

const formatStatus = (status = "") =>
  status.replaceAll("_", " ").replace(/\b\w/g, (char) =>
    char.toUpperCase()
  );

const formatMoney = (amount) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

const formatDate = (date) => {
  if (!date) return "Not scheduled";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "Invalid date";

  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const statusStyles = {
  pending: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  assigned: "border-sky-400/20 bg-sky-400/10 text-sky-300",
  in_progress:
    "border-violet-400/20 bg-violet-400/10 text-violet-300",
  completed:
    "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  cancelled: "border-rose-400/20 bg-rose-400/10 text-rose-300",
};

const priorityStyles = {
  low: "text-slate-400",
  medium: "text-sky-300",
  high: "text-amber-300",
  urgent: "text-rose-300",
};

const inputClass =
  "w-full rounded-xl border border-white/10 bg-[#100d1b] px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/10";

const labelClass =
  "mb-2 block text-xs font-medium uppercase tracking-wider text-slate-400";

const buttonClass =
  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50";

// =====================================================
// SMALL COMPONENTS
// =====================================================

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium ${
        statusStyles[status] || statusStyles.pending
      }`}
    >
      {formatStatus(status)}
    </span>
  );
}

function StatCard({ title, value, description, icon: Icon, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5 shadow-lg shadow-black/10"
    >
      <div
        className={`absolute -right-8 -top-8 h-28 w-28 rounded-full blur-3xl ${color}`}
      />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
            {value}
          </p>
          <p className="mt-2 text-xs text-slate-500">{description}</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <Icon className="h-5 w-5 text-violet-300" />
        </div>
      </div>
    </motion.div>
  );
}

function Modal({ title, subtitle, onClose, children, wide = false }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        className={`my-auto w-full ${
          wide ? "max-w-3xl" : "max-w-xl"
        } overflow-hidden rounded-2xl border border-white/10 bg-[#100d1b] shadow-2xl shadow-violet-950/30`}
      >
        <div className="flex items-start justify-between border-b border-white/10 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            {subtitle && (
              <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {children}
      </motion.div>
    </div>
  );
}

// =====================================================
// PAGE
// =====================================================

export default function Jobs() {
  const organizationContext = useOrganization();
  const currentOrganization =
    organizationContext?.currentOrganization;

  const organizationId =
    currentOrganization?._id || currentOrganization?.id || "";

  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({});
  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [viewingJob, setViewingJob] = useState(null);
  const [jobToCancel, setJobToCancel] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);

  // ---------------------------------------------------
  // LOAD JOBS + STATS
  // ---------------------------------------------------

  const loadJobs = useCallback(async () => {
    if (!organizationId) {
      setJobs([]);
      setStats({});
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const [jobsResponse, statsResponse] = await Promise.all([
        getJobs({
          organizationId,
          status: statusFilter,
          priority: priorityFilter,
          date: dateFilter,
        }),
        getJobStats({ organizationId }),
      ]);

      setJobs(unwrapList(jobsResponse));
      setStats(unwrapObject(statsResponse));
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load jobs."
      );
    } finally {
      setLoading(false);
    }
  }, [
    organizationId,
    statusFilter,
    priorityFilter,
    dateFilter,
  ]);

  // ---------------------------------------------------
  // LOAD FORM DROPDOWN DATA
  // ---------------------------------------------------

  const loadFormOptions = useCallback(async () => {
    if (!organizationId) return;

    setOptionsLoading(true);

    try {
      const [
        bookingResponse,
        customerResponse,
        serviceResponse,
        staffResponse,
      ] = await Promise.all([
        getBookings({ organizationId }),
        getCustomers({ organizationId }),
        getServices({ organizationId, status: "active" }),
        getStaff({ organizationId, status: "active" }),
      ]);

      setBookings(unwrapList(bookingResponse));
      setCustomers(unwrapList(customerResponse));
      setServices(unwrapList(serviceResponse));
      setStaffMembers(unwrapList(staffResponse));
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load form options."
      );
    } finally {
      setOptionsLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  useEffect(() => {
    setJobs([]);
    setStats({});
    setBookings([]);
    setCustomers([]);
    setServices([]);
    setStaffMembers([]);

    if (organizationId) {
      loadFormOptions();
    }
  }, [organizationId, loadFormOptions]);

  // ---------------------------------------------------
  // CLIENT-SIDE SEARCH
  // Backend currently doesn't implement job search.
  // ---------------------------------------------------

  const filteredJobs = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return jobs;

    return jobs.filter((job) => {
      const searchable = [
        job.jobNumber,
        job.title,
        job.description,
        job.status,
        job.priority,
        getName(job.customer),
        getName(job.service),
        getName(job.staff),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(term);
    });
  }, [jobs, search]);

  // ---------------------------------------------------
  // FORM HELPERS
  // ---------------------------------------------------

  const updateField = (name, value) => {
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const openCreateForm = async () => {
    setEditingJob(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
    setNotice("");
    setError("");

    if (
      bookings.length === 0 ||
      customers.length === 0 ||
      services.length === 0
    ) {
      await loadFormOptions();
    }
  };

  const openEditForm = async (job) => {
    setError("");
    setNotice("");

    try {
      const response = await getJobById({
        organizationId,
        jobId: getId(job),
      });

      const freshJob = unwrapObject(response);

      setEditingJob(freshJob);
      setForm({
        ...EMPTY_FORM,
        booking: getId(freshJob.booking),
        customer: getId(freshJob.customer),
        service: getId(freshJob.service),
        staff: getId(freshJob.staff),
        title: freshJob.title || "",
        description: freshJob.description || "",
        scheduledDate: freshJob.scheduledDate
          ? new Date(freshJob.scheduledDate)
              .toISOString()
              .slice(0, 10)
          : "",
        startTime: freshJob.startTime || "",
        endTime: freshJob.endTime || "",
        status: freshJob.status || "pending",
        priority: freshJob.priority || "medium",
        price: String(freshJob.price ?? ""),
        taxRate: String(freshJob.taxRate ?? 0),
        notes: freshJob.notes || "",
        address: freshJob.location?.address || "",
        city: freshJob.location?.city || "",
        postalCode: freshJob.location?.postalCode || "",
        locationNotes: freshJob.location?.notes || "",
      });

      setShowForm(true);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load job details."
      );
    }
  };

  const handleBookingChange = (bookingId) => {
    updateField("booking", bookingId);

    const selectedBooking = bookings.find(
      (item) => getId(item) === bookingId
    );

    if (!selectedBooking) return;

    // Only prefill when the booking contains populated references.
    setForm((previous) => ({
      ...previous,
      booking: bookingId,
      customer: getId(selectedBooking.customer) || previous.customer,
      service: getId(selectedBooking.service) || previous.service,
      scheduledDate: selectedBooking.scheduledDate
        ? new Date(selectedBooking.scheduledDate)
            .toISOString()
            .slice(0, 10)
        : previous.scheduledDate,
      startTime: selectedBooking.startTime || previous.startTime,
      endTime: selectedBooking.endTime || previous.endTime,
    }));
  };

  // ---------------------------------------------------
  // CREATE / UPDATE JOB
  // ---------------------------------------------------

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!organizationId) {
      setError("Select a business before creating a job.");
      return;
    }

    if (
      !form.booking ||
      !form.customer ||
      !form.service ||
      !form.title.trim() ||
      !form.scheduledDate ||
      !form.startTime ||
      !form.endTime ||
      form.price === ""
    ) {
      setError("Please complete all required fields.");
      return;
    }

    const price = Number(form.price);
    const taxRate = Number(form.taxRate || 0);

    if (
      !Number.isFinite(price) ||
      price < 0 ||
      !Number.isFinite(taxRate) ||
      taxRate < 0 ||
      taxRate > 100
    ) {
      setError("Enter a valid price and tax rate.");
      return;
    }

    const jobData = {
      booking: form.booking,
      customer: form.customer,
      service: form.service,
      title: form.title.trim(),
      description: form.description.trim(),
      scheduledDate: form.scheduledDate,
      startTime: form.startTime,
      endTime: form.endTime,
      status: form.status,
      priority: form.priority,
      price,
      taxRate,
      notes: form.notes.trim(),
      location: {
        address: form.address.trim(),
        city: form.city.trim(),
        postalCode: form.postalCode.trim(),
        notes: form.locationNotes.trim(),
      },
    };

    // Optional staff: omit when unassigned.
    if (form.staff) {
      jobData.staff = form.staff;
    }

    setSaving(true);
    setError("");
    setNotice("");

    try {
      if (editingJob) {
        await updateJob({
          organizationId,
          jobId: getId(editingJob),
          jobData,
        });

        setNotice("Job updated successfully.");
      } else {
        await createJob({
          organizationId,
          jobData,
        });

        setNotice("Job created successfully.");
      }

      setShowForm(false);
      setEditingJob(null);
      setForm(EMPTY_FORM);

      await loadJobs();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to save job."
      );
    } finally {
      setSaving(false);
    }
  };

  // ---------------------------------------------------
  // CANCEL JOB
  // ---------------------------------------------------

  const handleCancelJob = async () => {
    if (!jobToCancel) return;

    setSaving(true);
    setError("");
    setNotice("");

    try {
      await cancelJob({
        organizationId,
        jobId: getId(jobToCancel),
      });

      setJobToCancel(null);
      setViewingJob(null);
      setNotice("Job cancelled successfully.");

      await loadJobs();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to cancel job."
      );
    } finally {
      setSaving(false);
    }
  };

  // ---------------------------------------------------
  // QUICK STATUS UPDATE
  // ---------------------------------------------------

  const handleStatusChange = async (job, nextStatus) => {
    setSaving(true);
    setError("");
    setNotice("");

    try {
      await updateJob({
        organizationId,
        jobId: getId(job),
        jobData: { status: nextStatus },
      });

      setNotice("Job status updated.");
      await loadJobs();

      if (viewingJob && getId(viewingJob) === getId(job)) {
        setViewingJob((previous) => ({
          ...previous,
          status: nextStatus,
        }));
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to update job status."
      );
    } finally {
      setSaving(false);
    }
  };

  // ---------------------------------------------------
  // NO ORGANIZATION
  // ---------------------------------------------------

  if (!organizationId) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center p-6">
          <div className="max-w-md text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10">
              <Wrench className="h-7 w-7 text-violet-300" />
            </div>

            <h2 className="mt-5 text-xl font-semibold text-white">
              Select a business
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Choose an organization from your ServiceOS organization
              switcher to manage its jobs.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <DashboardLayout>
      <div className="min-h-screen space-y-6 pb-10">
        {/* HEADER */}

        <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#21143c] via-[#120e20] to-[#0b101b] p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-violet-600/20 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-1/3 h-32 w-32 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-300/10 px-3 py-1.5 text-xs font-medium text-violet-200">
                <Activity className="h-3.5 w-3.5" />
                OPERATIONS CENTER
              </div>

              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Job Management
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                Track scheduled work, assign your team and keep every
                service job moving forward.
              </p>

              <p className="mt-3 text-xs text-slate-500">
                Workspace:{" "}
                <span className="text-violet-200">
                  {currentOrganization?.name || "Current organization"}
                </span>
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={loadJobs}
                disabled={loading}
                className={`${buttonClass} border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10`}
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </button>

              <button
                type="button"
                onClick={openCreateForm}
                className={`${buttonClass} bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-950/40 hover:from-violet-500 hover:to-indigo-500`}
              >
                <Plus className="h-4 w-4" />
                Create Job
              </button>
            </div>
          </div>
        </div>

        {/* FEEDBACK */}

        <AnimatePresence>
          {(error || notice) && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex items-start gap-3 rounded-xl border p-4 ${
                error
                  ? "border-rose-400/20 bg-rose-400/10 text-rose-200"
                  : "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
              }`}
            >
              {error ? (
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              ) : (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
              )}

              <div className="flex-1 text-sm">{error || notice}</div>

              <button
                type="button"
                onClick={() => {
                  setError("");
                  setNotice("");
                }}
                className="rounded-md p-1 opacity-70 hover:opacity-100"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* STATISTICS */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Jobs"
            value={stats.totalJobs ?? "—"}
            description="All recorded jobs"
            icon={Wrench}
            color="bg-violet-500/20"
          />

          <StatCard
            title="Active Jobs"
            value={stats.activeJobs ?? "—"}
            description="Currently active records"
            icon={Activity}
            color="bg-cyan-500/15"
          />

          <StatCard
            title="Completed"
            value={stats.completedJobs ?? "—"}
            description="Successfully completed"
            icon={CheckCircle2}
            color="bg-emerald-500/15"
          />

          <StatCard
            title="Cancelled"
            value={stats.cancelledJobs ?? "—"}
            description="Cancelled job records"
            icon={Clock3}
            color="bg-rose-500/15"
          />
        </div>

        {/* FILTERS */}

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 sm:p-5">
          <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-semibold text-white">All Jobs</h2>
              <p className="mt-1 text-xs text-slate-500">
                {filteredJobs.length} job
                {filteredJobs.length === 1 ? "" : "s"} displayed
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatusFilter("");
                setPriorityFilter("");
                setDateFilter("");
              }}
              className="self-start text-xs font-medium text-violet-300 transition hover:text-violet-200 sm:self-auto"
            >
              Clear filters
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search loaded jobs..."
                className={`${inputClass} pl-10`}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className={inputClass}
            >
              <option value="">All statuses</option>
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {formatStatus(status)}
                </option>
              ))}
            </select>

            <select
              value={priorityFilter}
              onChange={(event) => setPriorityFilter(event.target.value)}
              className={inputClass}
            >
              <option value="">All priorities</option>
              {PRIORITIES.map((priority) => (
                <option key={priority} value={priority}>
                  {formatStatus(priority)}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value)}
              className={inputClass}
              aria-label="Filter jobs by scheduled date"
            />
          </div>
        </div>

        {/* JOB TABLE */}

        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025]">
          {loading ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-slate-400">
              <LoaderCircle className="h-7 w-7 animate-spin text-violet-300" />
              <p className="text-sm">Loading jobs...</p>
            </div>
          ) : error && jobs.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
              <AlertCircle className="h-8 w-8 text-rose-300" />
              <p className="mt-3 font-medium text-white">
                Could not load jobs
              </p>
              <p className="mt-1 text-sm text-slate-400">
                Check your API route, authentication and organization
                permissions.
              </p>
              <button
                type="button"
                onClick={loadJobs}
                className={`${buttonClass} mt-4 border border-white/10 text-white hover:bg-white/5`}
              >
                <RefreshCw className="h-4 w-4" />
                Try again
              </button>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10">
                <Wrench className="h-6 w-6 text-violet-300" />
              </div>

              <h3 className="mt-4 font-semibold text-white">
                {jobs.length === 0
                  ? "No jobs yet"
                  : "No matching jobs"}
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
                {jobs.length === 0
                  ? "Create your first job to start tracking work for your business."
                  : "Try another search term or clear your filters."}
              </p>

              {jobs.length === 0 && (
                <button
                  type="button"
                  onClick={openCreateForm}
                  className={`${buttonClass} mt-5 bg-violet-600 text-white hover:bg-violet-500`}
                >
                  <Plus className="h-4 w-4" />
                  Create your first job
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.025]">
                    {[
                      "Job",
                      "Customer / Service",
                      "Schedule",
                      "Assigned Staff",
                      "Priority",
                      "Status",
                      "Price",
                      "Actions",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-slate-500"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/[0.06]">
                  {filteredJobs.map((job, index) => (
                    <motion.tr
                      key={getId(job)}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: Math.min(index * 0.025, 0.2) }}
                      className="group transition hover:bg-white/[0.035]"
                    >
                      <td className="px-5 py-4">
                        <p className="font-medium text-white">
                          {job.title}
                        </p>
                        <p className="mt-1 text-xs text-violet-300">
                          {job.jobNumber || "Job"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm text-slate-200">
                          {getName(job.customer)}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {getName(job.service)}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <CalendarDays className="h-4 w-4 text-slate-500" />
                          {formatDate(job.scheduledDate)}
                        </div>
                        <p className="mt-1 pl-6 text-xs text-slate-500">
                          {job.startTime || "—"} – {job.endTime || "—"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <UserRound className="h-4 w-4 text-slate-500" />
                          {getName(job.staff, "Unassigned")}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`text-xs font-semibold ${priorityStyles[job.priority] || priorityStyles.medium}`}
                        >
                          {formatStatus(job.priority || "medium")}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={job.status} />
                      </td>

                      <td className="px-5 py-4 text-sm font-medium text-white">
                        {formatMoney(job.price)}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            title="View details"
                            onClick={async () => {
                              try {
                                const response = await getJobById({
                                  organizationId,
                                  jobId: getId(job),
                                });

                                setViewingJob(unwrapObject(response));
                              } catch (err) {
                                setError(
                                  err?.response?.data?.message ||
                                    err?.message ||
                                    "Unable to load job details."
                                );
                              }
                            }}
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-violet-500/15 hover:text-violet-200"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            title="Edit job"
                            onClick={() => openEditForm(job)}
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            title="Cancel job"
                            onClick={() => setJobToCancel(job)}
                            disabled={
                              job.status === "cancelled" ||
                              !job.isActive
                            }
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-300 disabled:opacity-30"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* CREATE / EDIT MODAL */}

        <AnimatePresence>
          {showForm && (
            <Modal
              title={editingJob ? "Edit Job" : "Create New Job"}
              subtitle={
                editingJob
                  ? `Update ${editingJob.jobNumber || "job details"}`
                  : "Add the details needed to schedule and track work."
              }
              onClose={() => {
                if (!saving) {
                  setShowForm(false);
                  setEditingJob(null);
                }
              }}
              wide
            >
              <form onSubmit={handleSubmit}>
                <div className="max-h-[70vh] space-y-6 overflow-y-auto p-5 sm:p-6">
                  {error && (
                    <div className="rounded-xl border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200">
                      {error}
                    </div>
                  )}

                  {optionsLoading && (
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      Loading dropdown options...
                    </div>
                  )}

                  {/* RELATIONSHIPS */}

                  <section>
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
                      <Users className="h-4 w-4 text-violet-300" />
                      Job relationships
                    </h3>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className={labelClass}>
                          Booking *
                        </label>
                        <select
                          required
                          value={form.booking}
                          onChange={(event) =>
                            handleBookingChange(event.target.value)
                          }
                          className={inputClass}
                        >
                          <option value="">Select booking</option>
                          {bookings.map((booking) => (
                            <option
                              key={getId(booking)}
                              value={getId(booking)}
                            >
                              {booking.bookingNumber ||
                                booking.title ||
                                getId(booking)}{" "}
                              — {getName(booking.customer)}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className={labelClass}>
                          Customer *
                        </label>
                        <select
                          required
                          value={form.customer}
                          onChange={(event) =>
                            updateField("customer", event.target.value)
                          }
                          className={inputClass}
                        >
                          <option value="">Select customer</option>
                          {customers.map((customer) => (
                            <option
                              key={getId(customer)}
                              value={getId(customer)}
                            >
                              {getName(customer)}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className={labelClass}>
                          Service *
                        </label>
                        <select
                          required
                          value={form.service}
                          onChange={(event) => {
                            const serviceId = event.target.value;
                            updateField("service", serviceId);

                            const selectedService = services.find(
                              (item) => getId(item) === serviceId
                            );

                            if (
                              selectedService &&
                              selectedService.price != null
                            ) {
                              updateField(
                                "price",
                                String(selectedService.price)
                              );
                            }
                          }}
                          className={inputClass}
                        >
                          <option value="">Select service</option>
                          {services.map((service) => (
                            <option
                              key={getId(service)}
                              value={getId(service)}
                            >
                              {getName(service)} —{" "}
                              {formatMoney(service.price)}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className={labelClass}>
                          Assign staff
                        </label>
                        <select
                          value={form.staff}
                          onChange={(event) =>
                            updateField("staff", event.target.value)
                          }
                          className={inputClass}
                        >
                          <option value="">Unassigned</option>
                          {staffMembers.map((staff) => (
                            <option
                              key={getId(staff)}
                              value={getId(staff)}
                            >
                              {getName(staff)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </section>

                  {/* JOB DETAILS */}

                  <section>
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
                      <Wrench className="h-4 w-4 text-violet-300" />
                      Job details
                    </h3>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="md:col-span-2">
                        <label className={labelClass}>
                          Job title *
                        </label>
                        <input
                          required
                          minLength={2}
                          maxLength={200}
                          value={form.title}
                          onChange={(event) =>
                            updateField("title", event.target.value)
                          }
                          placeholder="e.g. AC maintenance and repair"
                          className={inputClass}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className={labelClass}>
                          Description
                        </label>
                        <textarea
                          rows={3}
                          maxLength={3000}
                          value={form.description}
                          onChange={(event) =>
                            updateField("description", event.target.value)
                          }
                          placeholder="Describe the work to be completed..."
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Status</label>
                        <select
                          value={form.status}
                          onChange={(event) =>
                            updateField("status", event.target.value)
                          }
                          className={inputClass}
                        >
                          {STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {formatStatus(status)}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className={labelClass}>Priority</label>
                        <select
                          value={form.priority}
                          onChange={(event) =>
                            updateField("priority", event.target.value)
                          }
                          className={inputClass}
                        >
                          {PRIORITIES.map((priority) => (
                            <option key={priority} value={priority}>
                              {formatStatus(priority)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </section>

                  {/* SCHEDULE */}

                  <section>
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
                      <CalendarDays className="h-4 w-4 text-violet-300" />
                      Schedule
                    </h3>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div>
                        <label className={labelClass}>
                          Scheduled date *
                        </label>
                        <input
                          required
                          type="date"
                          value={form.scheduledDate}
                          onChange={(event) =>
                            updateField(
                              "scheduledDate",
                              event.target.value
                            )
                          }
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>
                          Start time *
                        </label>
                        <input
                          required
                          type="time"
                          value={form.startTime}
                          onChange={(event) =>
                            updateField("startTime", event.target.value)
                          }
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>
                          End time *
                        </label>
                        <input
                          required
                          type="time"
                          value={form.endTime}
                          onChange={(event) =>
                            updateField("endTime", event.target.value)
                          }
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </section>

                  {/* PRICE */}

                  <section>
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
                      <DollarSign className="h-4 w-4 text-violet-300" />
                      Pricing
                    </h3>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className={labelClass}>
                          Price (BDT) *
                        </label>
                        <input
                          required
                          type="number"
                          min="0"
                          step="0.01"
                          value={form.price}
                          onChange={(event) =>
                            updateField("price", event.target.value)
                          }
                          placeholder="0.00"
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>
                          Tax rate (%)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          value={form.taxRate}
                          onChange={(event) =>
                            updateField("taxRate", event.target.value)
                          }
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </section>

                  {/* LOCATION */}

                  <section>
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
                      <MapPin className="h-4 w-4 text-violet-300" />
                      Job location
                    </h3>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="md:col-span-2">
                        <label className={labelClass}>Address</label>
                        <input
                          maxLength={500}
                          value={form.address}
                          onChange={(event) =>
                            updateField("address", event.target.value)
                          }
                          placeholder="Street address"
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>City</label>
                        <input
                          maxLength={100}
                          value={form.city}
                          onChange={(event) =>
                            updateField("city", event.target.value)
                          }
                          placeholder="City"
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Postal code</label>
                        <input
                          maxLength={20}
                          value={form.postalCode}
                          onChange={(event) =>
                            updateField("postalCode", event.target.value)
                          }
                          placeholder="Postal code"
                          className={inputClass}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className={labelClass}>
                          Location notes
                        </label>
                        <textarea
                          rows={2}
                          maxLength={1000}
                          value={form.locationNotes}
                          onChange={(event) =>
                            updateField(
                              "locationNotes",
                              event.target.value
                            )
                          }
                          placeholder="Directions or access instructions"
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </section>

                  {/* NOTES */}

                  <section>
                    <label className={labelClass}>Internal notes</label>
                    <textarea
                      rows={3}
                      maxLength={3000}
                      value={form.notes}
                      onChange={(event) =>
                        updateField("notes", event.target.value)
                      }
                      placeholder="Additional notes for your team..."
                      className={inputClass}
                    />
                  </section>
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-white/10 bg-white/[0.02] px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => {
                      setShowForm(false);
                      setEditingJob(null);
                    }}
                    className={`${buttonClass} border border-white/10 text-slate-300 hover:bg-white/5`}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving || optionsLoading}
                    className={`${buttonClass} bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500`}
                  >
                    {saving ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                    {saving
                      ? "Saving..."
                      : editingJob
                        ? "Save Changes"
                        : "Create Job"}
                  </button>
                </div>
              </form>
            </Modal>
          )}
        </AnimatePresence>

        {/* JOB DETAILS MODAL */}

        <AnimatePresence>
          {viewingJob && (
            <Modal
              title={viewingJob.title || "Job details"}
              subtitle={viewingJob.jobNumber || "Job information"}
              onClose={() => setViewingJob(null)}
            >
              <div className="space-y-5 p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <StatusBadge status={viewingJob.status} />
                  <span
                    className={`text-xs font-semibold ${priorityStyles[viewingJob.priority] || priorityStyles.medium}`}
                  >
                    {formatStatus(viewingJob.priority || "medium")} priority
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    ["Customer", getName(viewingJob.customer)],
                    ["Service", getName(viewingJob.service)],
                    ["Assigned staff", getName(viewingJob.staff, "Unassigned")],
                    ["Price", formatMoney(viewingJob.price)],
                    ["Date", formatDate(viewingJob.scheduledDate)],
                    [
                      "Time",
                      `${viewingJob.startTime || "—"} – ${viewingJob.endTime || "—"}`,
                    ],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-3"
                    >
                      <p className="text-xs text-slate-500">{label}</p>
                      <p className="mt-1 break-words text-sm font-medium text-slate-200">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                {viewingJob.description && (
                  <div>
                    <p className={labelClass}>Description</p>
                    <p className="whitespace-pre-wrap text-sm leading-6 text-slate-300">
                      {viewingJob.description}
                    </p>
                  </div>
                )}

                {viewingJob.location?.address && (
                  <div className="rounded-xl border border-white/[0.08] p-3">
                    <p className="flex items-center gap-2 text-xs text-slate-500">
                      <MapPin className="h-4 w-4" />
                      Location
                    </p>
                    <p className="mt-2 text-sm text-slate-200">
                      {viewingJob.location.address}
                      {viewingJob.location.city
                        ? `, ${viewingJob.location.city}`
                        : ""}
                    </p>
                  </div>
                )}

                {viewingJob.notes && (
                  <div>
                    <p className={labelClass}>Internal notes</p>
                    <p className="whitespace-pre-wrap text-sm leading-6 text-slate-300">
                      {viewingJob.notes}
                    </p>
                  </div>
                )}

                <div>
                  <label className={labelClass}>Update status</label>
                  <select
                    value={viewingJob.status || "pending"}
                    disabled={saving}
                    onChange={(event) =>
                      handleStatusChange(viewingJob, event.target.value)
                    }
                    className={inputClass}
                  >
                    {STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {formatStatus(status)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-wrap justify-end gap-3 border-t border-white/10 pt-4">
                  <button
                    type="button"
                    onClick={() => openEditForm(viewingJob)}
                    className={`${buttonClass} border border-white/10 text-slate-200 hover:bg-white/5`}
                  >
                    <Pencil className="h-4 w-4" />
                    Edit Job
                  </button>

                  <button
                    type="button"
                    onClick={() => setJobToCancel(viewingJob)}
                    disabled={
                      saving ||
                      viewingJob.status === "cancelled" ||
                      !viewingJob.isActive
                    }
                    className={`${buttonClass} border border-rose-400/20 bg-rose-400/10 text-rose-200 hover:bg-rose-400/20`}
                  >
                    <Trash2 className="h-4 w-4" />
                    Cancel Job
                  </button>
                </div>
              </div>
            </Modal>
          )}
        </AnimatePresence>

        {/* CANCEL CONFIRMATION */}

        <AnimatePresence>
          {jobToCancel && (
            <Modal
              title="Cancel this job?"
              subtitle="This action will mark the job as cancelled and inactive."
              onClose={() => {
                if (!saving) setJobToCancel(null);
              }}
            >
              <div className="p-5 sm:p-6">
                <div className="rounded-xl border border-rose-400/15 bg-rose-400/[0.06] p-4">
                  <p className="font-medium text-white">
                    {jobToCancel.title}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {jobToCancel.jobNumber}
                  </p>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-400">
                  The job will no longer be active. You cannot use this
                  action to permanently delete the record.
                </p>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => setJobToCancel(null)}
                    className={`${buttonClass} border border-white/10 text-slate-300 hover:bg-white/5`}
                  >
                    Keep Job
                  </button>

                  <button
                    type="button"
                    disabled={saving}
                    onClick={handleCancelJob}
                    className={`${buttonClass} bg-rose-600 text-white hover:bg-rose-500`}
                  >
                    {saving && (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    )}
                    Confirm Cancel
                  </button>
                </div>
              </div>
            </Modal>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
