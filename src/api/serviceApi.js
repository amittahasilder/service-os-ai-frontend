

import api from "./api";

// =============================================
// SERVICE API
// =============================================

const normalizeOrganizationId = (organizationId) => {
  const id = String(organizationId || "").trim();

  if (!id) {
    throw new Error("Organization ID is required.");
  }

  return id;
};

const normalizeServiceId = (serviceId) => {
  const id = String(serviceId || "").trim();

  if (!id) {
    throw new Error("Service ID is required.");
  }

  return id;
};

const getBasePath = (organizationId) =>
  `/organizations/${normalizeOrganizationId(
    organizationId
  )}/services`;

// =============================================
// GET SERVICES
// =============================================

export const getServices = async ({
  organizationId,
  search = "",
  category = "",
  status = "",
} = {}) => {
  const response = await api.get(getBasePath(organizationId), {
    params: {
      ...(search.trim() ? { search: search.trim() } : {}),
      ...(category ? { category } : {}),
      ...(status ? { status } : {}),
    },
  });

  return response.data;
};

// =============================================
// GET SERVICE STATISTICS
// =============================================

export const getServiceStats = async (organizationId) => {
  const response = await api.get(
    `${getBasePath(organizationId)}/stats`
  );

  return response.data;
};

// =============================================
// GET SINGLE SERVICE
// =============================================

export const getServiceById = async ({
  organizationId,
  serviceId,
}) => {
  const response = await api.get(
    `${getBasePath(organizationId)}/${normalizeServiceId(
      serviceId
    )}`
  );

  return response.data;
};

// =============================================
// CREATE SERVICE
// =============================================

export const createService = async ({
  organizationId,
  serviceData,
}) => {
  if (!serviceData || typeof serviceData !== "object") {
    throw new Error("Service data is required.");
  }

  const response = await api.post(
    getBasePath(organizationId),
    serviceData
  );

  return response.data;
};

// =============================================
// UPDATE SERVICE
// =============================================

export const updateService = async ({
  organizationId,
  serviceId,
  serviceData,
}) => {
  if (!serviceData || typeof serviceData !== "object") {
    throw new Error("Service data is required.");
  }

  const response = await api.put(
    `${getBasePath(organizationId)}/${normalizeServiceId(
      serviceId
    )}`,
    serviceData
  );

  return response.data;
};

// =============================================
// ARCHIVE SERVICE
// =============================================

export const archiveService = async ({
  organizationId,
  serviceId,
}) => {
  const response = await api.delete(
    `${getBasePath(organizationId)}/${normalizeServiceId(
      serviceId
    )}`
  );

  return response.data;
};
