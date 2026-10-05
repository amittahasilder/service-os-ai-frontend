// =========================================================
// SERVICEOS ORGANIZATION HELPERS
// =========================================================

export const getOrganizationId = (organization) => {
  if (!organization) {
    return null;
  }

  // Already a string ID
  if (typeof organization === "string") {
    return organization;
  }

  // Standard MongoDB organization object
  if (typeof organization._id === "string") {
    return organization._id;
  }

  // MongoDB Extended JSON
  if (organization?._id?.$oid) {
    return String(organization._id.$oid);
  }

  // Fallback for normal `id`
  if (organization?.id) {
    return String(organization.id);
  }

  return null;
};

// =========================================================
// VALIDATE ORGANIZATION ID
// =========================================================

export const isValidOrganizationId = (
 organizationId
) => {
  if (!organizationId) {
    return false;
  }

  return /^[a-fA-F0-9]{24}$/.test(
    String(organizationId)
  );
};

// =========================================================
// REQUIRE ORGANIZATION ID
// =========================================================

export const requireOrganizationId = (
  organization
) => {
  const organizationId =
    getOrganizationId(organization);

  if (!isValidOrganizationId(organizationId)) {
    throw new Error(
      "Invalid organization ID."
    );
  }

  return organizationId;
};