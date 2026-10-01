import api from "./api";

// =====================================
// ORGANIZATION HELPER
// =====================================

const getOrganizationId = () => {
  const organizationId = localStorage.getItem(
    "serviceos_current_organization"
  );

  if (!organizationId) {
    throw new Error("No organization selected.");
  }

  return organizationId;
};

// =====================================
// GET ALL LEADS
// =====================================

export const getLeads = async (params = {}) => {
  const organizationId = getOrganizationId();

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

export const getLeadStats = async () => {
  const organizationId = getOrganizationId();

  const response = await api.get(
    `/organizations/${organizationId}/leads/stats`
  );

  return response.data;
};

// =====================================
// GET SINGLE LEAD
// =====================================

export const getLead = async (leadId) => {
  const organizationId = getOrganizationId();

  const response = await api.get(
    `/organizations/${organizationId}/leads/${leadId}`
  );

  return response.data;
};

// =====================================
// CREATE LEAD
// =====================================

export const createLead = async (leadData) => {
  const organizationId = getOrganizationId();

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
  leadId,
  leadData
) => {
  const organizationId = getOrganizationId();

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
  leadId,
  status
) => {
  const organizationId = getOrganizationId();

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

export const removeLead = async (leadId) => {
  const organizationId = getOrganizationId();

  const response = await api.delete(
    `/organizations/${organizationId}/leads/${leadId}`
  );

  return response.data;
};