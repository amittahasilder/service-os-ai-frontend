
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import {
  getInvoices,
  getInvoiceStats,
  createInvoice,
  updateInvoice,
  deleteInvoice,
} from "../api/invoiceApi";

import { getCustomers } from "../api/customerApi";
import { getJobs } from "../api/jobApi";

const STATUSES = [
  "draft",
  "sent",
  "partially_paid",
  "paid",
  "overdue",
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
  discountType: "percentage",
  discountValue: 0,
  taxRate: 0,
  currency: "BDT",
  issueDate: new Date().toISOString().slice(0, 10),
  dueDate: "",
  status: "draft",
  customerNotes: "",
  termsAndConditions: "",
});

const getArray = (response) => {
  let value = response?.data ?? response;

  for (let i = 0; i < 4; i += 1) {
    if (Array.isArray(value)) return value;

    if (value && typeof value === "object") {
      value =
        value.data ??
        value.results ??
        value.invoices ??
        value.customers ??
        value.jobs ??
        value.items;
    } else {
      break;
    }
  }

  return Array.isArray(value) ? value : [];
};

const getRecordId = (record) =>
  record?._id ?? record?.id ?? "";

const getCustomerName = (customer) =>
  customer?.name ??
  customer?.fullName ??
  [customer?.firstName, customer?.lastName]
    .filter(Boolean)
    .join(" ") ??
  "Customer";

const money = (value, currency = "BDT") => {
  const amount = Number(value ?? 0);

  try {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(Number.isFinite(amount) ? amount : 0);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
};

const labelize = (value = "") =>
  value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const statusClasses = (status) => {
  const styles = {
    draft: "border-slate-500/30 bg-slate-500/10 text-slate-300",
    sent: "border-blue-500/30 bg-blue-500/10 text-blue-300",
    partially_paid:
      "border-amber-500/30 bg-amber-500/10 text-amber-300",
    paid: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    overdue: "border-red-500/30 bg-red-500/10 text-red-300",
    cancelled: "border-rose-500/30 bg-rose-500/10 text-rose-300",
  };

  return styles[status] ?? styles.draft;
};

const getInvoiceAmount = (invoice) =>
  Number(
    invoice?.total ??
      invoice?.totalAmount ??
      invoice?.grandTotal ??
      invoice?.amount ??
      0
  );

export default function Invoices() {
  const [organizationId, setOrganizationId] = useState(
    () => localStorage.getItem("serviceos_current_organization") || ""
  );

  const [invoices, setInvoices] = useState([]);
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
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [form, setForm] = useState(emptyForm());

  useEffect(() => {
    const syncOrganization = () => {
      setOrganizationId(
        localStorage.getItem("serviceos_current_organization") || ""
      );
    };

    window.addEventListener("storage", syncOrganization);
    window.addEventListener("focus", syncOrganization);

    return () => {
      window.removeEventListener("storage", syncOrganization);
      window.removeEventListener("focus", syncOrganization);
    };
  }, []);

  const loadInvoices = useCallback(async () => {
    if (!organizationId) {
      setInvoices([]);
      setStats({});
      setCustomers([]);
      setJobs([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const [invoiceResponse, statsResponse, customerResponse, jobResponse] =
        await Promise.all([
          getInvoices({
            organizationId,
            search,
            status: statusFilter,
          }),
          getInvoiceStats({ organizationId }),
          getCustomers({ organizationId, status: "active" }),
          getJobs({ organizationId }),
        ]);

      setInvoices(getArray(invoiceResponse));

      const statsData =
        statsResponse?.data?.data ??
        statsResponse?.data ??
        statsResponse ??
        {};

      setStats(
        statsData && typeof statsData === "object" ? statsData : {}
      );

      setCustomers(getArray(customerResponse));
      setJobs(getArray(jobResponse));
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load invoices."
      );
    } finally {
      setLoading(false);
    }
  }, [organizationId, search, statusFilter]);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  const totals = useMemo(() => {
    const totalInvoices = Number(
      stats.totalInvoices ?? stats.total ?? invoices.length
    );

    const totalPaid = Number(
      stats.totalPaid ??
        stats.paidAmount ??
        invoices
          .filter((invoice) => invoice.status === "paid")
          .reduce((sum, invoice) => sum + getInvoiceAmount(invoice), 0)
    );

    const outstanding = Number(
      stats.outstanding ??
        stats.totalOutstanding ??
        invoices
          .filter((invoice) =>
            ["sent", "partially_paid", "overdue"].includes(invoice.status)
          )
          .reduce((sum, invoice) => sum + getInvoiceAmount(invoice), 0)
    );

    const overdue = Number(
      stats.overdueCount ??
        stats.overdueInvoices ??
        invoices.filter((invoice) => invoice.status === "overdue").length
    );

    return { totalInvoices, totalPaid, outstanding, overdue };
  }, [stats, invoices]);

  const openCreateModal = () => {
    setEditingInvoice(null);
    setForm(emptyForm());
    setError("");
    setNotice("");
    setModalOpen(true);
  };

  const openEditModal = (invoice) => {
    setEditingInvoice(invoice);

    setForm({
      ...emptyForm(),
      ...invoice,
      job: getRecordId(invoice.job) || invoice.job || "",
      customer:
        getRecordId(invoice.customer) || invoice.customer || "",
      quote: getRecordId(invoice.quote) || invoice.quote || "",
      items:
        Array.isArray(invoice.items) && invoice.items.length
          ? invoice.items.map((item) => ({
              name: item.name || "",
              description: item.description || "",
              quantity: Number(item.quantity ?? 1),
              unitPrice: Number(item.unitPrice ?? 0),
            }))
          : [emptyItem()],
      discountType: invoice.discountType || "percentage",
      discountValue: Number(invoice.discountValue ?? 0),
      taxRate: Number(invoice.taxRate ?? 0),
      currency: invoice.currency || "BDT",
      issueDate: invoice.issueDate
        ? String(invoice.issueDate).slice(0, 10)
        : "",
      dueDate: invoice.dueDate
        ? String(invoice.dueDate).slice(0, 10)
        : "",
      status: invoice.status || "draft",
    });

    setError("");
    setNotice("");
    setModalOpen(true);
  };

  const updateField = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const updateItem = (index, field, value) => {
    setForm((previous) => ({
      ...previous,
      items: previous.items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addItem = () => {
    setForm((previous) => ({
      ...previous,
      items: [...previous.items, emptyItem()],
    }));
  };

  const removeItem = (index) => {
    setForm((previous) => ({
      ...previous,
      items:
        previous.items.length === 1
          ? [emptyItem()]
          : previous.items.filter((_, i) => i !== index),
    }));
  };

  const calculations = useMemo(() => {
    const subtotal = form.items.reduce(
      (sum, item) =>
        sum +
        Math.max(0, Number(item.quantity) || 0) *
          Math.max(0, Number(item.unitPrice) || 0),
      0
    );

    const discountInput = Math.max(0, Number(form.discountValue) || 0);

    const discount =
      form.discountType === "percentage"
        ? subtotal * Math.min(discountInput, 100) / 100
        : Math.min(discountInput, subtotal);

    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = taxableAmount * Math.min(
      Math.max(0, Number(form.taxRate) || 0),
      100
    ) / 100;

    return {
      subtotal,
      discount,
      tax,
      total: taxableAmount + tax,
    };
  }, [form.items, form.discountType, form.discountValue, form.taxRate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!organizationId) {
      setError("Please select a business first.");
      return;
    }

    if (!form.job || !form.customer) {
      setError("Please select both a job and a customer.");
      return;
    }

    if (!form.title.trim()) {
      setError("Invoice title is required.");
      return;
    }

    if (
      form.items.some(
        (item) =>
          !item.name.trim() ||
          Number(item.quantity) <= 0 ||
          Number(item.unitPrice) < 0 ||
          !Number.isFinite(Number(item.quantity)) ||
          !Number.isFinite(Number(item.unitPrice))
      )
    ) {
      setError(
        "Each item needs a name, a quantity greater than zero, and a valid unit price."
      );
      return;
    }

    const payload = {
      job: form.job,
      customer: form.customer,
      title: form.title.trim(),
      items: form.items.map((item) => ({
        name: item.name.trim(),
        ...(item.description?.trim()
          ? { description: item.description.trim() }
          : {}),
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
      })),
      discountType: form.discountType,
      discountValue: Number(form.discountValue) || 0,
      taxRate: Number(form.taxRate) || 0,
      currency: form.currency.trim().toUpperCase() || "BDT",
      status: form.status,
      ...(form.quote ? { quote: form.quote } : {}),
      ...(form.description.trim()
        ? { description: form.description.trim() }
        : {}),
      ...(form.issueDate ? { issueDate: form.issueDate } : {}),
      ...(form.dueDate ? { dueDate: form.dueDate } : {}),
      ...(form.customerNotes.trim()
        ? { customerNotes: form.customerNotes.trim() }
        : {}),
      ...(form.termsAndConditions.trim()
        ? { termsAndConditions: form.termsAndConditions.trim() }
        : {}),
    };

    setSaving(true);
    setError("");

    try {
      if (editingInvoice) {
        await updateInvoice({
          organizationId,
          invoiceId: getRecordId(editingInvoice),
          invoiceData: payload,
        });
        setNotice("Invoice updated successfully.");
      } else {
        await createInvoice({
          organizationId,
          invoiceData: payload,
        });
        setNotice("Invoice created successfully.");
      }

      setModalOpen(false);
      await loadInvoices();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Could not save the invoice."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (invoice) => {
    const invoiceId = getRecordId(invoice);
    if (!invoiceId) {
      setError("Invoice ID is missing.");
      return;
    }

    if (
      !window.confirm(
        `Delete invoice "${invoice.title || invoice.invoiceNumber || invoiceId}"?`
      )
    ) {
      return;
    }

    setError("");
    setNotice("");

    try {
      await deleteInvoice({ organizationId, invoiceId });
      setNotice("Invoice deleted successfully.");
      await loadInvoices();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Could not delete the invoice."
      );
    }
  };

  if (!organizationId) {
    return (
      <div className="min-h-[70vh] rounded-3xl border border-white/10 bg-[#100d1b] p-8 text-white">
        <h1 className="text-2xl font-bold">Invoices</h1>
        <p className="mt-3 text-sm text-slate-400">
          Select a business from the organization switcher to manage invoices.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-7 bg-[#090711] p-4 text-white sm:p-6 xl:p-8">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-400">
            Finance / Billing
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Invoices
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Manage billing, invoice items, taxes, and due dates.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3 text-sm font-semibold shadow-lg shadow-violet-950/40 transition hover:brightness-110"
        >
          + Create Invoice
        </button>
      </div>

      {notice && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          {notice}
        </div>
      )}

      {error && !modalOpen && (
        <div className="flex items-start justify-between gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          <span>{error}</span>
          <button onClick={() => setError("")} aria-label="Dismiss error">
            ×
          </button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total Invoices",
            value: totals.totalInvoices,
            detail: "Invoices in this business",
            icon: "▤",
          },
          {
            label: "Total Paid",
            value: money(totals.totalPaid),
            detail: "Paid invoice amount",
            icon: "↗",
          },
          {
            label: "Outstanding",
            value: money(totals.outstanding),
            detail: "Awaiting payment",
            icon: "◷",
          },
          {
            label: "Overdue",
            value: totals.overdue,
            detail: "Overdue invoices",
            icon: "!",
          },
        ].map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#191326] to-[#100d19] p-5 shadow-xl shadow-black/10"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">{card.label}</p>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10 text-lg text-violet-300">
                {card.icon}
              </span>
            </div>
            <p className="mt-4 break-words text-2xl font-bold">{card.value}</p>
            <p className="mt-2 text-xs text-slate-500">{card.detail}</p>
          </motion.div>
        ))}
      </div>

      <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#100d19]">
        <div className="flex flex-col gap-4 border-b border-white/[0.07] p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold">All Invoices</h2>
            <p className="mt-1 text-sm text-slate-500">
              Search and manage your billing records.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search invoices..."
              className="min-w-0 rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm outline-none transition placeholder:text-slate-600 focus:border-violet-500/60 sm:w-64"
            />

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-xl border border-white/10 bg-[#171222] px-3 py-2.5 text-sm outline-none focus:border-violet-500/60"
            >
              <option value="">All statuses</option>
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {labelize(status)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-slate-400">
            Loading invoices...
          </div>
        ) : invoices.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-2xl text-violet-300">
              ▤
            </div>
            <h3 className="mt-4 text-lg font-semibold">No invoices found</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              Create your first invoice or change your search and status filters.
            </p>
            <button
              onClick={openCreateModal}
              className="mt-5 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold transition hover:bg-violet-500"
            >
              Create your first invoice
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-white/[0.025] text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-medium">Invoice</th>
                  <th className="px-5 py-4 font-medium">Customer</th>
                  <th className="px-5 py-4 font-medium">Issue Date</th>
                  <th className="px-5 py-4 font-medium">Due Date</th>
                  <th className="px-5 py-4 font-medium">Amount</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {invoices.map((invoice) => (
                  <tr
                    key={getRecordId(invoice)}
                    className="transition hover:bg-white/[0.025]"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-white">
                        {invoice.invoiceNumber ||
                          invoice.number ||
                          invoice.title ||
                          "Invoice"}
                      </p>
                      <p className="mt-1 max-w-48 truncate text-xs text-slate-500">
                        {invoice.title || "No title"}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-slate-300">
                      {typeof invoice.customer === "object"
                        ? getCustomerName(invoice.customer)
                        : customers.find(
                            (customer) =>
                              getRecordId(customer) === invoice.customer
                          )
                            ? getCustomerName(
                                customers.find(
                                  (customer) =>
                                    getRecordId(customer) === invoice.customer
                                )
                              )
                            : "Customer"}
                    </td>
                    <td className="px-5 py-4 text-slate-400">
                      {invoice.issueDate
                        ? String(invoice.issueDate).slice(0, 10)
                        : "—"}
                    </td>
                    <td className="px-5 py-4 text-slate-400">
                      {invoice.dueDate
                        ? String(invoice.dueDate).slice(0, 10)
                        : "—"}
                    </td>
                    <td className="px-5 py-4 font-semibold text-white">
                      {money(
                        getInvoiceAmount(invoice),
                        invoice.currency || "BDT"
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusClasses(
                          invoice.status
                        )}`}
                      >
                        {labelize(invoice.status || "draft")}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(invoice)}
                          className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300 transition hover:border-violet-400/40 hover:text-white"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(invoice)}
                          className="rounded-lg border border-red-500/20 px-3 py-1.5 text-xs text-red-300 transition hover:bg-red-500/10"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/75 p-3 backdrop-blur-sm sm:p-6">
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="my-5 w-full max-w-4xl rounded-2xl border border-white/10 bg-[#100d19] shadow-2xl shadow-black/50"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-2xl border-b border-white/[0.08] bg-[#100d19] px-5 py-4 sm:px-7">
              <div>
                <h2 className="text-xl font-bold">
                  {editingInvoice ? "Edit Invoice" : "Create Invoice"}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Fields marked with * are required.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg px-3 py-2 text-xl text-slate-400 hover:bg-white/5 hover:text-white"
                aria-label="Close invoice form"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 p-5 sm:p-7">
              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Customer *
                  </label>
                  <select
                    required
                    value={form.customer}
                    onChange={(event) => updateField("customer", event.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#171222] px-3 py-3 text-sm outline-none focus:border-violet-500/60"
                  >
                    <option value="">Select customer</option>
                    {customers.map((customer) => (
                      <option key={getRecordId(customer)} value={getRecordId(customer)}>
                        {getCustomerName(customer)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Related Job *
                  </label>
                  <select
                    required
                    value={form.job}
                    onChange={(event) => updateField("job", event.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#171222] px-3 py-3 text-sm outline-none focus:border-violet-500/60"
                  >
                    <option value="">Select job</option>
                    {jobs.map((job) => (
                      <option key={getRecordId(job)} value={getRecordId(job)}>
                        {job.title || job.jobNumber || getRecordId(job)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm text-slate-300">
                    Invoice Title *
                  </label>
                  <input
                    required
                    minLength={2}
                    maxLength={200}
                    value={form.title}
                    onChange={(event) => updateField("title", event.target.value)}
                    placeholder="e.g. AC maintenance service"
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-violet-500/60"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Issue Date
                  </label>
                  <input
                    type="date"
                    value={form.issueDate}
                    onChange={(event) => updateField("issueDate", event.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#171222] px-3 py-3 text-sm outline-none focus:border-violet-500/60"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(event) => updateField("dueDate", event.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#171222] px-3 py-3 text-sm outline-none focus:border-violet-500/60"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Currency
                  </label>
                  <select
                    value={form.currency}
                    onChange={(event) => updateField("currency", event.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#171222] px-3 py-3 text-sm outline-none focus:border-violet-500/60"
                  >
                    <option value="BDT">BDT — Bangladeshi Taka</option>
                    <option value="USD">USD — US Dollar</option>
                    <option value="EUR">EUR — Euro</option>
                    <option value="GBP">GBP — British Pound</option>
                    <option value="INR">INR — Indian Rupee</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(event) => updateField("status", event.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#171222] px-3 py-3 text-sm outline-none focus:border-violet-500/60"
                  >
                    {STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {labelize(status)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Invoice Items</h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Add the services or products being billed.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addItem}
                    className="rounded-lg border border-violet-400/30 px-3 py-2 text-xs font-semibold text-violet-300 hover:bg-violet-500/10"
                  >
                    + Add Item
                  </button>
                </div>

                <div className="space-y-3">
                  {form.items.map((item, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-white/[0.08] bg-black/15 p-4"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Item {index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-xs text-red-300 hover:text-red-200"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="sm:col-span-3">
                          <label className="mb-1.5 block text-xs text-slate-400">
                            Item Name *
                          </label>
                          <input
                            required
                            minLength={2}
                            maxLength={200}
                            value={item.name}
                            onChange={(event) => updateItem(index, "name", event.target.value)}
                            placeholder="Service or product name"
                            className="w-full rounded-lg border border-white/10 bg-[#171222] px-3 py-2.5 text-sm outline-none focus:border-violet-500/60"
                          />
                        </div>

                        <div>
                          <label className="mb-1.5 block text-xs text-slate-400">
                            Quantity *
                          </label>
                          <input
                            required
                            type="number"
                            min="0.01"
                            step="any"
                            value={item.quantity}
                            onChange={(event) => updateItem(index, "quantity", event.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-[#171222] px-3 py-2.5 text-sm outline-none focus:border-violet-500/60"
                          />
                        </div>

                        <div>
                          <label className="mb-1.5 block text-xs text-slate-400">
                            Unit Price *
                          </label>
                          <input
                            required
                            type="number"
                            min="0"
                            step="any"
                            value={item.unitPrice}
                            onChange={(event) => updateItem(index, "unitPrice", event.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-[#171222] px-3 py-2.5 text-sm outline-none focus:border-violet-500/60"
                          />
                        </div>

                        <div>
                          <label className="mb-1.5 block text-xs text-slate-400">
                            Line Total
                          </label>
                          <div className="rounded-lg border border-white/[0.06] bg-white/[0.025] px-3 py-2.5 text-sm font-semibold text-violet-200">
                            {money(
                              (Number(item.quantity) || 0) *
                                (Number(item.unitPrice) || 0),
                              form.currency
                            )}
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label className="mb-1.5 block text-xs text-slate-400">
                            Item Description
                          </label>
                          <input
                            maxLength={1000}
                            value={item.description}
                            onChange={(event) => updateItem(index, "description", event.target.value)}
                            placeholder="Optional details"
                            className="w-full rounded-lg border border-white/10 bg-[#171222] px-3 py-2.5 text-sm outline-none focus:border-violet-500/60"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Discount Type
                  </label>
                  <select
                    value={form.discountType}
                    onChange={(event) => updateField("discountType", event.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#171222] px-3 py-3 text-sm outline-none focus:border-violet-500/60"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed amount</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Discount Value
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={form.discountType === "percentage" ? 100 : undefined}
                    step="any"
                    value={form.discountValue}
                    onChange={(event) => updateField("discountValue", event.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#171222] px-3 py-3 text-sm outline-none focus:border-violet-500/60"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="any"
                    value={form.taxRate}
                    onChange={(event) => updateField("taxRate", event.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#171222] px-3 py-3 text-sm outline-none focus:border-violet-500/60"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Description
                  </label>
                  <input
                    maxLength={3000}
                    value={form.description}
                    onChange={(event) => updateField("description", event.target.value)}
                    placeholder="Optional invoice description"
                    className="w-full rounded-xl border border-white/10 bg-[#171222] px-3 py-3 text-sm outline-none focus:border-violet-500/60"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-violet-400/15 bg-violet-500/[0.06] p-5">
                <h3 className="mb-4 font-semibold">Invoice Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between gap-4 text-slate-400">
                    <span>Subtotal</span>
                    <span>{money(calculations.subtotal, form.currency)}</span>
                  </div>
                  <div className="flex justify-between gap-4 text-slate-400">
                    <span>Discount</span>
                    <span>
                      −{money(calculations.discount, form.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4 text-slate-400">
                    <span>Tax</span>
                    <span>{money(calculations.tax, form.currency)}</span>
                  </div>
                  <div className="flex justify-between gap-4 border-t border-white/10 pt-3 text-base font-bold text-white">
                    <span>Estimated Total</span>
                    <span className="text-violet-300">
                      {money(calculations.total, form.currency)}
                    </span>
                  </div>
                </div>
                <p className="mt-3 text-xs text-slate-500">
                  Preview only. The backend should calculate and persist the
                  authoritative invoice totals.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Customer Notes
                  </label>
                  <textarea
                    rows={3}
                    maxLength={2000}
                    value={form.customerNotes}
                    onChange={(event) => updateField("customerNotes", event.target.value)}
                    placeholder="Notes shown to the customer"
                    className="w-full resize-y rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-violet-500/60"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Terms and Conditions
                  </label>
                  <textarea
                    rows={3}
                    maxLength={5000}
                    value={form.termsAndConditions}
                    onChange={(event) => updateField("termsAndConditions", event.target.value)}
                    placeholder="Payment terms and conditions"
                    className="w-full resize-y rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-violet-500/60"
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-white/[0.08] pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 text-sm font-semibold transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingInvoice
                      ? "Save Changes"
                      : "Create Invoice"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
