import api from "./api";

// =====================================================
// NORMALIZE ORGANIZATION
// =====================================================

const normalizeOrganization = (
  organization
) => {
  if (!organization) {
    return null;
  }

  /*
   * Support different backend shapes:
   *
   * organization._id
   * organization.id
   * organization.organizationId
   * organization.organization._id
   * organization.organization.id
   */

  const organizationId =
    organization._id ||
    organization.id ||
    organization.organizationId ||
    organization.organization?._id ||
    organization.organization?.id;

  if (!organizationId) {
    console.warn(
      "ServiceOS: Organization has no valid ID:",
      organization
    );

    return null;
  }

  /*
   * If backend returns:
   *
   * {
   *   organization: {
   *      _id: "..."
   *   },
   *   role: "owner"
   * }
   *
   * preserve the original object but expose
   * the organization ID as _id.
   */

  return {
    ...organization,

    _id: String(
      organizationId
    ),
  };
};

// =====================================================
// GET MY ORGANIZATIONS
// =====================================================

export const getMyOrganizations =
  async () => {
    const response =
      await api.get(
        "/organizations"
      );

    const result =
      response.data;

    console.log(
      "ServiceOS organization API response:",
      result
    );

    // =================================================
    // EXTRACT BUSINESSES
    // =================================================

    let businesses = [];

    // Case 1:
    // response itself is an array

    if (
      Array.isArray(result)
    ) {
      businesses = result;
    }

    // Case 2:
    // { businesses: [] }

    else if (
      Array.isArray(
        result?.businesses
      )
    ) {
      businesses =
        result.businesses;
    }

    // Case 3:
    // { organizations: [] }

    else if (
      Array.isArray(
        result?.organizations
      )
    ) {
      businesses =
        result.organizations;
    }

    // Case 4:
    // { data: { businesses: [] } }

    else if (
      Array.isArray(
        result?.data?.businesses
      )
    ) {
      businesses =
        result.data.businesses;
    }

    // Case 5:
    // { data: { organizations: [] } }

    else if (
      Array.isArray(
        result?.data?.organizations
      )
    ) {
      businesses =
        result.data.organizations;
    }

    // =================================================
    // DEBUG RAW BUSINESS LIST
    // =================================================

    console.log(
      "ServiceOS businesses from API:",
      businesses
    );

    // =================================================
    // NORMALIZE
    // =================================================

    const normalizedBusinesses =
      businesses
        .map(
          normalizeOrganization
        )
        .filter(Boolean);

    console.log(
      "ServiceOS normalized businesses:",
      normalizedBusinesses
    );

    // =================================================
    // RETURN CLEAN ARRAY
    // =================================================

    return normalizedBusinesses;
  };

// =====================================================
// GET SINGLE ORGANIZATION
// =====================================================

export const getOrganization =
  async (organizationId) => {
    if (!organizationId) {
      throw new Error(
        "Organization ID is required."
      );
    }

    const response =
      await api.get(
        `/organizations/${organizationId}`
      );

    return response.data;
  };

// =====================================================
// GET ORGANIZATION CONTEXT
// =====================================================

export const getOrganizationContext =
  async (organizationId) => {
    if (!organizationId) {
      throw new Error(
        "Organization ID is required."
      );
    }

    const response =
      await api.get(
        `/organizations/${organizationId}/context`,
        {
          headers: {
            "x-organization-id":
              organizationId,
          },
        }
      );

    return response.data;
  };