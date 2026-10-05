import api from "./api";

import {
  requireOrganizationId,
} from "../utils/organization";

// =====================================================
// VALIDATE + NORMALIZE ORGANIZATION
// =====================================================

const validateOrganizationId = (
  organization
) => {
  return requireOrganizationId(
    organization
  );
};

// =====================================================
// GET ALL CUSTOMERS
// =====================================================

export const getCustomers = async ({
  organization,
  status,
  source,
  search,
} = {}) => {
  const organizationId =
    validateOrganizationId(
      organization
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
    `/organizations/${organizationId}/customers`,
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
  organization,
  customerId,
}) => {
  const organizationId =
    validateOrganizationId(
      organization
    );

  if (!customerId) {
    throw new Error(
      "Customer ID is required."
    );
  }

  const response = await api.get(
    `/organizations/${organizationId}/customers/${customerId}`
  );

  return response.data;
};

// =====================================================
// CREATE CUSTOMER
// =====================================================

export const createCustomer = async ({
  organization,
  customerData,
}) => {
  const organizationId =
    validateOrganizationId(
      organization
    );

  const response = await api.post(
    `/organizations/${organizationId}/customers`,
    customerData
  );

  return response.data;
};

// =====================================================
// UPDATE CUSTOMER
// =====================================================

export const updateCustomer = async ({
  organization,
  customerId,
  customerData,
}) => {
  const organizationId =
    validateOrganizationId(
      organization
    );

  if (!customerId) {
    throw new Error(
      "Customer ID is required."
    );
  }

  const response = await api.put(
    `/organizations/${organizationId}/customers/${customerId}`,
    customerData
  );

  return response.data;
};

// =====================================================
// ARCHIVE CUSTOMER
// =====================================================

export const archiveCustomer = async ({
  organization,
  customerId,
}) => {
  const organizationId =
    validateOrganizationId(
      organization
    );

  if (!customerId) {
    throw new Error(
      "Customer ID is required."
    );
  }

  const response = await api.delete(
    `/organizations/${organizationId}/customers/${customerId}`
  );

  return response.data;
};

// =====================================================
// CUSTOMER STATS
// =====================================================

export const getCustomerStats = async (
  organization
) => {
  const organizationId =
    validateOrganizationId(
      organization
    );

  const response = await api.get(
    `/organizations/${organizationId}/customers/stats`
  );

  return response.data;
};

// =====================================================
// LEAD → CUSTOMER
// =====================================================

export const convertLeadToCustomer =
  async ({
    organization,
    leadId,
  }) => {
    const organizationId =
      validateOrganizationId(
        organization
      );

    if (!leadId) {
      throw new Error(
        "Lead ID is required."
      );
    }

    const response =
      await api.post(
        `/organizations/${organizationId}/leads/${leadId}/convert`
      );

    return response.data;
  };