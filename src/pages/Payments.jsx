
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getPayments,
  getPaymentStats,
  createPayment,
  updatePayment,
  refundPayment,
  cancelPayment,
} from "../api/paymentApi";
import { getInvoices } from "../api/invoiceApi";

const initialForm = {
  invoice: "",
  customer: "",
  amount: "",
  paymentMethod: "cash",
  status: "completed",
  transactionId: "",
  referenceNumber: "",
  paymentDate: new Date().toISOString().slice(0, 10),
  notes: "",
};

const methods = [
  { value: "cash", label: "Cash" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "card", label: "Card" },
  { value: "mobile_banking", label: "Mobile Banking" },
  { value: "cheque", label: "Cheque" },
  { value: "other", label: "Other" },
];

const statusColors = {
  completed: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  pending: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  failed: "border-red-400/20 bg-red-400/10 text-red-300",
  refunded: "border-purple-400/20 bg-purple-400/10 text-purple-300",
  cancelled: "border-slate-400/20 bg-slate-400/10 text-slate-300",
};

const getCustomerName = (customer) => {
  if (!customer) return "Unknown customer";
  if (typeof customer === "string") return customer;
  return customer.name || customer.email || "Unknown customer";
};

const getInvoiceNumber = (invoice) => {
  if (!invoice) return "Unknown invoice";
  if (typeof invoice === "string") return invoice;
  return invoice.invoiceNumber || String(invoice._id || "Invoice");
};

const money = (value, currency = "BDT") =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: currency || "BDT",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
};

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  "Something went wrong. Please try again.";

export default function Payments() {
  const [organizationId, setOrganizationId] = useState("");
  const [payments, setPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [stats, setStats] = useState({
    summary: {
      totalPayments: 0,
      totalAmount: 0,
      completedAmount: 0,
      refundedAmount: 0,
      pendingAmount: 0,
    },
    paymentMethods: [],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [methodFilter, setMethodFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    const readOrganization = () => {
      try {
        const stored = localStorage.getItem(
          "serviceos_current_organization"
        );
        if (!stored) {
          setOrganizationId("");
          return;
        }

        const parsed = JSON.parse(stored);
        setOrganizationId(
          typeof parsed === "string"
            ? parsed
            : parsed?._id || parsed?.id || parsed?.organizationId || ""
        );
      } catch {
        setOrganizationId("");
      }
    };

    readOrganization();
    window.addEventListener("storage", readOrganization);
    return () => window.removeEventListener("storage", readOrganization);
  }, []);

  const loadData = useCallback(async () => {
    if (!organizationId) {
      setPayments([]);
      setInvoices([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const [paymentsResponse, statsResponse, invoicesResponse] =
        await Promise.all([
          getPayments({ organizationId }),
          getPaymentStats({ organizationId }),
          getInvoices({ organizationId, status: "" }),
        ]);

      setPayments(
        Array.isArray(paymentsResponse?.data?.data)
          ? paymentsResponse.data.data
          : []
      );

      const statsData = statsResponse?.data?.data;
      if (statsData) {
        setStats({
          summary: {
            totalPayments: statsData.summary?.totalPayments || 0,
            totalAmount: statsData.summary?.totalAmount || 0,
            completedAmount: statsData.summary?.completedAmount || 0,
            refundedAmount: statsData.summary?.refundedAmount || 0,
            pendingAmount: statsData.summary?.pendingAmount || 0,
          },
          paymentMethods: statsData.paymentMethods || [],
        });
      }

      setInvoices(
        Array.isArray(invoicesResponse?.data?.data)
          ? invoicesResponse.data.data
          : []
      );
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredPayments = useMemo(() => {
    const term = search.trim().toLowerCase();

    return payments.filter((payment) => {
      const matchesStatus =
        !statusFilter || payment.status === statusFilter;
      const matchesMethod =
        !methodFilter || payment.paymentMethod === methodFilter;

      const matchesSearch =
        !term ||
        [
          payment.paymentNumber,
          payment.transactionId,
          payment.referenceNumber,
          getCustomerName(payment.customer),
          getInvoiceNumber(payment.invoice),
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(term));

      return matchesStatus && matchesMethod && matchesSearch;
    });
  }, [payments, search, statusFilter, methodFilter]);

  const selectedInvoice = useMemo(
    () =>
      invoices.find((invoice) => invoice._id === form.invoice) || null,
    [invoices, form.invoice]
  );

  const setField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  const openCreateModal = () => {
    setForm(initialForm);
    setNotice("");
    setError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    if (!saving) setModalOpen(false);
  };

  const submitPayment = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!organizationId) {
      setError("Please select a business first.");
      return;
    }

    if (!selectedInvoice) {
      setError("Please select a valid invoice.");
      return;
    }

    const amount = Number(form.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Enter a valid payment amount greater than zero.");
      return;
    }

    if (
      form.status === "completed" &&
      amount > Number(selectedInvoice.balanceDue ?? selectedInvoice.totalAmount)
    ) {
      setError("Payment amount cannot exceed the invoice balance.");
      return;
    }

    setSaving(true);

    try {
      await createPayment({
        organizationId,
        paymentData: {
          invoice: selectedInvoice._id,
          customer:
            typeof selectedInvoice.customer === "object"
              ? selectedInvoice.customer?._id
              : selectedInvoice.customer || form.customer,
          amount,
          currency: selectedInvoice.currency || "BDT",
          paymentMethod: form.paymentMethod,
          status: form.status,
          transactionId: form.transactionId.trim(),
          referenceNumber: form.referenceNumber.trim(),
          paymentDate: form.paymentDate,
          notes: form.notes.trim(),
        },
      });

      setModalOpen(false);
      setForm(initialForm);
      setNotice("Payment recorded successfully.");
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleRefund = async (payment) => {
    if (
      payment.status !== "completed" ||
      !window.confirm(
        `Refund ${payment.paymentNumber || "this payment"}? This will update the invoice balance.`
      )
    ) {
      return;
    }

    setError("");
    setNotice("");

    try {
      await refundPayment({
        organizationId,
        paymentId: payment._id,
      });
      setNotice("Payment refunded successfully.");
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleCancel = async (payment) => {
    if (
      !["pending", "failed"].includes(payment.status) ||
      !window.confirm(
        `Cancel ${payment.paymentNumber || "this payment"}?`
      )
    ) {
      return;
    }

    setError("");
    setNotice("");

    try {
      await cancelPayment({
        organizationId,
        paymentId: payment._id,
      });
      setNotice("Payment cancelled successfully.");
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleUpdateStatus = async (payment, status) => {
    setError("");
    setNotice("");

    try {
      await updatePayment({
        organizationId,
        paymentId: payment._id,
        paymentData: { status },
      });
      setNotice("Payment status updated.");
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const summary = stats.summary;

  const statCards = [
    {
      label: "Total Payments",
      value: summary.totalPayments,
      detail: "Recorded transactions",
      icon: "↗",
    },
    {
      label: "Completed",
      value: money(summary.completedAmount),
      detail: "Successfully collected",
      icon: "✓",
    },
    {
      label: "Pending",
      value: money(summary.pendingAmount),
      detail: "Awaiting confirmation",
      icon: "◷",
    },
    {
      label: "Refunded",
      value: money(summary.refundedAmount),
      detail: "Returned to customers",
      icon: "↶",
    },
  ];

  if (!organizationId) {
    return (
      <div className="min-h-screen bg-[#090711] p-6 text-white md:p-10">
        <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/[0.03] p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-300">
            ServiceOS · Payments
          </p>
          <h1 className="mt-4 text-3xl font-bold">Select a business</h1>
          <p className="mt-3 text-slate-400">
            Choose an organization before managing its payments.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090711] px-4 py-6 text-white md:px-8 md:py-9">
      <div className="mx-auto max-w-[1600px] space-y-7">
        <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-300">
              Finance / Transactions
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              Payments
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Track collections, confirm transactions and manage refunds
              across your service business.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={loadData}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/[0.08]"
            >
              ↻ Refresh
            </button>
            <button
              type="button"
              onClick={openCreateModal}
              className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3 text-sm font-semibold shadow-lg shadow-violet-950/40 transition hover:brightness-110"
            >
              + Record Payment
            </button>
          </div>
        </header>

        {error && (
          <div
            role="alert"
            className="flex items-start justify-between gap-4 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200"
          >
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError("")}
              className="text-red-200 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        {notice && (
          <div
            role="status"
            className="flex items-center justify-between gap-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200"
          >
            <span>{notice}</span>
            <button
              type="button"
              onClick={() => setNotice("")}
              className="hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#171326] to-[#100d1a] p-5 shadow-xl shadow-black/10"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">{card.label}</span>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-300/10 bg-violet-400/10 text-lg text-violet-200">
                  {card.icon}
                </span>
              </div>
              <p className="mt-5 break-words text-2xl font-bold tracking-tight">
                {card.value}
              </p>
              <p className="mt-2 text-xs text-slate-500">{card.detail}</p>
            </div>
          ))}
        </section>

        <section className="overflow-hidden rounded-3xl border border-white/[0.08] bg-[#100d1a]">
          <div className="flex flex-col gap-4 border-b border-white/[0.07] p-5 md:p-6 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Payment activity</h2>
              <p className="mt-1 text-sm text-slate-500">
                Search and filter recorded transactions.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:flex">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search payment, invoice, customer..."
                className="min-w-0 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none transition placeholder:text-slate-600 focus:border-violet-400/60 xl:w-72"
              />
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-xl border border-white/10 bg-[#171326] px-4 py-3 text-sm outline-none focus:border-violet-400/60"
              >
                <option value="">All statuses</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                value={methodFilter}
                onChange={(event) => setMethodFilter(event.target.value)}
                className="rounded-xl border border-white/10 bg-[#171326] px-4 py-3 text-sm outline-none focus:border-violet-400/60"
              >
                <option value="">All methods</option>
                {methods.map((method) => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4 p-6">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-16 animate-pulse rounded-xl bg-white/[0.04]"
                />
              ))}
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-300/10 bg-violet-400/10 text-2xl text-violet-200">
                $
              </div>
              <h3 className="mt-5 text-lg font-semibold">
                {payments.length ? "No matching payments" : "No payments yet"}
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                {payments.length
                  ? "Try changing your search or filters."
                  : "Record a payment against an invoice to start tracking collections."}
              </p>
              {!payments.length && (
                <button
                  type="button"
                  onClick={openCreateModal}
                  className="mt-5 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold transition hover:bg-violet-500"
                >
                  Record your first payment
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left text-sm">
                <thead className="bg-white/[0.025] text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">Payment</th>
                    <th className="px-6 py-4 font-medium">Customer / Invoice</th>
                    <th className="px-6 py-4 font-medium">Method</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Amount</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {filteredPayments.map((payment) => (
                    <tr
                      key={payment._id}
                      className="transition hover:bg-white/[0.025]"
                    >
                      <td className="px-6 py-5">
                        <p className="font-semibold text-white">
                          {payment.paymentNumber || "Payment"}
                        </p>
                        <p className="mt-1 max-w-44 truncate text-xs text-slate-500">
                          {payment.transactionId || payment.referenceNumber || "No reference"}
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <p className="font-medium text-slate-200">
                          {getCustomerName(payment.customer)}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {getInvoiceNumber(payment.invoice)}
                        </p>
                      </td>
                      <td className="px-6 py-5 text-slate-300">
                        {methods.find((item) => item.value === payment.paymentMethod)?.label ||
                          payment.paymentMethod}
                      </td>
                      <td className="px-6 py-5 text-slate-400">
                        {formatDate(payment.paymentDate)}
                      </td>
                      <td className="px-6 py-5 font-semibold text-white">
                        {money(payment.amount, payment.currency)}
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium capitalize ${
                            statusColors[payment.status] || statusColors.pending
                          }`}
                        >
                          {payment.status?.replaceAll("_", " ") || "unknown"}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-wrap gap-2">
                          {payment.status === "completed" && (
                            <button
                              type="button"
                              onClick={() => handleRefund(payment)}
                              className="rounded-lg border border-purple-300/20 px-3 py-2 text-xs text-purple-200 transition hover:bg-purple-400/10"
                            >
                              Refund
                            </button>
                          )}
                          {["pending", "failed"].includes(payment.status) && (
                            <>
                              {payment.status !== "completed" && (
                                <button
                                  type="button"
                                  onClick={() => handleUpdateStatus(payment, "completed")}
                                  className="rounded-lg border border-emerald-300/20 px-3 py-2 text-xs text-emerald-200 transition hover:bg-emerald-400/10"
                                >
                                  Confirm
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleCancel(payment)}
                                className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300 transition hover:bg-white/[0.06]"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex flex-col gap-2 border-t border-white/[0.07] px-6 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <span>{filteredPayments.length} payment(s) shown</span>
            <span>
              Total recorded amount: {money(summary.totalAmount)}
            </span>
          </div>
        </section>
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <div className="my-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-[#120e20] shadow-2xl shadow-black/50">
            <div className="flex items-start justify-between border-b border-white/[0.08] p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-300">
                  Finance / New transaction
                </p>
                <h2 className="mt-2 text-2xl font-bold">Record Payment</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Record a payment against an existing invoice.
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="rounded-xl border border-white/10 px-3 py-2 text-slate-400 hover:text-white disabled:opacity-50"
              >
                ✕
              </button>
            </div>

            <form onSubmit={submitPayment} className="space-y-5 p-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Invoice *
                </label>
                <select
                  required
                  value={form.invoice}
                  onChange={(event) => {
                    const invoiceId = event.target.value;
                    const invoice = invoices.find(
                      (item) => item._id === invoiceId
                    );

                    setForm((current) => ({
                      ...current,
                      invoice: invoiceId,
                      customer:
                        typeof invoice?.customer === "object"
                          ? invoice.customer?._id || ""
                          : invoice?.customer || "",
                      amount:
                        invoice?.balanceDue != null
                          ? String(invoice.balanceDue)
                          : invoice?.totalAmount != null
                            ? String(invoice.totalAmount)
                            : "",
                    }));
                  }}
                  className="w-full rounded-xl border border-white/10 bg-[#0c0915] px-4 py-3 text-sm outline-none focus:border-violet-400/60"
                >
                  <option value="">Select invoice</option>
                  {invoices
                    .filter(
                      (invoice) =>
                        invoice.status !== "paid" &&
                        invoice.status !== "cancelled"
                    )
                    .map((invoice) => (
                      <option key={invoice._id} value={invoice._id}>
                        {getInvoiceNumber(invoice)} ·{" "}
                        {getCustomerName(invoice.customer)} · Balance{" "}
                        {money(
                          invoice.balanceDue ?? invoice.totalAmount,
                          invoice.currency
                        )}
                      </option>
                    ))}
                </select>
                {selectedInvoice && (
                  <div className="mt-3 rounded-xl border border-violet-300/10 bg-violet-400/[0.05] p-4 text-sm">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-slate-400">Invoice total</span>
                      <span className="font-medium">
                        {money(selectedInvoice.totalAmount, selectedInvoice.currency)}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-4">
                      <span className="text-slate-400">Already paid</span>
                      <span className="font-medium">
                        {money(selectedInvoice.paidAmount, selectedInvoice.currency)}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-4">
                      <span className="text-slate-400">Balance due</span>
                      <span className="font-semibold text-violet-200">
                        {money(
                          selectedInvoice.balanceDue ?? selectedInvoice.totalAmount,
                          selectedInvoice.currency
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Amount *
                  </label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    required
                    value={form.amount}
                    onChange={(event) => setField("amount", event.target.value)}
                    placeholder="0.00"
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-violet-400/60"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Payment method *
                  </label>
                  <select
                    required
                    value={form.paymentMethod}
                    onChange={(event) => setField("paymentMethod", event.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#0c0915] px-4 py-3 text-sm outline-none focus:border-violet-400/60"
                  >
                    {methods.map((method) => (
                      <option key={method.value} value={method.value}>
                        {method.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Initial status
                  </label>
                  <select
                    value={form.status}
                    onChange={(event) => setField("status", event.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#0c0915] px-4 py-3 text-sm outline-none focus:border-violet-400/60"
                  >
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Payment date *
                  </label>
                  <input
                    type="date"
                    required
                    value={form.paymentDate}
                    onChange={(event) => setField("paymentDate", event.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-violet-400/60"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Transaction ID
                  </label>
                  <input
                    value={form.transactionId}
                    onChange={(event) => setField("transactionId", event.target.value)}
                    maxLength={200}
                    placeholder="Optional"
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-violet-400/60"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Reference number
                  </label>
                  <input
                    value={form.referenceNumber}
                    onChange={(event) => setField("referenceNumber", event.target.value)}
                    maxLength={200}
                    placeholder="Optional"
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-violet-400/60"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Notes
                </label>
                <textarea
                  rows={3}
                  maxLength={2000}
                  value={form.notes}
                  onChange={(event) => setField("notes", event.target.value)}
                  placeholder="Additional payment details..."
                  className="w-full resize-y rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-violet-400/60"
                />
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-white/[0.08] pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-slate-300 hover:bg-white/[0.04] disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !invoices.length}
                  className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 text-sm font-semibold transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Saving payment..." : "Record Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
