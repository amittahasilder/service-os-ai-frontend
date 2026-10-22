
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getQuotes,
  getQuoteStats,
  createQuote,
  updateQuote,
  deleteQuote,
  getQuoteById,
} from "../api/quoteApi";
import { getCustomers } from "../api/customerApi";
import { getJobs } from "../api/jobApi";

const STATUSES = [
  "draft",
  "sent",
  "accepted",
  "rejected",
  "expired",
  "cancelled",
];

const emptyItem = () => ({
  name: "",
  description: "",
  quantity: 1,
  unitPrice: 0,
});

const emptyForm = () => ({
  job: "",
  customer: "",
  title: "",
  description: "",
  items: [emptyItem()],
  discountType: "fixed",
  discountValue: 0,
  taxRate: 0,
  currency: "BDT",
  issueDate: new Date().toISOString().slice(0, 10),
  expiryDate: "",
  status: "draft",
  customerNotes: "",
  termsAndConditions: "",
});

const getOrgId = () => {
  try {
    const saved = localStorage.getItem("serviceos_current_organization");
    if (!saved) return "";

    try {
      const parsed = JSON.parse(saved);

      if (typeof parsed === "string") return parsed;

      return (
        parsed?._id ||
        parsed?.id ||
        parsed?.organizationId ||
        parsed?.currentOrganization?._id ||
        parsed?.organization?._id ||
        ""
      );
    } catch {
      return saved;
    }
  } catch {
    return "";
  }
};

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  "Something went wrong. Please try again.";

const unwrapArray = (result, keys = []) => {
  for (const key of keys) {
    if (Array.isArray(result?.[key])) return result[key];
    if (Array.isArray(result?.data?.[key])) return result.data[key];
  }

  if (Array.isArray(result?.data)) return result.data;
  if (Array.isArray(result)) return result;

  return [];
};

const unwrapQuote = (result) =>
  result?.data?.quote ||
  result?.data?.data ||
  result?.data ||
  result?.quote ||
  result;

const money = (value, currency = "BDT") =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: /^[A-Z]{3}$/.test(currency || "") ? currency : "BDT",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

const prettyStatus = (status = "draft") =>
  status.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());

const statusStyle = (status) => {
  const styles = {
    draft: "border-slate-500/30 bg-slate-500/10 text-slate-300",
    sent: "border-sky-400/30 bg-sky-400/10 text-sky-300",
    accepted: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
    rejected: "border-rose-400/30 bg-rose-400/10 text-rose-300",
    expired: "border-amber-400/30 bg-amber-400/10 text-amber-300",
    cancelled: "border-red-400/30 bg-red-400/10 text-red-300",
  };

  return styles[status] || styles.draft;
};

const StatCard = ({ label, value, detail, accent }) => (
  <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5">
    <div className="flex items-center justify-between gap-3">
      <p className="text-sm text-slate-400">{label}</p>
      <span className={`h-2.5 w-2.5 rounded-full ${accent}`} />
    </div>
    <p className="mt-3 text-2xl font-bold tracking-tight text-white">
      {value}
    </p>
    <p className="mt-1 text-xs text-slate-500">{detail}</p>
  </div>
);

const Field = ({ label, children }) => (
  <label className="block space-y-2">
    <span className="text-sm font-medium text-slate-300">{label}</span>
    {children}
  </label>
);

const inputClass =
  "w-full rounded-xl border border-white/10 bg-[#11101d] px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/70 focus:ring-2 focus:ring-violet-500/15";

export default function Quotes() {
  const [organizationId, setOrganizationId] = useState(getOrgId);
  const [quotes, setQuotes] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({});
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState(null);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const totals = useMemo(() => {
    const subtotal = form.items.reduce((sum, item) => {
      return sum + Math.max(0, Number(item.quantity) || 0) *
        Math.max(0, Number(item.unitPrice) || 0);
    }, 0);

    const discountValue = Math.max(0, Number(form.discountValue) || 0);
    const discountAmount =
      form.discountType === "percentage"
        ? subtotal * Math.min(discountValue, 100) / 100
        : Math.min(discountValue, subtotal);

    const taxableAmount = Math.max(0, subtotal - discountAmount);
    const taxAmount =
      taxableAmount * Math.min(100, Math.max(0, Number(form.taxRate) || 0)) / 100;

    return {
      subtotal,
      discountAmount,
      taxAmount,
      total: Math.max(0, taxableAmount + taxAmount),
    };
  }, [form.items, form.discountType, form.discountValue, form.taxRate]);

  const loadData = useCallback(async () => {
    if (!organizationId) {
      setLoading(false);
      setQuotes([]);
      setCustomers([]);
      setJobs([]);
      setError("");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const [quoteResult, statsResult, customerResult, jobResult] =
        await Promise.all([
          getQuotes({
            organizationId,
            search,
            status: statusFilter,
          }),
          getQuoteStats({ organizationId }),
          getCustomers({ organizationId, status: "active" }),
          getJobs({ organizationId }),
        ]);

      setQuotes(unwrapArray(quoteResult, ["quotes"]));
      setStats(statsResult?.data || statsResult?.stats || {});
      setCustomers(unwrapArray(customerResult, ["customers"]));
      setJobs(unwrapArray(jobResult, ["jobs"]));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [organizationId, search, statusFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const refreshOrganization = () => setOrganizationId(getOrgId());
    window.addEventListener("focus", refreshOrganization);
    window.addEventListener("storage", refreshOrganization);

    return () => {
      window.removeEventListener("focus", refreshOrganization);
      window.removeEventListener("storage", refreshOrganization);
    };
  }, []);

  const setField = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }));

  const setItem = (index, key, value) => {
    setForm((current) => ({
      ...current,
      items: current.items.map((item, i) =>
        i === index ? { ...item, [key]: value } : item
      ),
    }));
  };

  const openCreate = () => {
    setEditingQuote(null);
    setForm(emptyForm());
    setError("");
    setNotice("");
    setModalOpen(true);
  };

  const openEdit = (quote) => {
    setEditingQuote(quote);
    setError("");

    setForm({
      ...emptyForm(),
      ...quote,
      job: quote.job?._id || quote.job || "",
      customer: quote.customer?._id || quote.customer || "",
      items: Array.isArray(quote.items) && quote.items.length
        ? quote.items.map((item) => ({
            name: item.name || "",
            description: item.description || "",
            quantity: Number(item.quantity) || 1,
            unitPrice: Number(item.unitPrice) || 0,
          }))
        : [emptyItem()],
      issueDate: quote.issueDate
        ? new Date(quote.issueDate).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10),
      expiryDate: quote.expiryDate
        ? new Date(quote.expiryDate).toISOString().slice(0, 10)
        : "",
      discountType: quote.discountType || "fixed",
      discountValue: Number(quote.discountValue) || 0,
      taxRate: Number(quote.taxRate) || 0,
      currency: quote.currency || "BDT",
    });

    setModalOpen(true);
  };

  const submitQuote = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!organizationId) {
      setError("Please select a business before creating a quote.");
      return;
    }

    if (!form.job || !form.customer) {
      setError("Please select both a job and a customer.");
      return;
    }

    if (!form.items.length || form.items.some(
      (item) =>
        !item.name.trim() ||
        item.name.trim().length < 2 ||
        Number(item.quantity) <= 0 ||
        Number(item.unitPrice) < 0
    )) {
      setError("Each item needs a name, positive quantity and valid price.");
      return;
    }

    const quoteData = {
      job: form.job,
      customer: form.customer,
      title: form.title.trim(),
      description: form.description.trim(),
      items: form.items.map((item) => ({
        name: item.name.trim(),
        description: item.description.trim(),
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
      })),
      discountType: form.discountType,
      discountValue: Number(form.discountValue) || 0,
      taxRate: Number(form.taxRate) || 0,
      currency: form.currency,
      issueDate: form.issueDate || undefined,
      expiryDate: form.expiryDate || undefined,
      status: form.status,
      customerNotes: form.customerNotes.trim(),
      termsAndConditions: form.termsAndConditions.trim(),
    };

    if (!quoteData.title || quoteData.title.length < 2) {
      setError("Quote title must be at least 2 characters.");
      return;
    }

    setSaving(true);

    try {
      if (editingQuote?._id) {
        await updateQuote({
          organizationId,
          quoteId: editingQuote._id,
          quoteData,
        });
        setNotice("Quote updated successfully.");
      } else {
        await createQuote({ organizationId, quoteData });
        setNotice("Quote created successfully.");
      }

      setModalOpen(false);
      setEditingQuote(null);
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const openDetails = async (quote) => {
    setError("");
    setSelectedQuote(quote);
    setDetailsOpen(true);

    try {
      const result = await getQuoteById({
        organizationId,
        quoteId: quote._id,
      });
      setSelectedQuote(unwrapQuote(result));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const cancelQuote = async (quote) => {
    const quoteName = quote.quoteNumber || quote.title || "this quote";

    if (!window.confirm(
      `Cancel/delete ${quoteName}? This action may not be reversible from the UI.`
    )) return;

    setError("");
    setNotice("");

    try {
      await deleteQuote({ organizationId, quoteId: quote._id });
      setNotice("Quote cancelled successfully.");
      if (selectedQuote?._id === quote._id) setDetailsOpen(false);
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const status = String(job.status || "").toLowerCase();
    return !["cancelled", "completed"].includes(status);
  });

  const customerName = (customer) => {
    if (!customer) return "—";
    if (typeof customer === "string") {
      const found = customers.find((item) => item._id === customer);
      return found
        ? `${found.firstName || ""} ${found.lastName || ""}`.trim() || "Customer"
        : "Customer";
    }

    return (
      `${customer.firstName || ""} ${customer.lastName || ""}`.trim() ||
      customer.name ||
      customer.email ||
      "Customer"
    );
  };

  const jobName = (job) => {
    if (!job) return "—";
    if (typeof job === "string") {
      const found = jobs.find((item) => item._id === job);
      return found?.title || found?.jobNumber || "Job";
    }
    return job.title || job.jobNumber || job.name || "Job";
  };

  const activeQuotes = Number(stats.activeQuotes ?? quotes.length) || 0;
  const acceptedQuotes = Number(stats.acceptedQuotes) || 0;
  const totalValue = Number(stats.totalValue ?? stats.totalAmount) || 0;

  if (!organizationId) {
    return (
      <div className="min-h-screen bg-[#090811] p-6 text-white md:p-10">
        <div className="mx-auto max-w-3xl rounded-3xl border border-violet-400/20 bg-violet-500/[0.06] p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">
            ServiceOS · Quotes
          </p>
          <h1 className="mt-3 text-3xl font-bold">Select a business</h1>
          <p className="mt-3 text-slate-400">
            Choose an organization from your dashboard before managing quotes.
          </p>
          <button
            onClick={() => setOrganizationId(getOrgId())}
            className="mt-6 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold hover:bg-violet-500"
          >
            Refresh organization
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090811] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px] space-y-7">
        <header className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-violet-300">
              <span className="h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_12px_#a78bfa]" />
              ServiceOS · Business Operations
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Quotes <span className="text-violet-400">.</span>
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Create professional estimates, track approvals, and keep every
              customer quote organized.
            </p>
          </div>

          <button
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3 text-sm font-semibold shadow-lg shadow-violet-950/40 transition hover:-translate-y-0.5 hover:from-violet-500 hover:to-fuchsia-500"
          >
            <span className="text-lg">＋</span> Create quote
          </button>
        </header>

        {notice && (
          <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/[0.08] px-4 py-3 text-sm text-emerald-300">
            {notice}
          </div>
        )}

        {error && !modalOpen && (
          <div className="flex flex-col justify-between gap-3 rounded-xl border border-rose-400/20 bg-rose-400/[0.07] px-4 py-3 text-sm text-rose-200 sm:flex-row sm:items-center">
            <span>{error}</span>
            <button
              onClick={loadData}
              className="shrink-0 rounded-lg border border-rose-300/20 px-3 py-1.5 hover:bg-rose-300/10"
            >
              Try again
            </button>
          </div>
        )}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Active quotes"
            value={activeQuotes}
            detail="Quotes currently in your pipeline"
            accent="bg-violet-400 shadow-[0_0_12px_#a78bfa]"
          />
          <StatCard
            label="Accepted quotes"
            value={acceptedQuotes}
            detail="Customer-approved estimates"
            accent="bg-emerald-400"
          />
          <StatCard
            label="Total quote value"
            value={money(totalValue)}
            detail="Value reported by quote statistics"
            accent="bg-cyan-400"
          />
          <StatCard
            label="Visible records"
            value={quotes.length}
            detail="Quotes matching current filters"
            accent="bg-fuchsia-400"
          />
        </section>

        <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#100e1b]/90">
          <div className="flex flex-col gap-4 border-b border-white/[0.07] p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-semibold text-white">All quotes</h2>
              <p className="mt-1 text-xs text-slate-500">
                Search, filter, inspect and manage your estimates.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search quotes..."
                className={`${inputClass} sm:w-64`}
              />
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className={`${inputClass} sm:w-44`}
              >
                <option value="">All statuses</option>
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {prettyStatus(status)}
                  </option>
                ))}
              </select>
              <button
                onClick={loadData}
                className="rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-300 transition hover:bg-white/[0.05]"
              >
                ↻ Refresh
              </button>
            </div>
          </div>

          {loading ? (
            <div className="space-y-3 p-5">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-16 animate-pulse rounded-xl bg-white/[0.04]"
                />
              ))}
            </div>
          ) : quotes.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-2xl text-violet-300">
                $
              </div>
              <h3 className="mt-4 text-lg font-semibold">No quotes found</h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
                {search || statusFilter
                  ? "Try changing your search or filters."
                  : "Create your first quote to start tracking customer estimates."}
              </p>
              {!search && !statusFilter && (
                <button
                  onClick={openCreate}
                  className="mt-5 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold hover:bg-violet-500"
                >
                  Create your first quote
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[850px] text-left">
                  <thead className="bg-white/[0.025] text-xs uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-5 py-4 font-medium">Quote</th>
                      <th className="px-5 py-4 font-medium">Customer</th>
                      <th className="px-5 py-4 font-medium">Job</th>
                      <th className="px-5 py-4 font-medium">Amount</th>
                      <th className="px-5 py-4 font-medium">Status</th>
                      <th className="px-5 py-4 font-medium">Issue date</th>
                      <th className="px-5 py-4 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06]">
                    {quotes.map((quote) => (
                      <tr key={quote._id} className="transition hover:bg-white/[0.025]">
                        <td className="px-5 py-4">
                          <p className="font-semibold text-white">
                            {quote.quoteNumber || "Quote"}
                          </p>
                          <p className="mt-1 max-w-52 truncate text-xs text-slate-500">
                            {quote.title}
                          </p>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-300">
                          {customerName(quote.customer)}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-400">
                          {jobName(quote.job)}
                        </td>
                        <td className="px-5 py-4 text-sm font-semibold text-white">
                          {money(quote.totalAmount, quote.currency)}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyle(quote.status)}`}>
                            {prettyStatus(quote.status)}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-400">
                          {quote.issueDate
                            ? new Date(quote.issueDate).toLocaleDateString()
                            : "—"}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => openDetails(quote)}
                              className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300 hover:bg-white/[0.06]"
                            >
                              View
                            </button>
                            {!["accepted", "rejected", "expired", "cancelled"].includes(quote.status) && (
                              <button
                                onClick={() => openEdit(quote)}
                                className="rounded-lg border border-violet-400/20 px-3 py-2 text-xs text-violet-300 hover:bg-violet-400/10"
                              >
                                Edit
                              </button>
                            )}
                            {quote.status !== "cancelled" && (
                              <button
                                onClick={() => cancelQuote(quote)}
                                className="rounded-lg border border-rose-400/20 px-3 py-2 text-xs text-rose-300 hover:bg-rose-400/10"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-3 p-4 md:hidden">
                {quotes.map((quote) => (
                  <article
                    key={quote._id}
                    className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold">{quote.quoteNumber || "Quote"}</p>
                        <p className="mt-1 truncate text-sm text-slate-400">{quote.title}</p>
                      </div>
                      <span className={`shrink-0 rounded-full border px-2 py-1 text-xs ${statusStyle(quote.status)}`}>
                        {prettyStatus(quote.status)}
                      </span>
                    </div>
                    <div className="mt-4 flex items-end justify-between gap-3">
                      <div>
                        <p className="text-xs text-slate-500">{customerName(quote.customer)}</p>
                        <p className="mt-1 font-semibold">{money(quote.totalAmount, quote.currency)}</p>
                      </div>
                      <button
                        onClick={() => openDetails(quote)}
                        className="rounded-lg border border-white/10 px-3 py-2 text-xs hover:bg-white/[0.06]"
                      >
                        View details
                      </button>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {!["accepted", "rejected", "expired", "cancelled"].includes(quote.status) && (
                        <button onClick={() => openEdit(quote)} className="rounded-lg border border-violet-400/20 px-3 py-2 text-xs text-violet-300">
                          Edit
                        </button>
                      )}
                      {quote.status !== "cancelled" && (
                        <button onClick={() => cancelQuote(quote)} className="rounded-lg border border-rose-400/20 px-3 py-2 text-xs text-rose-300">
                          Cancel
                        </button>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/75 p-3 backdrop-blur-sm sm:p-6">
          <div className="my-auto w-full max-w-4xl overflow-hidden rounded-2xl border border-violet-400/20 bg-[#100e1b] shadow-2xl shadow-black/60">
            <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4 sm:px-7">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
                  Quote management
                </p>
                <h2 className="mt-1 text-xl font-bold">
                  {editingQuote ? "Edit quote" : "Create a quote"}
                </h2>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg border border-white/10 px-3 py-2 text-slate-400 hover:bg-white/[0.06] hover:text-white"
                aria-label="Close form"
              >
                ✕
              </button>
            </div>

            <form onSubmit={submitQuote} className="space-y-6 p-5 sm:p-7">
              {error && (
                <div className="rounded-xl border border-rose-400/20 bg-rose-400/[0.08] px-4 py-3 text-sm text-rose-200">
                  {error}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Quote title *">
                  <input
                    required
                    minLength={2}
                    maxLength={200}
                    value={form.title}
                    onChange={(e) => setField("title", e.target.value)}
                    placeholder="e.g. AC maintenance estimate"
                    className={inputClass}
                  />
                </Field>
                <Field label="Status">
                  <select
                    value={form.status}
                    onChange={(e) => setField("status", e.target.value)}
                    className={inputClass}
                    disabled={Boolean(editingQuote)}
                  >
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                  </select>
                </Field>
                <Field label="Customer *">
                  <select
                    required
                    value={form.customer}
                    onChange={(e) => setField("customer", e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select customer</option>
                    {customers.filter((c) => c.isActive !== false && c.status !== "inactive").map((customer) => (
                      <option key={customer._id} value={customer._id}>
                        {customerName(customer)}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Job *">
                  <select
                    required
                    value={form.job}
                    onChange={(e) => {
                      const jobId = e.target.value;
                      const selectedJob = jobs.find((job) => job._id === jobId);
                      setForm((current) => ({
                        ...current,
                        job: jobId,
                        customer: selectedJob?.customer?._id || selectedJob?.customer || current.customer,
                      }));
                    }}
                    className={inputClass}
                  >
                    <option value="">Select job</option>
                    {filteredJobs.map((job) => (
                      <option key={job._id} value={job._id}>
                        {job.title || job.jobNumber || "Job"}{job.status ? ` · ${prettyStatus(job.status)}` : ""}
                      </option>
                    ))}
                  </select>
                  {jobs.length === 0 && (
                    <span className="block text-xs text-amber-300">
                      No jobs were loaded. Create a job first, or check the Jobs API response.
                    </span>
                  )}
                </Field>
                <Field label="Issue date">
                  <input
                    type="date"
                    value={form.issueDate}
                    onChange={(e) => setField("issueDate", e.target.value)}
                    className={inputClass}
                  />
                </Field>
                <Field label="Expiry date">
                  <input
                    type="date"
                    min={form.issueDate || undefined}
                    value={form.expiryDate}
                    onChange={(e) => setField("expiryDate", e.target.value)}
                    className={inputClass}
                  />
                </Field>
              </div>

              <Field label="Description">
                <textarea
                  rows={2}
                  maxLength={3000}
                  value={form.description}
                  onChange={(e) => setField("description", e.target.value)}
                  placeholder="Describe the work covered by this quote..."
                  className={inputClass}
                />
              </Field>

              <div className="rounded-2xl border border-white/[0.08] bg-black/10 p-4 sm:p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">Quote items</h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Add services, labor, materials or other charges.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setForm((current) => ({
                      ...current,
                      items: [...current.items, emptyItem()],
                    }))}
                    className="rounded-lg border border-violet-400/25 px-3 py-2 text-xs font-semibold text-violet-300 hover:bg-violet-400/10"
                  >
                    + Add item
                  </button>
                </div>

                <div className="space-y-4">
                  {form.items.map((item, index) => (
                    <div key={index} className="rounded-xl border border-white/[0.07] p-3 sm:p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Item {index + 1}
                        </span>
                        {form.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setForm((current) => ({
                              ...current,
                              items: current.items.filter((_, i) => i !== index),
                            }))}
                            className="text-xs text-rose-300 hover:text-rose-200"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="grid gap-3 sm:grid-cols-12">
                        <div className="sm:col-span-5">
                          <Field label="Item name *">
                            <input
                              required
                              minLength={2}
                              maxLength={200}
                              value={item.name}
                              onChange={(e) => setItem(index, "name", e.target.value)}
                              placeholder="Labor / parts / service"
                              className={inputClass}
                            />
                          </Field>
                        </div>
                        <div className="sm:col-span-2">
                          <Field label="Quantity">
                            <input
                              required
                              type="number"
                              min="0.01"
                              step="any"
                              value={item.quantity}
                              onChange={(e) => setItem(index, "quantity", e.target.value)}
                              className={inputClass}
                            />
                          </Field>
                        </div>
                        <div className="sm:col-span-2">
                          <Field label="Unit price">
                            <input
                              required
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.unitPrice}
                              onChange={(e) => setItem(index, "unitPrice", e.target.value)}
                              className={inputClass}
                            />
                          </Field>
                        </div>
                        <div className="sm:col-span-3">
                          <Field label="Line total">
                            <div className={`${inputClass} border-transparent bg-white/[0.04] text-slate-300`}>
                              {money((Number(item.quantity) || 0) * (Number(item.unitPrice) || 0), form.currency)}
                            </div>
                          </Field>
                        </div>
                        <div className="sm:col-span-12">
                          <Field label="Item description (optional)">
                            <input
                              maxLength={1000}
                              value={item.description}
                              onChange={(e) => setItem(index, "description", e.target.value)}
                              placeholder="Additional details"
                              className={inputClass}
                            />
                          </Field>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Currency">
                      <select
                        value={form.currency}
                        onChange={(e) => setField("currency", e.target.value)}
                        className={inputClass}
                      >
                        <option value="BDT">BDT — Bangladeshi Taka</option>
                        <option value="USD">USD — US Dollar</option>
                        <option value="EUR">EUR — Euro</option>
                        <option value="GBP">GBP — British Pound</option>
                      </select>
                    </Field>
                    <Field label="Discount type">
                      <select
                        value={form.discountType}
                        onChange={(e) => setField("discountType", e.target.value)}
                        className={inputClass}
                      >
                        <option value="fixed">Fixed amount</option>
                        <option value="percentage">Percentage (%)</option>
                      </select>
                    </Field>
                    <Field label={form.discountType === "percentage" ? "Discount (%)" : "Discount amount"}>
                      <input
                        type="number"
                        min="0"
                        max={form.discountType === "percentage" ? "100" : undefined}
                        step="0.01"
                        value={form.discountValue}
                        onChange={(e) => setField("discountValue", e.target.value)}
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Tax rate (%)">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={form.taxRate}
                        onChange={(e) => setField("taxRate", e.target.value)}
                        className={inputClass}
                      />
                    </Field>
                  </div>

                  <Field label="Customer notes">
                    <textarea
                      rows={2}
                      maxLength={2000}
                      value={form.customerNotes}
                      onChange={(e) => setField("customerNotes", e.target.value)}
                      placeholder="Notes visible to the customer..."
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Terms and conditions">
                    <textarea
                      rows={3}
                      maxLength={5000}
                      value={form.termsAndConditions}
                      onChange={(e) => setField("termsAndConditions", e.target.value)}
                      placeholder="Payment terms, warranty, quote conditions..."
                      className={inputClass}
                    />
                  </Field>
                </div>

                <div className="h-fit rounded-2xl border border-violet-400/20 bg-gradient-to-b from-violet-500/[0.10] to-fuchsia-500/[0.03] p-5">
                  <h3 className="font-semibold">Quote summary</h3>
                  <div className="mt-5 space-y-3 text-sm">
                    <div className="flex justify-between gap-3 text-slate-400">
                      <span>Subtotal</span>
                      <span className="text-white">{money(totals.subtotal, form.currency)}</span>
                    </div>
                    <div className="flex justify-between gap-3 text-slate-400">
                      <span>Discount</span>
                      <span className="text-emerald-300">−{money(totals.discountAmount, form.currency)}</span>
                    </div>
                    <div className="flex justify-between gap-3 text-slate-400">
                      <span>Tax</span>
                      <span className="text-white">{money(totals.taxAmount, form.currency)}</span>
                    </div>
                    <div className="border-t border-white/10 pt-4">
                      <p className="text-xs uppercase tracking-wider text-slate-500">Estimated total</p>
                      <p className="mt-2 break-words text-2xl font-bold text-white">
                        {money(totals.total, form.currency)}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-xs leading-5 text-slate-500">
                    Totals are previewed here. The backend recalculates the
                    authoritative quote amounts when you save.
                  </p>
                </div>
              </div>

              <div className="flex flex-col-reverse justify-end gap-3 border-t border-white/[0.08] pt-5 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 hover:bg-white/[0.05]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 hover:from-violet-500 hover:to-fuchsia-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving..." : editingQuote ? "Save changes" : "Create quote"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {detailsOpen && selectedQuote && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/75 p-3 backdrop-blur-sm sm:p-6">
          <div className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-violet-400/20 bg-[#100e1b] shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-white/[0.08] p-5 sm:p-7">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
                  Quote details
                </p>
                <h2 className="mt-2 text-2xl font-bold">
                  {selectedQuote.quoteNumber || selectedQuote.title}
                </h2>
                <p className="mt-1 text-sm text-slate-400">{selectedQuote.title}</p>
              </div>
              <button
                onClick={() => setDetailsOpen(false)}
                className="rounded-lg border border-white/10 px-3 py-2 text-slate-400 hover:bg-white/[0.06]"
                aria-label="Close details"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6 p-5 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className={`rounded-full border px-3 py-1.5 text-xs font-medium ${statusStyle(selectedQuote.status)}`}>
                  {prettyStatus(selectedQuote.status)}
                </span>
                <p className="text-2xl font-bold">
                  {money(selectedQuote.totalAmount, selectedQuote.currency)}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-white/[0.07] p-4">
                  <p className="text-xs text-slate-500">Customer</p>
                  <p className="mt-2 font-medium">{customerName(selectedQuote.customer)}</p>
                </div>
                <div className="rounded-xl border border-white/[0.07] p-4">
                  <p className="text-xs text-slate-500">Job</p>
                  <p className="mt-2 font-medium">{jobName(selectedQuote.job)}</p>
                </div>
                <div className="rounded-xl border border-white/[0.07] p-4">
                  <p className="text-xs text-slate-500">Issue date</p>
                  <p className="mt-2 font-medium">
                    {selectedQuote.issueDate ? new Date(selectedQuote.issueDate).toLocaleDateString() : "—"}
                  </p>
                </div>
                <div className="rounded-xl border border-white/[0.07] p-4">
                  <p className="text-xs text-slate-500">Expiry date</p>
                  <p className="mt-2 font-medium">
                    {selectedQuote.expiryDate ? new Date(selectedQuote.expiryDate).toLocaleDateString() : "No expiry"}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="mb-3 font-semibold">Items</h3>
                <div className="overflow-x-auto rounded-xl border border-white/[0.08]">
                  <table className="w-full min-w-[420px] text-left text-sm">
                    <thead className="bg-white/[0.03] text-xs text-slate-500">
                      <tr>
                        <th className="px-4 py-3">Item</th>
                        <th className="px-4 py-3">Qty</th>
                        <th className="px-4 py-3">Unit price</th>
                        <th className="px-4 py-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.06]">
                      {(selectedQuote.items || []).map((item, index) => (
                        <tr key={item._id || index}>
                          <td className="px-4 py-3">
                            <p>{item.name}</p>
                            {item.description && (
                              <p className="mt-1 text-xs text-slate-500">{item.description}</p>
                            )}
                          </td>
                          <td className="px-4 py-3 text-slate-300">{item.quantity}</td>
                          <td className="px-4 py-3 text-slate-300">{money(item.unitPrice, selectedQuote.currency)}</td>
                          <td className="px-4 py-3 text-right font-medium">
                            {money(item.total ?? Number(item.quantity) * Number(item.unitPrice), selectedQuote.currency)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {selectedQuote.description && (
                <div>
                  <h3 className="mb-2 font-semibold">Description</h3>
                  <p className="whitespace-pre-wrap text-sm leading-6 text-slate-400">{selectedQuote.description}</p>
                </div>
              )}

              {selectedQuote.customerNotes && (
                <div>
                  <h3 className="mb-2 font-semibold">Customer notes</h3>
                  <p className="whitespace-pre-wrap text-sm leading-6 text-slate-400">{selectedQuote.customerNotes}</p>
                </div>
              )}

              <div className="rounded-xl border border-white/[0.07] p-4">
                <div className="flex justify-between gap-4 text-sm text-slate-400">
                  <span>Subtotal</span>
                  <span>{money(selectedQuote.subtotal, selectedQuote.currency)}</span>
                </div>
                <div className="mt-2 flex justify-between gap-4 text-sm text-slate-400">
                  <span>Discount</span>
                  <span>−{money(selectedQuote.discountAmount, selectedQuote.currency)}</span>
                </div>
                <div className="mt-2 flex justify-between gap-4 text-sm text-slate-400">
                  <span>Tax</span>
                  <span>{money(selectedQuote.taxAmount, selectedQuote.currency)}</span>
                </div>
                <div className="mt-4 flex justify-between gap-4 border-t border-white/[0.08] pt-4 font-semibold">
                  <span>Total</span>
                  <span>{money(selectedQuote.totalAmount, selectedQuote.currency)}</span>
                </div>
              </div>

              <div className="flex flex-wrap justify-end gap-3">
                {!["accepted", "rejected", "expired", "cancelled"].includes(selectedQuote.status) && (
                  <button
                    onClick={() => {
                      setDetailsOpen(false);
                      openEdit(selectedQuote);
                    }}
                    className="rounded-xl border border-violet-400/20 px-4 py-3 text-sm font-semibold text-violet-300 hover:bg-violet-400/10"
                  >
                    Edit quote
                  </button>
                )}
                <button
                  onClick={() => setDetailsOpen(false)}
                  className="rounded-xl bg-white/[0.08] px-4 py-3 text-sm font-semibold hover:bg-white/[0.12]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
