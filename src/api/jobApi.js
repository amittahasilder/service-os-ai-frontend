
import api from "./api";

// =====================================
// JOB API
// =====================================

// =====================================
// VALIDATE ORGANIZATION ID
// =====================================

const requireOrganizationId = (organizationId) => {
  if (!organizationId) {
    throw new Error("Organization ID is required");
  }

  return organizationId;
};

// =====================================
// GET ALL JOBS
// GET /organizations/:organizationId/jobs
// =====================================

export const getJobs = async ({
  organizationId,
  status = "",
  priority = "",
  staff = "",
  customer = "",
  booking = "",
  date = "",
} = {}) => {
  const orgId = requireOrganizationId(organizationId);

  const params = {};

  if (status) params.status = status;
  if (priority) params.priority = priority;
  if (staff) params.staff = staff;
  if (customer) params.customer = customer;
  if (booking) params.booking = booking;
  if (date) params.date = date;

  const response = await api.get(
    `/organizations/${orgId}/jobs`,
    { params }
  );

  return response.data;
};

// =====================================
// GET JOB STATS
// GET /organizations/:organizationId/jobs/stats
// =====================================

export const getJobStats = async ({
  organizationId,
} = {}) => {
  const orgId = requireOrganizationId(organizationId);

  const response = await api.get(
    `/organizations/${orgId}/jobs/stats`
  );

  return response.data;
};

// =====================================
// GET SINGLE JOB
// GET /organizations/:organizationId/jobs/:jobId
// =====================================

export const getJobById = async ({
  organizationId,
  jobId,
} = {}) => {
  const orgId = requireOrganizationId(organizationId);

  if (!jobId) {
    throw new Error("Job ID is required");
  }

  const response = await api.get(
    `/organizations/${orgId}/jobs/${jobId}`
  );

  return response.data;
};

// =====================================
// CREATE JOB
// POST /organizations/:organizationId/jobs
// =====================================

export const createJob = async ({
  organizationId,
  jobData,
} = {}) => {
  const orgId = requireOrganizationId(organizationId);

  if (!jobData || typeof jobData !== "object") {
    throw new Error("Job data is required");
  }

  const response = await api.post(
    `/organizations/${orgId}/jobs`,
    jobData
  );

  return response.data;
};

// =====================================
// UPDATE JOB
// PUT /organizations/:organizationId/jobs/:jobId
// =====================================

export const updateJob = async ({
  organizationId,
  jobId,
  jobData,
} = {}) => {
  const orgId = requireOrganizationId(organizationId);

  if (!jobId) {
    throw new Error("Job ID is required");
  }

  if (!jobData || typeof jobData !== "object") {
    throw new Error("Job data is required");
  }

  const response = await api.put(
    `/organizations/${orgId}/jobs/${jobId}`,
    jobData
  );

  return response.data;
};

// =====================================
// CANCEL JOB
// DELETE /organizations/:organizationId/jobs/:jobId
// =====================================

export const cancelJob = async ({
  organizationId,
  jobId,
} = {}) => {
  const orgId = requireOrganizationId(organizationId);

  if (!jobId) {
    throw new Error("Job ID is required");
  }

  const response = await api.delete(
    `/organizations/${orgId}/jobs/${jobId}`
  );

  return response.data;
};
