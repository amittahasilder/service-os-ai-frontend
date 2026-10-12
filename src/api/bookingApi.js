
import api from "./api";

// =====================================
// GET ALL BOOKINGS
// =====================================

export const getBookings = async ({
  organizationId,
  search = "",
  status = "",
  customer = "",
  staff = "",
  service = "",
  date = "",
} = {}) => {
  if (!organizationId) {
    throw new Error("Organization ID is required");
  }

  const params = {};

  if (search.trim()) params.search = search.trim();
  if (status) params.status = status;
  if (customer) params.customer = customer;
  if (staff) params.staff = staff;
  if (service) params.service = service;
  if (date) params.date = date;

  const response = await api.get(
    `/organizations/${organizationId}/bookings`,
    { params }
  );

  return response.data;
};

// =====================================
// GET BOOKING STATISTICS
// =====================================

export const getBookingStats = async (organizationId) => {
  if (!organizationId) {
    throw new Error("Organization ID is required");
  }

  const response = await api.get(
    `/organizations/${organizationId}/bookings/stats`
  );

  return response.data;
};

// =====================================
// GET SINGLE BOOKING
// =====================================

export const getBookingById = async ({
  organizationId,
  bookingId,
}) => {
  if (!organizationId) {
    throw new Error("Organization ID is required");
  }

  if (!bookingId) {
    throw new Error("Booking ID is required");
  }

  const response = await api.get(
    `/organizations/${organizationId}/bookings/${bookingId}`
  );

  return response.data;
};

// =====================================
// CREATE BOOKING
// =====================================

export const createBooking = async ({
  organizationId,
  bookingData,
}) => {
  if (!organizationId) {
    throw new Error("Organization ID is required");
  }

  if (!bookingData || typeof bookingData !== "object") {
    throw new Error("Booking data is required");
  }

  const response = await api.post(
    `/organizations/${organizationId}/bookings`,
    bookingData
  );

  return response.data;
};

// =====================================
// UPDATE BOOKING
// =====================================

export const updateBooking = async ({
  organizationId,
  bookingId,
  bookingData,
}) => {
  if (!organizationId || !bookingId) {
    throw new Error(
      "Organization ID and Booking ID are required"
    );
  }

  if (!bookingData || typeof bookingData !== "object") {
    throw new Error("Booking data is required");
  }

  const response = await api.put(
    `/organizations/${organizationId}/bookings/${bookingId}`,
    bookingData
  );

  return response.data;
};

// =====================================
// CANCEL BOOKING
// =====================================

export const cancelBooking = async ({
  organizationId,
  bookingId,
}) => {
  if (!organizationId || !bookingId) {
    throw new Error(
      "Organization ID and Booking ID are required"
    );
  }

  const response = await api.delete(
    `/organizations/${organizationId}/bookings/${bookingId}`
  );

  return response.data;
};
