import api from "./api";

import {
  requireOrganizationId,
} from "../utils/organization";

// =====================================
// VALIDATE + NORMALIZE ORGANIZATION
// =====================================

const validateOrganizationId = (
  organization
) => {
  return requireOrganizationId(
    organization
  );
};

// =====================================
// GET ALL LEADS
// =====================================

export const getLeads = async (
  organization,
  params = {}
) => {
  const organizationId =
    validateOrganizationId(
      organization
    );

  const response = await api.get(
    `/organizations/${organizationId}/leads`,
    {
      params,
    }
  );

  return response.data;
};

// =====================================
// GET LEAD STATISTICS
// =====================================

export const getLeadStats = async (
  organization
) => {
  const organizationId =
    validateOrganizationId(
      organization
    );

  const response = await api.get(
    `/organizations/${organizationId}/leads/stats`
  );

  return response.data;
};

// =====================================
// GET SINGLE LEAD
// =====================================

export const getLead = async (
  organization,
  leadId
) => {
  const organizationId =
    validateOrganizationId(
      organization
    );

  if (!leadId) {
    throw new Error(
      "Lead ID is required."
    );
  }

  const response = await api.get(
    `/organizations/${organizationId}/leads/${leadId}`
  );

  return response.data;
};

// =====================================
// CREATE LEAD
// =====================================

export const createLead = async (
  organization,
  leadData
) => {
  const organizationId =
    validateOrganizationId(
      organization
    );

  const response = await api.post(
    `/organizations/${organizationId}/leads`,
    leadData
  );

  return response.data;
};

// =====================================
// UPDATE LEAD
// =====================================

export const updateLead = async (
  organization,
  leadId,
  leadData
) => {
  const organizationId =
    validateOrganizationId(
      organization
    );

  if (!leadId) {
    throw new Error(
      "Lead ID is required."
    );
  }

  const response = await api.put(
    `/organizations/${organizationId}/leads/${leadId}`,
    leadData
  );

  return response.data;
};

// =====================================
// UPDATE LEAD STATUS
// =====================================

export const updateLeadStatus = async (
  organization,
  leadId,
  status
) => {
  const organizationId =
    validateOrganizationId(
      organization
    );

  if (!leadId) {
    throw new Error(
      "Lead ID is required."
    );
  }

  if (!status) {
    throw new Error(
      "Lead status is required."
    );
  }

  const response = await api.patch(
    `/organizations/${organizationId}/leads/${leadId}/status`,
    {
      status,
    }
  );

  return response.data;
};

// =====================================
// DELETE / ARCHIVE LEAD
// =====================================

export const removeLead = async (
  organization,
  leadId
) => {
  const organizationId =
    validateOrganizationId(
      organization
    );

  if (!leadId) {
    throw new Error(
      "Lead ID is required."
    );
  }

  const response = await api.delete(
    `/organizations/${organizationId}/leads/${leadId}`
  );

  return response.data;
};