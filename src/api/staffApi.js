import api from "./api";

// =============================================
// STAFF API
// =============================================

const normalizeOrganizationId = (organizationId) => {
  const id = String(organizationId || "").trim();

  if (!id) {
    throw new Error("Organization ID is required.");
  }

  return id;
};

const normalizeStaffId = (staffId) => {
  const id = String(staffId || "").trim();

  if (!id) {
    throw new Error("Staff ID is required.");
  }

  return id;
};

const getBasePath = (organizationId) =>
  `/organizations/${normalizeOrganizationId(organizationId)}/staff`;

// =============================================
// GET ALL STAFF
// =============================================

export const getStaff = async ({
  organizationId,
  search = "",
  status = "",
  role = "",
  availability = "",
} = {}) => {
  const response = await api.get(getBasePath(organizationId), {
    params: {
      ...(search.trim() ? { search: search.trim() } : {}),
      ...(status ? { status } : {}),
      ...(role ? { role } : {}),
      ...(availability ? { availability } : {}),
    },
  });

  return response.data;
};

// =============================================
// GET STAFF STATISTICS
// =============================================

export const getStaffStats = async (organizationId) => {
  const response = await api.get(
    `${getBasePath(organizationId)}/stats`
  );

  return response.data;
};

// =============================================
// GET SINGLE STAFF MEMBER
// =============================================

export const getStaffById = async ({
  organizationId,
  staffId,
}) => {
  const response = await api.get(
    `${getBasePath(organizationId)}/${normalizeStaffId(staffId)}`
  );

  return response.data;
};

// =============================================
// CREATE STAFF
// =============================================

export const createStaff = async ({
  organizationId,
  staffData,
}) => {
  if (!staffData || typeof staffData !== "object") {
    throw new Error("Staff data is required.");
  }

  const response = await api.post(
    getBasePath(organizationId),
    staffData
  );

  return response.data;
};

// =============================================
// UPDATE STAFF
// =============================================

export const updateStaff = async ({
  organizationId,
  staffId,
  staffData,
}) => {
  if (!staffData || typeof staffData !== "object") {
    throw new Error("Staff data is required.");
  }

  const response = await api.put(
    `${getBasePath(organizationId)}/${normalizeStaffId(staffId)}`,
    staffData
  );

  return response.data;
};

// =============================================
// ARCHIVE STAFF
// =============================================

export const archiveStaff = async ({
  organizationId,
  staffId,
}) => {
  const response = await api.delete(
    `${getBasePath(organizationId)}/${normalizeStaffId(staffId)}`
  );

  return response.data;
};
