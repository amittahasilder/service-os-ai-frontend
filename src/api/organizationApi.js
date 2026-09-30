import api from "./api";

// =====================================================
// GET MY ORGANIZATIONS
// =====================================================

export const getMyOrganizations = async () => {
  const response = await api.get("/organizations");

  return response.data;
};

// =====================================================
// GET SINGLE ORGANIZATION
// =====================================================

export const getOrganization = async (organizationId) => {
  const response = await api.get(
    `/organizations/${organizationId}`
  );

  return response.data;
};

// =====================================================
// GET ORGANIZATION CONTEXT
// =====================================================

export const getOrganizationContext = async (
  organizationId
) => {
  const response = await api.get(
    `/organizations/${organizationId}/context`,
    {
      headers: {
        "x-organization-id": organizationId,
      },
    }
  );

  return response.data;
};