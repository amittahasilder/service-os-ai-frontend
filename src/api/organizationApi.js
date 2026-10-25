// import api from "./api";

// // =====================================================
// // NORMALIZE ORGANIZATION
// // =====================================================

// const normalizeOrganization = (
//   organization
// ) => {
//   if (!organization) {
//     return null;
//   }

//   /*
//    * Support different backend shapes:
//    *
//    * organization._id
//    * organization.id
//    * organization.organizationId
//    * organization.organization._id
//    * organization.organization.id
//    */

//   const organizationId =
//     organization._id ||
//     organization.id ||
//     organization.organizationId ||
//     organization.organization?._id ||
//     organization.organization?.id;

//   if (!organizationId) {
//     console.warn(
//       "ServiceOS: Organization has no valid ID:",
//       organization
//     );

//     return null;
//   }

//   /*
//    * If backend returns:
//    *
//    * {
//    *   organization: {
//    *      _id: "..."
//    *   },
//    *   role: "owner"
//    * }
//    *
//    * preserve the original object but expose
//    * the organization ID as _id.
//    */

//   return {
//     ...organization,

//     _id: String(
//       organizationId
//     ),
//   };
// };

// // =====================================================
// // GET MY ORGANIZATIONS
// // =====================================================

// export const getMyOrganizations =
//   async () => {
//     const response =
//       await api.get(
//         "/organizations"
//       );

//     const result =
//       response.data;

//     console.log(
//       "ServiceOS organization API response:",
//       result
//     );

//     // =================================================
//     // EXTRACT BUSINESSES
//     // =================================================

//     let businesses = [];

//     // Case 1:
//     // response itself is an array

//     if (
//       Array.isArray(result)
//     ) {
//       businesses = result;
//     }

//     // Case 2:
//     // { businesses: [] }

//     else if (
//       Array.isArray(
//         result?.businesses
//       )
//     ) {
//       businesses =
//         result.businesses;
//     }

//     // Case 3:
//     // { organizations: [] }

//     else if (
//       Array.isArray(
//         result?.organizations
//       )
//     ) {
//       businesses =
//         result.organizations;
//     }

//     // Case 4:
//     // { data: { businesses: [] } }

//     else if (
//       Array.isArray(
//         result?.data?.businesses
//       )
//     ) {
//       businesses =
//         result.data.businesses;
//     }

//     // Case 5:
//     // { data: { organizations: [] } }

//     else if (
//       Array.isArray(
//         result?.data?.organizations
//       )
//     ) {
//       businesses =
//         result.data.organizations;
//     }

//     // =================================================
//     // DEBUG RAW BUSINESS LIST
//     // =================================================

//     console.log(
//       "ServiceOS businesses from API:",
//       businesses
//     );

//     // =================================================
//     // NORMALIZE
//     // =================================================

//     const normalizedBusinesses =
//       businesses
//         .map(
//           normalizeOrganization
//         )
//         .filter(Boolean);

//     console.log(
//       "ServiceOS normalized businesses:",
//       normalizedBusinesses
//     );

//     // =================================================
//     // RETURN CLEAN ARRAY
//     // =================================================

//     return normalizedBusinesses;
//   };

// // =====================================================
// // GET SINGLE ORGANIZATION
// // =====================================================

// export const getOrganization =
//   async (organizationId) => {
//     if (!organizationId) {
//       throw new Error(
//         "Organization ID is required."
//       );
//     }

//     const response =
//       await api.get(
//         `/organizations/${organizationId}`
//       );

//     return response.data;
//   };

// // =====================================================
// // GET ORGANIZATION CONTEXT
// // =====================================================

// export const getOrganizationContext =
//   async (organizationId) => {
//     if (!organizationId) {
//       throw new Error(
//         "Organization ID is required."
//       );
//     }

//     const response =
//       await api.get(
//         `/organizations/${organizationId}/context`,
//         {
//           headers: {
//             "x-organization-id":
//               organizationId,
//           },
//         }
//       );

//     return response.data;
//   };




import api from "./api";

// =====================================================
// NORMALIZE ORGANIZATION
// Supports organization and membership response shapes
// =====================================================

const normalizeOrganization = (organization) => {
  if (!organization) {
    return null;
  }

  // A membership object may contain its organization
  // as a nested property.
  const organizationData =
    organization.organization ||
    organization.business ||
    organization;

  const organizationId =
    organizationData?._id ||
    organizationData?.id ||
    organizationData?.organizationId ||
    organization?.organizationId ||
    organization?._id ||
    organization?.id;

  if (!organizationId) {
    console.warn(
      "ServiceOS: Organization has no valid ID:",
      organization
    );

    return null;
  }

  return {
    ...organizationData,
    _id: String(organizationId),

    // Preserve membership information when available.
    ...(organization.membershipId
      ? { membershipId: organization.membershipId }
      : {}),

    ...(organization.role
      ? { role: organization.role }
      : {}),

    ...(organization.status
      ? { status: organization.status }
      : {}),

    ...(organization.joinedAt
      ? { joinedAt: organization.joinedAt }
      : {}),
  };
};

// =====================================================
// CREATE BUSINESS / WORKSPACE
// POST /api/organizations
// =====================================================

export const createBusiness = async (businessData = {}) => {
  const name =
    typeof businessData.name === "string"
      ? businessData.name.trim()
      : "";

  const businessType =
    typeof businessData.businessType === "string"
      ? businessData.businessType.trim()
      : "";

  if (!name) {
    throw new Error("Workspace name is required.");
  }

  if (!businessType) {
    throw new Error("Business type is required.");
  }

  const payload = {
    name,
    businessType,
  };

  // Optional fields
  ["email", "phone", "website", "address", "logo"].forEach(
    (field) => {
      const value = businessData[field];

      if (typeof value === "string" && value.trim()) {
        payload[field] = value.trim();
      } else if (value && typeof value === "object") {
        payload[field] = value;
      }
    }
  );

  const response = await api.post(
    "/organizations",
    payload
  );

  const result = response.data;

  const organization =
    result?.data?.organization ||
    result?.organization;

  if (!organization) {
    throw new Error(
      result?.message ||
        "Workspace creation response did not contain organization data."
    );
  }

  const normalizedOrganization =
    normalizeOrganization(organization);

  if (!normalizedOrganization) {
    throw new Error(
      "Workspace was created, but its organization ID is missing."
    );
  }

  return normalizedOrganization;
};

// =====================================================
// GET MY ORGANIZATIONS
// GET /api/organizations
// Returns a normalized array
// =====================================================

export const getMyOrganizations = async () => {
  const response = await api.get("/organizations");

  const result = response.data;

  console.log(
    "ServiceOS organization API response:",
    result
  );

  let businesses = [];

  if (Array.isArray(result)) {
    businesses = result;
  } else if (Array.isArray(result?.businesses)) {
    businesses = result.businesses;
  } else if (Array.isArray(result?.organizations)) {
    businesses = result.organizations;
  } else if (Array.isArray(result?.data?.businesses)) {
    businesses = result.data.businesses;
  } else if (Array.isArray(result?.data?.organizations)) {
    businesses = result.data.organizations;
  } else if (Array.isArray(result?.data)) {
    businesses = result.data;
  }

  const normalizedBusinesses = businesses
    .map((business) => normalizeOrganization(business))
    .filter(Boolean);

  console.log(
    "ServiceOS normalized businesses:",
    normalizedBusinesses
  );

  return normalizedBusinesses;
};

// =====================================================
// GET SINGLE ORGANIZATION
// GET /api/organizations/:organizationId
// =====================================================

export const getOrganization = async (organizationId) => {
  if (!organizationId) {
    throw new Error("Organization ID is required.");
  }

  const response = await api.get(
    `/organizations/${organizationId}`
  );

  return response.data;
};

// =====================================================
// GET ORGANIZATION CONTEXT
// GET /api/organizations/:organizationId/context
// =====================================================

export const getOrganizationContext = async (
  organizationId
) => {
  if (!organizationId) {
    throw new Error("Organization ID is required.");
  }

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

// =====================================================
// UPDATE BUSINESS
// PUT /api/organizations/:organizationId
// =====================================================

export const updateBusiness = async (
  organizationId,
  businessData = {}
) => {
  if (!organizationId) {
    throw new Error("Organization ID is required.");
  }

  const response = await api.put(
    `/organizations/${organizationId}`,
    businessData,
    {
      headers: {
        "x-organization-id": organizationId,
      },
    }
  );

  return response.data?.data?.organization ||
    response.data?.organization ||
    response.data;
};

// =====================================================
// DEACTIVATE BUSINESS
// PATCH /api/organizations/:organizationId/deactivate
// =====================================================

export const deactivateBusiness = async (organizationId) => {
  if (!organizationId) {
    throw new Error("Organization ID is required.");
  }

  const response = await api.patch(
    `/organizations/${organizationId}/deactivate`,
    {},
    {
      headers: {
        "x-organization-id": organizationId,
      },
    }
  );

  return response.data?.data?.organization ||
    response.data?.organization ||
    response.data;
};
