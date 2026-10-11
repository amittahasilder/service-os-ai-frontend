import api from "./api";

import {
  requireOrganizationId,
} from "../utils/organization";

// =====================================================
// VALIDATE + NORMALIZE ORGANIZATION
// =====================================================

const validateOrganizationId = (
  organizationId
) => {
  return requireOrganizationId(
    organizationId
  );
};

// =====================================================
// GET ALL CUSTOMERS
// =====================================================

export const getCustomers = async ({
  organizationId,
  status,
  source,
  search,
} = {}) => {
  const normalizedOrganizationId =
    validateOrganizationId(
      organizationId
    );

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
    `/organizations/${normalizedOrganizationId}/customers`,
    {
      params,
    }
  );

  return response.data;
};

// =====================================================
// GET SINGLE CUSTOMER
// =====================================================

export const getCustomer = async ({
  organizationId,
  customerId,
}) => {
  const normalizedOrganizationId =
    validateOrganizationId(
      organizationId
    );

  if (!customerId) {
    throw new Error(
      "Customer ID is required."
    );
  }

  const response = await api.get(
    `/organizations/${normalizedOrganizationId}/customers/${customerId}`
  );

  return response.data;
};

// =====================================================
// CREATE CUSTOMER
// =====================================================

export const createCustomer = async ({
  organizationId,
  customerData,
}) => {
  const normalizedOrganizationId =
    validateOrganizationId(
      organizationId
    );

  if (
    !customerData ||
    typeof customerData !== "object"
  ) {
    throw new Error(
      "Customer data is required."
    );
  }

  const response = await api.post(
    `/organizations/${normalizedOrganizationId}/customers`,
    customerData
  );

  return response.data;
};

// =====================================================
// UPDATE CUSTOMER
// =====================================================

export const updateCustomer = async ({
  organizationId,
  customerId,
  customerData,
}) => {
  const normalizedOrganizationId =
    validateOrganizationId(
      organizationId
    );

  if (!customerId) {
    throw new Error(
      "Customer ID is required."
    );
  }

  if (
    !customerData ||
    typeof customerData !== "object"
  ) {
    throw new Error(
      "Customer data is required."
    );
  }

  const response = await api.put(
    `/organizations/${normalizedOrganizationId}/customers/${customerId}`,
    customerData
  );

  return response.data;
};

// =====================================================
// ARCHIVE CUSTOMER
// =====================================================

export const archiveCustomer = async ({
  organizationId,
  customerId,
}) => {
  const normalizedOrganizationId =
    validateOrganizationId(
      organizationId
    );

  if (!customerId) {
    throw new Error(
      "Customer ID is required."
    );
  }

  const response = await api.delete(
    `/organizations/${normalizedOrganizationId}/customers/${customerId}`
  );

  return response.data;
};

// =====================================================
// CUSTOMER STATS
// =====================================================

export const getCustomerStats = async (
  organizationId
) => {
  const normalizedOrganizationId =
    validateOrganizationId(
      organizationId
    );

  const response = await api.get(
    `/organizations/${normalizedOrganizationId}/customers/stats`
  );

  return response.data;
};

// =====================================================
// LEAD → CUSTOMER
// =====================================================

export const convertLeadToCustomer =
  async ({
    organizationId,
    leadId,
  }) => {
    const normalizedOrganizationId =
      validateOrganizationId(
        organizationId
      );

    if (!leadId) {
      throw new Error(
        "Lead ID is required."
      );
    }

    const response =
      await api.post(
        `/organizations/${normalizedOrganizationId}/leads/${leadId}/convert`
      );

    return response.data;
  };