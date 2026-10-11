
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BadgeCheck,
  BriefcaseBusiness,
  CalendarClock,
  Check,
  ChevronDown,
  Clock3,
  DollarSign,
  Edit3,
  Globe,
  Layers3,
  LoaderCircle,
  PackagePlus,
  Plus,
  RefreshCw,
  Search,
  Settings2,
  Sparkles,
  Tag,
  Trash2,
  X,
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import { useOrganization } from "../context/OrganizationContext";

import {
  getServices,
  getServiceStats,
  createService,
  updateService,
  archiveService,
} from "../api/serviceApi";

// =====================================================
// CONSTANTS
// =====================================================

const CATEGORIES = [
  "Cleaning",
  "Plumbing",
  "HVAC",
  "Electrical",
  "Repair",
  "Salon",
  "Consulting",
  "Agency",
  "Other",
];

const STATUSES = ["active", "inactive"];

const INITIAL_FORM = {
  name: "",
  description: "",
  category: "Other",
  price: "0",
  duration: "60",
  durationUnit: "minutes",
  status: "active",
  taxRate: "0",
  isOnline: false,
  notes: "",
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

const getErrorMessage = (error) => {
  const data = error?.response?.data;

  if (Array.isArray(data?.errors) && data.errors.length) {
    return data.errors
      .map((item) => item.message)
      .filter(Boolean)
      .join(" ");
  }

  return (
    data?.message ||
    error?.message ||
    "Something went wrong. Please try again."
  );
};

const extractServices = (response) => {
  const candidates = [
    response?.data?.services,
    response?.services,
    response?.data?.data?.services,
    response?.data,
    response,
  ];

  return candidates.find(Array.isArray) || [];
};

const extractStats = (response, services = []) => {
  const candidates = [
    response?.data?.stats,
    response?.stats,
    response?.data?.data,
    response?.data,
    response,
  ];

  const stats =
    candidates.find(
      (item) =>
        item &&
        typeof item === "object" &&
        !Array.isArray(item)
    ) || {};

  return {
    total:
      stats.totalServices ??
      stats.total ??
      stats.totalCount ??
      services.length,
    active:
      stats.activeServices ??
      stats.active ??
      services.filter((service) => service.status === "active")
        .length,
    inactive:
      stats.inactiveServices ??
      stats.inactive ??
      services.filter((service) => service.status === "inactive")
        .length,
    online:
      stats.onlineServices ??
      stats.online ??
      services.filter((service) => service.isOnline).length,
    revenue:
      stats.totalRevenue ??
      stats.revenue ??
      services.reduce(
        (total, service) => total + (Number(service.price) || 0),
        0
      ),
  };
};

// =====================================================
// REUSABLE UI
// =====================================================

function GlassCard({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-white/[0.09] bg-[#100d1d]/75 shadow-[0_12px_50px_rgba(0,0,0,0.18)] backdrop-blur-2xl ${className}`}
    >
      {children}
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  color,
  delay = 0,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#100d1d]/75 p-5 shadow-xl backdrop-blur-xl"
    >
      <div
        className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-10 blur-3xl transition-opacity group-hover:opacity-25 ${color}`}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <h3 className="mt-3 text-2xl font-bold tracking-tight text-white">
            {value}
          </h3>
          <p className="mt-2 text-xs text-slate-500">{description}</p>
        </div>

        <div
          className={`rounded-xl border border-white/10 p-3 ${color.replace(
            "bg-",
            "bg-"
          )}/10`}
        >
          <Icon size={20} className="text-white" />
        </div>
      </div>
    </motion.div>
  );
}

function StatusBadge({ status }) {
  const active = status === "active";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${
        active
          ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
          : "border-slate-400/20 bg-slate-400/10 text-slate-300"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active ? "bg-emerald-400" : "bg-slate-400"
        }`}
      />
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function Field({ label, required, children, hint }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-300">
        {label}
        {required && <span className="ml-1 text-rose-400">*</span>}
      </span>
      {children}
      {hint && <span className="block text-xs text-slate-500">{hint}</span>}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-white/10 bg-black/25 px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/10";

function ServiceModal({
  open,
  service,
  saving,
  onClose,
  onSave,
}) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!open) return;

    if (service) {
      setForm({
        name: service.name || "",
        description: service.description || "",
        category: service.category || "Other",
        price: String(service.price ?? 0),
        duration: String(service.duration ?? 60),
        durationUnit: service.durationUnit || "minutes",
        status: service.status || "active",
        taxRate: String(service.taxRate ?? 0),
        isOnline: Boolean(service.isOnline),
        notes: service.notes || "",
      });
    } else {
      setForm(INITIAL_FORM);
    }

    setFormError("");
  }, [open, service]);

  const setField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    if (!form.name.trim()) {
      setFormError("Service name is required.");
      return;
    }

    const price = Number(form.price);
    const duration = Number(form.duration);
    const taxRate = Number(form.taxRate);

    if (!Number.isFinite(price) || price < 0) {
      setFormError("Price must be a valid non-negative number.");
      return;
    }

    if (!Number.isFinite(duration) || duration <= 0) {
      setFormError("Duration must be greater than zero.");
      return;
    }

    if (
      !Number.isFinite(taxRate) ||
      taxRate < 0 ||
      taxRate > 100
    ) {
      setFormError("Tax rate must be between 0 and 100.");
      return;
    }

    const serviceData = {
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category,
      price,
      duration,
      durationUnit: form.durationUnit,
      status: form.status,
      taxRate,
      isOnline: form.isOnline,
      notes: form.notes.trim(),
    };

    try {
      await onSave(serviceData);
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving) {
              onClose();
            }
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="my-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-[#100d1d] shadow-[0_30px_100px_rgba(0,0,0,0.6)]"
          >
            <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-5">
              <div>
                <div className="flex items-center gap-2 text-violet-300">
                  <Sparkles size={17} />
                  <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                    Service management
                  </span>
                </div>
                <h2 className="mt-2 text-xl font-bold text-white">
                  {service ? "Edit service" : "Create a service"}
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Configure pricing, availability and service details.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="rounded-xl border border-white/10 p-2 text-slate-400 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
                aria-label="Close dialog"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid max-h-[65vh] grid-cols-1 gap-5 overflow-y-auto p-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field label="Service name" required>
                    <input
                      className={inputClass}
                      placeholder="e.g. Premium home cleaning"
                      value={form.name}
                      onChange={(event) =>
                        setField("name", event.target.value)
                      }
                      maxLength={120}
                      required
                    />
                  </Field>
                </div>

                <div className="sm:col-span-2">
                  <Field label="Description">
                    <textarea
                      className={`${inputClass} min-h-24 resize-y`}
                      placeholder="Describe what this service includes..."
                      value={form.description}
                      onChange={(event) =>
                        setField("description", event.target.value)
                      }
                      maxLength={2000}
                    />
                  </Field>
                </div>

                <Field label="Category" required>
                  <select
                    className={inputClass}
                    value={form.category}
                    onChange={(event) =>
                      setField("category", event.target.value)
                    }
                  >
                    {CATEGORIES.map((category) => (
                      <option
                        key={category}
                        value={category}
                        className="bg-[#100d1d]"
                      >
                        {category}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Status">
                  <select
                    className={inputClass}
                    value={form.status}
                    onChange={(event) =>
                      setField("status", event.target.value)
                    }
                  >
                    <option value="active" className="bg-[#100d1d]">
                      Active
                    </option>
                    <option value="inactive" className="bg-[#100d1d]">
                      Inactive
                    </option>
                  </select>
                </Field>

                <Field label="Price" required>
                  <div className="relative">
                    <DollarSign
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className={`${inputClass} pl-9`}
                      value={form.price}
                      onChange={(event) =>
                        setField("price", event.target.value)
                      }
                      required
                    />
                  </div>
                </Field>

                <Field label="Tax rate (%)">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    className={inputClass}
                    value={form.taxRate}
                    onChange={(event) =>
                      setField("taxRate", event.target.value)
                    }
                  />
                </Field>

                <Field label="Duration" required>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    className={inputClass}
                    value={form.duration}
                    onChange={(event) =>
                      setField("duration", event.target.value)
                    }
                    required
                  />
                </Field>

                <Field label="Duration unit">
                  <select
                    className={inputClass}
                    value={form.durationUnit}
                    onChange={(event) =>
                      setField("durationUnit", event.target.value)
                    }
                  >
                    <option value="minutes" className="bg-[#100d1d]">
                      Minutes
                    </option>
                    <option value="hours" className="bg-[#100d1d]">
                      Hours
                    </option>
                    <option value="days" className="bg-[#100d1d]">
                      Days
                    </option>
                  </select>
                </Field>

                <div className="sm:col-span-2">
                  <Field label="Internal notes">
                    <textarea
                      className={`${inputClass} min-h-20 resize-y`}
                      placeholder="Optional notes for your team..."
                      value={form.notes}
                      onChange={(event) =>
                        setField("notes", event.target.value)
                      }
                      maxLength={2000}
                    />
                  </Field>
                </div>

                <div className="sm:col-span-2">
                  <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 transition hover:border-violet-400/30">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-cyan-400/10 p-2.5 text-cyan-300">
                        <Globe size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          Online availability
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Mark this service as available online.
                        </p>
                      </div>
                    </div>

                    <input
                      type="checkbox"
                      checked={form.isOnline}
                      onChange={(event) =>
                        setField("isOnline", event.target.checked)
                      }
                      className="h-4 w-4 accent-violet-500"
                    />
                  </label>
                </div>

                {formError && (
                  <div className="sm:col-span-2 rounded-xl border border-rose-400/20 bg-rose-400/[0.08] px-4 py-3 text-sm text-rose-300">
                    {formError}
                  </div>
                )}
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-white/[0.08] px-6 py-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={saving}
                  className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-900/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <LoaderCircle size={17} className="animate-spin" />
                  ) : (
                    <Check size={17} />
                  )}
                  {saving
                    ? "Saving..."
                    : service
                      ? "Save changes"
                      : "Create service"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// =====================================================
// SERVICE ROW
// =====================================================

function ServiceRow({ service, index, onEdit, onArchive }) {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.035, 0.25) }}
      className="group border-b border-white/[0.055] transition hover:bg-violet-400/[0.035]"
    >
      <td className="px-5 py-4">
        <div className="flex min-w-48 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-400/15 bg-gradient-to-br from-violet-500/20 to-cyan-500/10 text-violet-200">
            <BriefcaseBusiness size={19} />
          </div>

          <div className="min-w-0">
            <p className="truncate font-semibold text-white">
              {service.name || "Untitled service"}
            </p>
            <p className="mt-1 max-w-64 truncate text-xs text-slate-500">
              {service.description || "No description added"}
            </p>
          </div>
        </div>
      </td>

      <td className="px-5 py-4">
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.025] px-2.5 py-1.5 text-xs text-slate-300">
          <Tag size={12} />
          {service.category || "Uncategorized"}
        </span>
      </td>

      <td className="px-5 py-4">
        <p className="font-semibold text-white">
          {formatCurrency(service.price)}
        </p>
        {Number(service.taxRate) > 0 && (
          <p className="mt-1 text-xs text-slate-500">
            + {service.taxRate}% tax
          </p>
        )}
      </td>

      <td className="px-5 py-4">
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <Clock3 size={15} className="text-slate-500" />
          {service.duration || 0} {service.durationUnit || "minutes"}
        </div>
      </td>

      <td className="px-5 py-4">
        <div className="flex flex-col items-start gap-2">
          <StatusBadge status={service.status} />
          {service.isOnline && (
            <span className="inline-flex items-center gap-1 text-xs text-cyan-300">
              <Globe size={12} />
              Online
            </span>
          )}
        </div>
      </td>

      <td className="px-5 py-4 text-right">
        <div className="flex items-center justify-end gap-2 opacity-100 transition sm:opacity-70 sm:group-hover:opacity-100">
          <button
            type="button"
            onClick={() => onEdit(service)}
            title="Edit service"
            className="rounded-lg border border-white/[0.08] p-2 text-slate-400 transition hover:border-violet-400/30 hover:bg-violet-400/10 hover:text-violet-200"
          >
            <Edit3 size={15} />
          </button>

          <button
            type="button"
            onClick={() => onArchive(service)}
            title="Archive service"
            className="rounded-lg border border-white/[0.08] p-2 text-slate-400 transition hover:border-rose-400/30 hover:bg-rose-400/10 hover:text-rose-300"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </td>
    </motion.tr>
  );
}

// =====================================================
// MAIN PAGE
// =====================================================

export default function Services() {
  const organizationContext = useOrganization();

  const organization =
    organizationContext?.currentOrganization ||
    organizationContext?.organization ||
    null;

  const organizationId = organization?._id || organization?.id || "";

  const [services, setServices] = useState([]);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pageError, setPageError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [archiveTarget, setArchiveTarget] = useState(null);
  const [archiving, setArchiving] = useState(false);

  const loadServices = useCallback(
    async ({ silent = false } = {}) => {
      if (!organizationId) {
        setServices([]);
        setStats(null);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setPageError("");

      try {
        const [servicesResult, statsResult] = await Promise.all([
          getServices({
            organizationId,
            search,
            category,
            status,
          }),
          getServiceStats(organizationId).catch(() => null),
        ]);

        const nextServices = extractServices(servicesResult);

        setServices(nextServices);
        setStats(
          statsResult
            ? extractStats(statsResult, nextServices)
            : extractStats(null, nextServices)
        );
      } catch (error) {
        setPageError(getErrorMessage(error));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [organizationId, search, category, status]
  );

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const derivedStats = useMemo(
    () => stats || extractStats(null, services),
    [stats, services]
  );

  const handleSave = async (serviceData) => {
    if (!organizationId) {
      throw new Error("Select a business before saving a service.");
    }

    setSaving(true);
    setPageError("");

    try {
      if (editingService) {
        await updateService({
          organizationId,
          serviceId: editingService._id || editingService.id,
          serviceData,
        });
      } else {
        await createService({
          organizationId,
          serviceData,
        });
      }

      setModalOpen(false);
      setEditingService(null);
      await loadServices({ silent: true });
    } catch (error) {
      setPageError(getErrorMessage(error));
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const handleArchive = async () => {
    if (!archiveTarget || !organizationId) return;

    setArchiving(true);
    setPageError("");

    try {
      await archiveService({
        organizationId,
        serviceId: archiveTarget._id || archiveTarget.id,
      });

      setArchiveTarget(null);
      await loadServices({ silent: true });
    } catch (error) {
      setPageError(getErrorMessage(error));
    } finally {
      setArchiving(false);
    }
  };

  const openCreateModal = () => {
    setEditingService(null);
    setModalOpen(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
    setEditingService(null);
  };

  return (
    <DashboardLayout>
      <div className="relative min-h-full overflow-hidden bg-[#090711] text-white">
        {/* Ambient background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-violet-700/10 blur-[120px]" />
          <div className="absolute -left-40 top-[35%] h-80 w-80 rounded-full bg-cyan-500/[0.06] blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-[1600px] space-y-7 p-4 sm:p-6 xl:p-8">
          {/* Page heading */}
          <motion.header
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center"
          >
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/[0.07] px-3 py-1.5 text-xs font-semibold tracking-wide text-violet-200">
                <Sparkles size={14} />
                SERVICE CATALOG
                <span className="h-1 w-1 rounded-full bg-violet-300" />
                WORKSPACE
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Services
                <span className="text-violet-400">.</span>
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                Manage your service catalog, pricing, duration and online
                availability from one workspace.
              </p>

              {organization?.name && (
                <p className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                  <Layers3 size={14} />
                  Workspace:
                  <span className="font-medium text-slate-300">
                    {organization.name}
                  </span>
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => loadServices({ silent: true })}
                disabled={loading || refreshing || !organizationId}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm font-medium text-slate-300 transition hover:border-white/20 hover:bg-white/[0.07] disabled:opacity-50"
              >
                <RefreshCw
                  size={16}
                  className={refreshing ? "animate-spin" : ""}
                />
                Refresh
              </button>

              <button
                type="button"
                onClick={openCreateModal}
                disabled={!organizationId}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-900/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus size={17} />
                Add service
              </button>
            </div>
          </motion.header>

          {/* No organization selected */}
          {!organizationId && (
            <GlassCard className="p-8 sm:p-12">
              <div className="mx-auto flex max-w-md flex-col items-center text-center">
                <div className="rounded-2xl border border-violet-400/20 bg-violet-400/10 p-4 text-violet-200">
                  <Layers3 size={30} />
                </div>
                <h2 className="mt-5 text-xl font-semibold text-white">
                  Select a business
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Choose a workspace from your organization switcher to
                  view and manage its services.
                </p>
              </div>
            </GlassCard>
          )}

          {organizationId && (
            <>
              {/* Statistics */}
              <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  title="Total services"
                  value={derivedStats.total}
                  description="Services in this catalog"
                  icon={BriefcaseBusiness}
                  color="bg-violet-500"
                  delay={0}
                />
                <StatCard
                  title="Active services"
                  value={derivedStats.active}
                  description="Available for your team"
                  icon={Activity}
                  color="bg-emerald-500"
                  delay={0.05}
                />
                <StatCard
                  title="Online services"
                  value={derivedStats.online}
                  description="Marked for online availability"
                  icon={Globe}
                  color="bg-cyan-500"
                  delay={0.1}
                />
                <StatCard
                  title="Catalog value"
                  value={formatCurrency(derivedStats.revenue)}
                  description="Sum of listed service prices"
                  icon={DollarSign}
                  color="bg-amber-500"
                  delay={0.15}
                />
              </section>

              {/* Filters */}
              <GlassCard className="p-4 sm:p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Settings2 size={17} className="text-violet-300" />
                  <h2 className="text-sm font-semibold text-white">
                    Find a service
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(200px,1fr)_200px_180px]">
                  <div className="relative">
                    <Search
                      size={17}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                    <input
                      type="search"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search services..."
                      className={`${inputClass} pl-10`}
                    />
                  </div>

                  <div className="relative">
                    <Tag
                      size={15}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                    <select
                      value={category}
                      onChange={(event) => setCategory(event.target.value)}
                      className={`${inputClass} appearance-none pl-10 pr-9`}
                    >
                      <option value="" className="bg-[#100d1d]">
                        All categories
                      </option>
                      {CATEGORIES.map((item) => (
                        <option
                          key={item}
                          value={item}
                          className="bg-[#100d1d]"
                        >
                          {item}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={15}
                      className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                  </div>

                  <div className="relative">
                    <Activity
                      size={15}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                    <select
                      value={status}
                      onChange={(event) => setStatus(event.target.value)}
                      className={`${inputClass} appearance-none pl-10 pr-9`}
                    >
                      <option value="" className="bg-[#100d1d]">
                        All statuses
                      </option>
                      {STATUSES.map((item) => (
                        <option
                          key={item}
                          value={item}
                          className="bg-[#100d1d]"
                        >
                          {item.charAt(0).toUpperCase() + item.slice(1)}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={15}
                      className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                  </div>
                </div>
              </GlassCard>

              {/* Main table */}
              <GlassCard className="overflow-hidden">
                <div className="flex flex-col gap-3 border-b border-white/[0.07] px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-white">
                      Service catalog
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      {services.length} service
                      {services.length === 1 ? "" : "s"} returned by the
                      current filters
                    </p>
                  </div>

                  <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-xs text-slate-400">
                    <CalendarClock size={14} />
                    Live workspace data
                  </div>
                </div>

                {pageError && (
                  <div className="m-5 flex items-start gap-3 rounded-xl border border-rose-400/20 bg-rose-400/[0.07] p-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-rose-300">
                        Unable to complete the request
                      </p>
                      <p className="mt-1 break-words text-sm text-rose-200/80">
                        {pageError}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => loadServices()}
                      className="shrink-0 rounded-lg border border-rose-400/20 px-3 py-2 text-xs font-medium text-rose-200 hover:bg-rose-400/10"
                    >
                      Retry
                    </button>
                  </div>
                )}

                {loading ? (
                  <div className="flex min-h-72 flex-col items-center justify-center gap-4">
                    <div className="rounded-2xl border border-violet-400/20 bg-violet-400/10 p-4">
                      <LoaderCircle
                        size={26}
                        className="animate-spin text-violet-300"
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-white">
                        Loading service catalog
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Connecting to your workspace...
                      </p>
                    </div>
                  </div>
                ) : services.length === 0 ? (
                  <div className="flex min-h-72 flex-col items-center justify-center px-5 py-12 text-center">
                    <div className="rounded-2xl border border-violet-400/15 bg-violet-400/[0.07] p-4 text-violet-300">
                      <PackagePlus size={29} />
                    </div>

                    <h3 className="mt-5 text-lg font-semibold text-white">
                      {search || category || status
                        ? "No matching services"
                        : "Your catalog starts here"}
                    </h3>

                    <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
                      {search || category || status
                        ? "Try changing your search or filters to find the service you need."
                        : "Create your first service to organize pricing, duration and availability for your business."}
                    </p>

                    {search || category || status ? (
                      <button
                        type="button"
                        onClick={() => {
                          setSearch("");
                          setCategory("");
                          setStatus("");
                        }}
                        className="mt-5 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-white/5"
                      >
                        Clear filters
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={openCreateModal}
                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
                      >
                        <Plus size={16} />
                        Create first service
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px] text-left">
                      <thead className="border-b border-white/[0.06] bg-white/[0.02]">
                        <tr className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                          <th className="px-5 py-4">Service</th>
                          <th className="px-5 py-4">Category</th>
                          <th className="px-5 py-4">Price</th>
                          <th className="px-5 py-4">Duration</th>
                          <th className="px-5 py-4">Availability</th>
                          <th className="px-5 py-4 text-right">Actions</th>
                        </tr>
                      </thead>

                      <tbody>
                        {services.map((service, index) => (
                          <ServiceRow
                            key={service._id || service.id || index}
                            service={service}
                            index={index}
                            onEdit={openEditModal}
                            onArchive={setArchiveTarget}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </GlassCard>

              {/* Small footer */}
              <div className="flex flex-col gap-2 pb-3 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  ServiceOS workspace
                </span>
                <span>Service management · Organization-scoped data</span>
              </div>
            </>
          )}
        </div>
      </div>

      <ServiceModal
        open={modalOpen}
        service={editingService}
        saving={saving}
        onClose={closeModal}
        onSave={handleSave}
      />

      {/* Archive confirmation */}
      <AnimatePresence>
        {archiveTarget && (
          <motion.div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full max-w-md rounded-3xl border border-white/10 bg-[#100d1d] p-6 shadow-2xl"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-400/20 bg-rose-400/10 text-rose-300">
                <Trash2 size={22} />
              </div>

              <h3 className="mt-5 text-xl font-bold text-white">
                Archive this service?
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                You are about to archive{" "}
                <span className="font-semibold text-white">
                  {archiveTarget.name}
                </span>
                . Confirm that you want to continue.
              </p>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  disabled={archiving}
                  onClick={() => setArchiveTarget(null)}
                  className="rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-300 hover:bg-white/5 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={archiving}
                  onClick={handleArchive}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-400 disabled:opacity-60"
                >
                  {archiving ? (
                    <LoaderCircle size={16} className="animate-spin" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                  {archiving ? "Archiving..." : "Confirm archive"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
