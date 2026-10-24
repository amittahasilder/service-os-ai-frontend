
import api from "./api";

// =====================================
// VALIDATE REQUIRED IDs
// =====================================

const requireOrganizationId = (organizationId) => {
  if (!organizationId) {
    throw new Error("Organization ID is required");
  }
};

const requirePaymentId = (paymentId) => {
  if (!paymentId) {
    throw new Error("Payment ID is required");
  }
};

// =====================================
// GET ALL PAYMENTS
// GET /:organizationId/payments
// =====================================

export const getPayments = async ({
  organizationId,
  search = "",
  status = "",
  paymentMethod = "",
  invoice = "",
  customer = "",
} = {}) => {
  requireOrganizationId(organizationId);

  const params = {};

  if (search.trim()) params.search = search.trim();
  if (status) params.status = status;
  if (paymentMethod) params.paymentMethod = paymentMethod;
  if (invoice) params.invoice = invoice;
  if (customer) params.customer = customer;

  return api.get(
    `/organizations/${organizationId}/payments`,
    { params }
  );
};

// =====================================
// GET PAYMENT STATS
// GET /:organizationId/payments/stats
// =====================================

export const getPaymentStats = async ({ organizationId } = {}) => {
  requireOrganizationId(organizationId);

  return api.get(
    `/organizations/${organizationId}/payments/stats`
  );
};

// =====================================
// GET SINGLE PAYMENT
// GET /:organizationId/payments/:paymentId
// =====================================

export const getPaymentById = async ({
  organizationId,
  paymentId,
}) => {
  requireOrganizationId(organizationId);
  requirePaymentId(paymentId);

  return api.get(
    `/organizations/${organizationId}/payments/${paymentId}`
  );
};

// =====================================
// CREATE PAYMENT
// POST /:organizationId/payments
// =====================================

export const createPayment = async ({
  organizationId,
  paymentData,
}) => {
  requireOrganizationId(organizationId);

  if (!paymentData || typeof paymentData !== "object") {
    throw new Error("Payment data is required");
  }

  return api.post(
    `/organizations/${organizationId}/payments`,
    paymentData
  );
};

// =====================================
// UPDATE PAYMENT
// PUT /:organizationId/payments/:paymentId
// =====================================

export const updatePayment = async ({
  organizationId,
  paymentId,
  paymentData,
}) => {
  requireOrganizationId(organizationId);
  requirePaymentId(paymentId);

  if (!paymentData || typeof paymentData !== "object") {
    throw new Error("Payment data is required");
  }

  return api.put(
    `/organizations/${organizationId}/payments/${paymentId}`,
    paymentData
  );
};

// =====================================
// REFUND PAYMENT
// POST /:organizationId/payments/:paymentId/refund
// =====================================

export const refundPayment = async ({
  organizationId,
  paymentId,
  refundData = {},
}) => {
  requireOrganizationId(organizationId);
  requirePaymentId(paymentId);

  return api.post(
    `/organizations/${organizationId}/payments/${paymentId}/refund`,
    refundData
  );
};

// =====================================
// CANCEL PAYMENT
// POST /:organizationId/payments/:paymentId/cancel
// =====================================

export const cancelPayment = async ({
  organizationId,
  paymentId,
  cancelData = {},
}) => {
  requireOrganizationId(organizationId);
  requirePaymentId(paymentId);

  return api.post(
    `/organizations/${organizationId}/payments/${paymentId}/cancel`,
    cancelData
  );
};
