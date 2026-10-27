
import api from "./api";

// =====================================
// DASHBOARD API
// =====================================

export const getDashboardSummary = async () => {
  const response = await api.get("/dashboard/summary");

  return response.data;
};
