import api from "./api";

// =====================================
// CUSTOMER API
// =====================================

// -------------------------------------
// GET ALL CUSTOMERS
// -------------------------------------

export const getCustomers = async ({
  organizationId,
  status,
  source,
  search,
} = {}) => {
  if (!organizationId) {
    throw new Error(
      "Organization ID is required"
    );
  }

  const params = {};

  if (status) {
    params.status = status;
  }

  if (source) {
    params.source = source;
  }

  if (search) {
    params.search = search;
  }

  const response = await api.get(
    `/organizations/${organizationId}/customers`,
    {
      params,
    }
  );

  return response.data;
};

// -------------------------------------
// GET SINGLE CUSTOMER
// -------------------------------------

export const getCustomer = async ({
  organizationId,
  customerId,
}) => {
  if (!organizationId) {
    throw new Error(
      "Organization ID is required"
    );
  }

  if (!customerId) {
    throw new Error(
      "Customer ID is required"
    );
  }

  const response = await api.get(
    `/organizations/${organizationId}/customers/${customerId}`
  );

  return response.data;
};

// -------------------------------------
// CREATE CUSTOMER
// -------------------------------------

export const createCustomer = async ({
  organizationId,
  customerData,
}) => {
  if (!organizationId) {
    throw new Error(
      "Organization ID is required"
    );
  }

  const response = await api.post(
    `/organizations/${organizationId}/customers`,
    customerData
  );

  return response.data;
};

// -------------------------------------
// UPDATE CUSTOMER
// -------------------------------------

export const updateCustomer = async ({
  organizationId,
  customerId,
  customerData,
}) => {
  if (!organizationId) {
    throw new Error(
      "Organization ID is required"
    );
  }

  if (!customerId) {
    throw new Error(
      "Customer ID is required"
    );
  }

  const response = await api.put(
    `/organizations/${organizationId}/customers/${customerId}`,
    customerData
  );

  return response.data;
};

// -------------------------------------
// ARCHIVE CUSTOMER
// -------------------------------------

export const archiveCustomer = async ({
  organizationId,
  customerId,
}) => {
  if (!organizationId) {
    throw new Error(
      "Organization ID is required"
    );
  }

  if (!customerId) {
    throw new Error(
      "Customer ID is required"
    );
  }

  const response = await api.delete(
    `/organizations/${organizationId}/customers/${customerId}`
  );

  return response.data;
};

// -------------------------------------
// CUSTOMER STATS
// -------------------------------------

export const getCustomerStats = async (
  organizationId
) => {
  if (!organizationId) {
    throw new Error(
      "Organization ID is required"
    );
  }

  const response = await api.get(
    `/organizations/${organizationId}/customers/stats`
  );

  return response.data;
};

// -------------------------------------
// LEAD → CUSTOMER
// -------------------------------------

export const convertLeadToCustomer = async ({
  organizationId,
  leadId,
}) => {
  if (!organizationId) {
    throw new Error(
      "Organization ID is required"
    );
  }

  if (!leadId) {
    throw new Error(
      "Lead ID is required"
    );
  }

  const response = await api.post(
    `/organizations/${organizationId}/leads/${leadId}/convert`
  );

  return response.data;
};