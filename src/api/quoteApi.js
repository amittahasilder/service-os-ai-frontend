
import api from "./api";

// =====================================
// QUOTE API
// =====================================

const requireOrganizationId = (organizationId) => {
  if (!organizationId) {
    throw new Error("Organization ID is required");
  }

  return organizationId;
};

// =====================================
// GET ALL QUOTES
// GET /:organizationId/quotes
// =====================================

export const getQuotes = async ({
  organizationId,
  search = "",
  status = "",
  customer = "",
} = {}) => {
  requireOrganizationId(organizationId);

  const params = {};

  if (search.trim()) {
    params.search = search.trim();
  }

  if (status) {
    params.status = status;
  }

  if (customer) {
    params.customer = customer;
  }

  return api.get(`/${organizationId}/quotes`, {
    params,
  });
};

// =====================================
// GET QUOTE STATS
// GET /:organizationId/quotes/stats
// =====================================

export const getQuoteStats = async ({
  organizationId,
} = {}) => {
  requireOrganizationId(organizationId);

  return api.get(`/${organizationId}/quotes/stats`);
};

// =====================================
// GET SINGLE QUOTE
// GET /:organizationId/quotes/:quoteId
// =====================================

export const getQuoteById = async ({
  organizationId,
  quoteId,
}) => {
  requireOrganizationId(organizationId);

  if (!quoteId) {
    throw new Error("Quote ID is required");
  }

  return api.get(
    `/${organizationId}/quotes/${quoteId}`
  );
};

// =====================================
// CREATE QUOTE
// POST /:organizationId/quotes
// =====================================

export const createQuote = async ({
  organizationId,
  quoteData,
}) => {
  requireOrganizationId(organizationId);

  if (!quoteData) {
    throw new Error("Quote data is required");
  }

  return api.post(
    `/${organizationId}/quotes`,
    quoteData
  );
};

// =====================================
// UPDATE QUOTE
// PUT /:organizationId/quotes/:quoteId
// =====================================

export const updateQuote = async ({
  organizationId,
  quoteId,
  quoteData,
}) => {
  requireOrganizationId(organizationId);

  if (!quoteId) {
    throw new Error("Quote ID is required");
  }

  if (!quoteData) {
    throw new Error("Quote data is required");
  }

  return api.put(
    `/${organizationId}/quotes/${quoteId}`,
    quoteData
  );
};

// =====================================
// DELETE / ARCHIVE QUOTE
// DELETE /:organizationId/quotes/:quoteId
// =====================================

export const deleteQuote = async ({
  organizationId,
  quoteId,
}) => {
  requireOrganizationId(organizationId);

  if (!quoteId) {
    throw new Error("Quote ID is required");
  }

  return api.delete(
    `/${organizationId}/quotes/${quoteId}`
  );
};
