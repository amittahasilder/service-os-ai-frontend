
import api from "./api";

// =====================================
// INVOICE API
// Backend baseURL: http://localhost:5000/api
// =====================================

const requireOrganizationId = (organizationId) => {
  if (!organizationId) {
    throw new Error("Organization ID is required");
  }

  return organizationId;
};

const requireInvoiceId = (invoiceId) => {
  if (!invoiceId) {
    throw new Error("Invoice ID is required");
  }

  return invoiceId;
};

// =====================================
// GET ALL INVOICES
// GET /api/organizations/:organizationId/invoices
// =====================================

export const getInvoices = async ({
  organizationId,
  search = "",
  status = "",
  customer = "",
  job = "",
} = {}) => {
  requireOrganizationId(organizationId);

  const params = {};

  if (search.trim()) params.search = search.trim();
  if (status) params.status = status;
  if (customer) params.customer = customer;
  if (job) params.job = job;

  return api.get(
    `/organizations/${organizationId}/invoices`,
    { params }
  );
};

// =====================================
// GET INVOICE STATISTICS
// GET /api/organizations/:organizationId/invoices/stats
// =====================================

export const getInvoiceStats = async ({
  organizationId,
} = {}) => {
  requireOrganizationId(organizationId);

  return api.get(
    `/organizations/${organizationId}/invoices/stats`
  );
};

// =====================================
// GET SINGLE INVOICE
// GET /api/organizations/:organizationId/invoices/:invoiceId
// =====================================

export const getInvoiceById = async ({
  organizationId,
  invoiceId,
}) => {
  requireOrganizationId(organizationId);
  requireInvoiceId(invoiceId);

  return api.get(
    `/organizations/${organizationId}/invoices/${invoiceId}`
  );
};

// =====================================
// CREATE INVOICE
// POST /api/organizations/:organizationId/invoices
// =====================================

export const createInvoice = async ({
  organizationId,
  invoiceData,
}) => {
  requireOrganizationId(organizationId);

  if (!invoiceData || typeof invoiceData !== "object") {
    throw new Error("Invoice data is required");
  }

  return api.post(
    `/organizations/${organizationId}/invoices`,
    invoiceData
  );
};

// =====================================
// UPDATE INVOICE
// PUT /api/organizations/:organizationId/invoices/:invoiceId
// =====================================

export const updateInvoice = async ({
  organizationId,
  invoiceId,
  invoiceData,
}) => {
  requireOrganizationId(organizationId);
  requireInvoiceId(invoiceId);

  if (!invoiceData || typeof invoiceData !== "object") {
    throw new Error("Invoice data is required");
  }

  return api.put(
    `/organizations/${organizationId}/invoices/${invoiceId}`,
    invoiceData
  );
};

// =====================================
// DELETE / CANCEL INVOICE
// DELETE /api/organizations/:organizationId/invoices/:invoiceId
// =====================================

export const deleteInvoice = async ({
  organizationId,
  invoiceId,
}) => {
  requireOrganizationId(organizationId);
  requireInvoiceId(invoiceId);

  return api.delete(
    `/organizations/${organizationId}/invoices/${invoiceId}`
  );
};
