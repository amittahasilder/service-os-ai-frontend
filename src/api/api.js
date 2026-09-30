import axios from "axios";

// =====================================================
// SERVICEOS API CLIENT
// =====================================================

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// =====================================================
// ORGANIZATION / TENANT INTERCEPTOR
// =====================================================

api.interceptors.request.use(
  (config) => {
    const organizationId = localStorage.getItem(
      "serviceos_current_organization"
    );

    if (organizationId) {
      config.headers["x-organization-id"] =
        organizationId;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// =====================================================
// RESPONSE INTERCEPTOR
// =====================================================

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Authentication expired / unauthorized
    if (error?.response?.status === 401) {
      console.warn(
        "ServiceOS: Authentication required."
      );
    }

    return Promise.reject(error);
  }
);

export default api;