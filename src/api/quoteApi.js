

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

const getQuoteBaseUrl = (organizationId) => {
  requireOrganizationId(organizationId);

  return `/organizations/${organizationId}/quotes`;
};

// =====================================
// GET ALL QUOTES
// GET /api/organizations/:organizationId/quotes
// =====================================

export const getQuotes = async ({
  organizationId,
  search = "",
  status = "",
  customer = "",
} = {}) => {
  const baseUrl = getQuoteBaseUrl(organizationId);

  const params = {};

  if (search.trim()) params.search = search.trim();
  if (status) params.status = status;
  if (customer) params.customer = customer;

  return api.get(baseUrl, { params });
};

// =====================================
// GET QUOTE STATS
// GET /api/organizations/:organizationId/quotes/stats
// =====================================

export const getQuoteStats = async ({
  organizationId,
} = {}) => {
  const baseUrl = getQuoteBaseUrl(organizationId);

  return api.get(`${baseUrl}/stats`);
};

// =====================================
// GET SINGLE QUOTE
// =====================================

export const getQuoteById = async ({
  organizationId,
  quoteId,
}) => {
  const baseUrl = getQuoteBaseUrl(organizationId);

  if (!quoteId) {
    throw new Error("Quote ID is required");
  }

  return api.get(`${baseUrl}/${quoteId}`);
};

// =====================================
// CREATE QUOTE
// =====================================

export const createQuote = async ({
  organizationId,
  quoteData,
}) => {
  const baseUrl = getQuoteBaseUrl(organizationId);

  if (!quoteData) {
    throw new Error("Quote data is required");
  }

  return api.post(baseUrl, quoteData);
};

// =====================================
// UPDATE QUOTE
// =====================================

export const updateQuote = async ({
  organizationId,
  quoteId,
  quoteData,
}) => {
  const baseUrl = getQuoteBaseUrl(organizationId);

  if (!quoteId) {
    throw new Error("Quote ID is required");
  }

  if (!quoteData) {
    throw new Error("Quote data is required");
  }

  return api.put(`${baseUrl}/${quoteId}`, quoteData);
};

// =====================================
// DELETE / CANCEL QUOTE
// =====================================

export const deleteQuote = async ({
  organizationId,
  quoteId,
}) => {
  const baseUrl = getQuoteBaseUrl(organizationId);

  if (!quoteId) {
    throw new Error("Quote ID is required");
  }

  return api.delete(`${baseUrl}/${quoteId}`);
};

