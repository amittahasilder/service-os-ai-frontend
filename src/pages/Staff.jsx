
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  Mail,
  Pencil,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  UserRound,
  Users,
  X,
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import { useOrganization } from "../context/OrganizationContext";
import {
  archiveStaff,
  createStaff,
  getStaff,
  getStaffStats,
  updateStaff,
} from "../api/staffApi";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  jobTitle: "",
  role: "staff",
  skills: "",
  hourlyRate: "0",
  status: "active",
  availability: "available",
  notes: "",
};

const roles = ["manager", "staff", "technician", "assistant"];
const statuses = ["active", "inactive"];
const availabilities = ["available", "busy", "off"];

const inputClass =
  "w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/20";

const selectClass = `${inputClass} [color-scheme:dark]`;

const getErrorMessage = (error) => {
  const data = error?.response?.data;

  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    return data.errors.map((item) => item.message).join(", ");
  }

  return (
    data?.message ||
    error?.message ||
    "Something went wrong. Please try again."
  );
};

const formatLabel = (value = "") =>
  value.charAt(0).toUpperCase() + value.slice(1);

function StatCard({ title, value, icon: Icon, accent }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 shadow-xl shadow-black/10 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-400">{title}</p>
        <span
          className={`rounded-xl border border-white/10 bg-gradient-to-br ${accent} p-2.5`}
        >
          <Icon size={19} className="text-white" />
        </span>
      </div>

      <p className="mt-4 text-3xl font-semibold tracking-tight text-white">
        {value ?? 0}
      </p>
    </motion.div>
  );
}

function StaffModal({
  staff,
  saving,
  onClose,
  onSave,
}) {
  const [form, setForm] = useState(() => {
    if (!staff) return { ...initialForm };

    return {
      name: staff.name || "",
      email: staff.email || "",
      phone: staff.phone || "",
      jobTitle: staff.jobTitle || "",
      role: staff.role || "staff",
      skills: Array.isArray(staff.skills)
        ? staff.skills.join(", ")
        : "",
      hourlyRate: String(staff.hourlyRate ?? 0),
      status: staff.status || "active",
      availability: staff.availability || "available",
      notes: staff.notes || "",
    };
  });

  const [formError, setFormError] = useState("");

  const changeField = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    if (form.name.trim().length < 2) {
      setFormError("Name must contain at least 2 characters.");
      return;
    }

    const hourlyRate = Number(form.hourlyRate);

    if (!Number.isFinite(hourlyRate) || hourlyRate < 0) {
      setFormError("Enter a valid, non-negative hourly rate.");
      return;
    }

    const staffData = {
      name: form.name.trim(),
      jobTitle: form.jobTitle.trim(),
      role: form.role,
      skills: form.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
      hourlyRate,
      status: form.status,
      availability: form.availability,
      notes: form.notes.trim(),
    };

    // An empty string fails Zod's email validation.
    if (form.email.trim()) {
      staffData.email = form.email.trim();
    }

    if (form.phone.trim()) {
      staffData.phone = form.phone.trim();
    }

    try {
      await onSave(staffData);
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  };

  const field = (label, name, options = {}) => (
    <label className="block space-y-2" key={name}>
      <span className="text-sm font-medium text-slate-300">
        {label}
      </span>
      <input
        className={inputClass}
        name={name}
        value={form[name]}
        onChange={changeField}
        placeholder={options.placeholder || label}
        type={options.type || "text"}
        min={options.min}
        step={options.step}
        maxLength={options.maxLength}
        required={options.required}
      />
    </label>
  );

  const selectField = (label, name, options) => (
    <label className="block space-y-2" key={name}>
      <span className="text-sm font-medium text-slate-300">
        {label}
      </span>
      <select
        className={selectClass}
        name={name}
        value={form[name]}
        onChange={changeField}
      >
        {options.map((option) => (
          <option value={option} key={option}>
            {formatLabel(option)}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-md"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) {
          onClose();
        }
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className="my-auto max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-violet-400/20 bg-[#111019] shadow-2xl shadow-violet-950/30"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#111019]/95 p-5 backdrop-blur-xl">
          <div>
            <p className="text-lg font-semibold text-white">
              {staff ? "Edit Staff Member" : "Add Staff Member"}
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Manage your team information.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close dialog"
            className="rounded-xl border border-white/10 p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            <X size={19} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-5">
          {formError && (
            <div
              role="alert"
              className="rounded-xl border border-rose-400/20 bg-rose-500/10 p-3 text-sm text-rose-300"
            >
              {formError}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {field("Full name *", "name", {
              required: true,
              maxLength: 150,
              placeholder: "Enter staff name",
            })}
            {field("Job title", "jobTitle", {
              maxLength: 100,
              placeholder: "e.g. Senior Technician",
            })}
            {field("Email", "email", {
              type: "email",
              maxLength: 150,
              placeholder: "name@example.com",
            })}
            {field("Phone", "phone", {
              maxLength: 30,
              placeholder: "Phone number",
            })}
            {selectField("Role", "role", roles)}
            {field("Hourly rate", "hourlyRate", {
              type: "number",
              min: 0,
              step: "0.01",
              required: true,
            })}
            {selectField("Status", "status", statuses)}
            {selectField(
              "Availability",
              "availability",
              availabilities
            )}
          </div>

          {field("Skills (comma separated)", "skills", {
            maxLength: 1000,
            placeholder: "Cleaning, Plumbing, Customer service",
          })}

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-300">
              Notes
            </span>
            <textarea
              className={`${inputClass} min-h-24 resize-y`}
              name="notes"
              value={form.notes}
              onChange={changeField}
              maxLength={2000}
              placeholder="Additional team member information..."
            />
          </label>

          <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={saving}
              onClick={onClose}
              className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving && (
                <LoaderCircle size={17} className="animate-spin" />
              )}
              {saving
                ? "Saving..."
                : staff
                  ? "Save Changes"
                  : "Create Staff"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

function StaffCard({ staff, onEdit, onArchive }) {
  const initials = (staff.name || "S")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const availabilityStyle = {
    available: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    busy: "border-amber-400/20 bg-amber-400/10 text-amber-300",
    off: "border-slate-400/20 bg-slate-400/10 text-slate-300",
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      whileHover={{ y: -3 }}
      className="group rounded-2xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl transition-colors hover:border-violet-400/30 hover:bg-white/[0.055]"
    >
      <div className="flex items-start gap-3">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-500/25 to-fuchsia-500/10 text-sm font-bold text-violet-200">
          {initials}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-white">
            {staff.name}
          </h3>
          <p className="mt-1 truncate text-sm text-slate-400">
            {staff.jobTitle || "Staff"}
          </p>
        </div>

        <div className="flex gap-1">
          <button
            type="button"
            title="Edit staff"
            aria-label={`Edit ${staff.name}`}
            onClick={() => onEdit(staff)}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-violet-500/15 hover:text-violet-300"
          >
            <Pencil size={16} />
          </button>
          <button
            type="button"
            title="Archive staff"
            aria-label={`Archive ${staff.name}`}
            onClick={() => onArchive(staff)}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-500/15 hover:text-rose-300"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-xs text-violet-200">
          {formatLabel(staff.role || "staff")}
        </span>
        <span
          className={`rounded-full border px-3 py-1 text-xs ${
            availabilityStyle[staff.availability] ||
            availabilityStyle.off
          }`}
        >
          {formatLabel(staff.availability || "off")}
        </span>
        <span
          className={`rounded-full px-3 py-1 text-xs ${
            staff.status === "active"
              ? "bg-emerald-500/10 text-emerald-300"
              : "bg-slate-500/10 text-slate-300"
          }`}
        >
          {formatLabel(staff.status || "active")}
        </span>
      </div>

      <div className="mt-5 space-y-3 border-t border-white/[0.07] pt-4 text-sm text-slate-400">
        {staff.email && (
          <p className="flex items-center gap-2 break-all">
            <Mail size={15} className="shrink-0 text-violet-300" />
            {staff.email}
          </p>
        )}
        {staff.phone && (
          <p className="flex items-center gap-2">
            <Phone size={15} className="shrink-0 text-violet-300" />
            {staff.phone}
          </p>
        )}
        <p className="flex items-center gap-2">
          <BriefcaseBusiness
            size={15}
            className="shrink-0 text-violet-300"
          />
          Hourly rate: {Number(staff.hourlyRate || 0).toLocaleString()}
        </p>
      </div>

      {Array.isArray(staff.skills) && staff.skills.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {staff.skills.slice(0, 4).map((skill, index) => (
            <span
              key={`${skill}-${index}`}
              className="rounded-lg border border-white/[0.08] bg-black/20 px-2.5 py-1 text-xs text-slate-400"
            >
              {skill}
            </span>
          ))}
          {staff.skills.length > 4 && (
            <span className="px-1 py-1 text-xs text-slate-500">
              +{staff.skills.length - 4}
            </span>
          )}
        </div>
      )}
    </motion.article>
  );
}

export default function Staff() {
  const { currentOrganization } = useOrganization();
  const organizationId = currentOrganization?._id || currentOrganization?.id;

  const [staffList, setStaffList] = useState([]);
  const [stats, setStats] = useState({});
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [role, setRole] = useState("");
  const [availability, setAvailability] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageError, setPageError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  const loadStaff = useCallback(
    async ({ silent = false } = {}) => {
      if (!organizationId) {
        setStaffList([]);
        setStats({});
        setLoading(false);
        return;
      }

      if (!silent) setLoading(true);
      setPageError("");

      try {
        const [listResponse, statsResponse] = await Promise.all([
          getStaff({
            organizationId,
            search,
            status,
            role,
            availability,
          }),
          getStaffStats(organizationId),
        ]);

        setStaffList(
          Array.isArray(listResponse?.data) ? listResponse.data : []
        );
        setStats(statsResponse?.data || {});
      } catch (error) {
        setPageError(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    },
    [organizationId, search, status, role, availability]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      loadStaff();
    }, 250);

    return () => clearTimeout(timer);
  }, [loadStaff]);

  const handleSave = async (staffData) => {
    setSaving(true);
    setPageError("");

    try {
      if (editingStaff) {
        await updateStaff({
          organizationId,
          staffId: editingStaff._id || editingStaff.id,
          staffData,
        });
      } else {
        await createStaff({ organizationId, staffData });
      }

      setModalOpen(false);
      setEditingStaff(null);
      await loadStaff({ silent: true });
    } catch (error) {
      setPageError(getErrorMessage(error));
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const handleArchive = async (staff) => {
    const confirmed = window.confirm(
      `Archive ${staff.name}? This will remove them from the active staff list.`
    );

    if (!confirmed) return;

    setPageError("");

    try {
      await archiveStaff({
        organizationId,
        staffId: staff._id || staff.id,
      });

      await loadStaff({ silent: true });
    } catch (error) {
      setPageError(getErrorMessage(error));
    }
  };

  const openCreateModal = () => {
    setEditingStaff(null);
    setModalOpen(true);
  };

  const openEditModal = (staff) => {
    setEditingStaff(staff);
    setModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="min-h-full space-y-7 bg-transparent pb-10 text-white">
        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-violet-300">
              <ShieldCheck size={15} />
              Team Management
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Staff{" "}
              <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
                Management
              </span>
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
              Manage your team, skills, roles and availability from one place.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            disabled={!organizationId}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={18} />
            Add Staff
          </button>
        </header>

        {!organizationId && (
          <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5 text-sm text-amber-200">
            Select a business from the organization switcher to manage its staff.
          </div>
        )}

        {pageError && (
          <div
            role="alert"
            className="flex items-start justify-between gap-3 rounded-2xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-200"
          >
            <p>{pageError}</p>
            <button
              type="button"
              onClick={() => loadStaff()}
              className="shrink-0 font-semibold underline underline-offset-4"
            >
              Retry
            </button>
          </div>
        )}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Staff"
            value={stats.totalStaff}
            icon={Users}
            accent="from-violet-500/30 to-violet-900/10"
          />
          <StatCard
            title="Active Staff"
            value={stats.activeStaff}
            icon={CheckCircle2}
            accent="from-emerald-500/30 to-emerald-900/10"
          />
          <StatCard
            title="Available Now"
            value={stats.availableStaff}
            icon={Activity}
            accent="from-cyan-500/30 to-cyan-900/10"
          />
          <StatCard
            title="Busy Staff"
            value={stats.busyStaff}
            icon={Clock3}
            accent="from-amber-500/30 to-amber-900/10"
          />
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 backdrop-blur-xl sm:p-5">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, email, skills..."
                aria-label="Search staff"
                className={`${inputClass} pl-10`}
              />
            </div>

            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              aria-label="Filter by status"
              className={selectClass}
            >
              <option value="">All statuses</option>
              {statuses.map((item) => (
                <option key={item} value={item}>
                  {formatLabel(item)}
                </option>
              ))}
            </select>

            <select
              value={role}
              onChange={(event) => setRole(event.target.value)}
              aria-label="Filter by role"
              className={selectClass}
            >
              <option value="">All roles</option>
              {roles.map((item) => (
                <option key={item} value={item}>
                  {formatLabel(item)}
                </option>
              ))}
            </select>

            <select
              value={availability}
              onChange={(event) => setAvailability(event.target.value)}
              aria-label="Filter by availability"
              className={selectClass}
            >
              <option value="">All availability</option>
              {availabilities.map((item) => (
                <option key={item} value={item}>
                  {formatLabel(item)}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 text-sm text-slate-400">
            <span>
              {staffList.length} team member
              {staffList.length === 1 ? "" : "s"}
            </span>
            {(search || status || role || availability) && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatus("");
                  setRole("");
                  setAvailability("");
                }}
                className="text-violet-300 transition hover:text-violet-200"
              >
                Clear filters
              </button>
            )}
          </div>
        </section>

        {loading ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.025]">
            <LoaderCircle
              size={30}
              className="animate-spin text-violet-300"
            />
            <p className="text-sm text-slate-400">
              Loading your team...
            </p>
          </div>
        ) : staffList.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-5 text-center">
            <div className="mb-4 rounded-2xl border border-violet-400/20 bg-violet-500/10 p-4">
              <UserRound size={28} className="text-violet-300" />
            </div>
            <h2 className="text-lg font-semibold text-white">
              {search || status || role || availability
                ? "No matching staff found"
                : "Build your team"}
            </h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
              {search || status || role || availability
                ? "Try changing your search or filters."
                : "Add your first team member to start managing roles, skills and availability."}
            </p>
            {search || status || role || availability ? (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatus("");
                  setRole("");
                  setAvailability("");
                }}
                className="mt-5 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-200 transition hover:bg-white/5"
              >
                Clear filters
              </button>
            ) : (
              <button
                type="button"
                onClick={openCreateModal}
                disabled={!organizationId}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:opacity-50"
              >
                <Plus size={17} />
                Add your first staff member
              </button>
            )}
          </div>
        ) : (
          <motion.div
            layout
            className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {staffList.map((staff) => (
                <StaffCard
                  key={staff._id || staff.id}
                  staff={staff}
                  onEdit={openEditModal}
                  onArchive={handleArchive}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        <AnimatePresence>
          {modalOpen && (
            <StaffModal
              key={editingStaff?._id || "new-staff"}
              staff={editingStaff}
              saving={saving}
              onClose={() => {
                setModalOpen(false);
                setEditingStaff(null);
              }}
              onSave={handleSave}
            />
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
