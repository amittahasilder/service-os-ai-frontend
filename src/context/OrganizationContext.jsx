import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { getMyOrganizations } from "../api/organizationApi";
import { useAuth } from "./AuthContext";

// =========================================================
// CONTEXT
// =========================================================

const OrganizationContext = createContext(null);

const STORAGE_KEY =
  "serviceos_current_organization";

// =========================================================
// PROVIDER
// =========================================================

export const OrganizationProvider = ({
  children,
}) => {
  const {
    isAuthenticated,
    loading: authLoading,
  } = useAuth();

  // =======================================================
  // STATE
  // =======================================================

  const [organizations, setOrganizations] =
    useState([]);

  const [
    currentOrganization,
    setCurrentOrganization,
  ] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =======================================================
  // LOAD ORGANIZATIONS
  // =======================================================

  const loadOrganizations =
    useCallback(async () => {
      // ---------------------------------------------------
      // Wait until authentication is ready
      // ---------------------------------------------------

      if (authLoading) {
        return;
      }

      // ---------------------------------------------------
      // User is not authenticated
      // ---------------------------------------------------

      if (!isAuthenticated) {
        setOrganizations([]);
        setCurrentOrganization(null);
        setError("");
        setLoading(false);

        return;
      }

      // ---------------------------------------------------
      // Load organizations
      // ---------------------------------------------------

      try {
        setLoading(true);
        setError("");

        const response =
          await getMyOrganizations();

        console.log(
          "ServiceOS organizations response:",
          response
        );

        // -------------------------------------------------
        // Normalize backend response
        // -------------------------------------------------

        const organizationList =
          response?.organizations ||
          response?.data?.organizations ||
          response?.data ||
          (Array.isArray(response)
            ? response
            : []);

        const normalizedOrganizations =
          Array.isArray(organizationList)
            ? organizationList
            : [];

        setOrganizations(
          normalizedOrganizations
        );

        // -------------------------------------------------
        // No organization
        // -------------------------------------------------

        if (
          normalizedOrganizations.length === 0
        ) {
          setCurrentOrganization(null);

          localStorage.removeItem(
            STORAGE_KEY
          );

          setError(
            "No organization found. Please create a business first."
          );

          return;
        }

        // -------------------------------------------------
        // Restore saved organization
        // -------------------------------------------------

        const savedOrganizationId =
          localStorage.getItem(
            STORAGE_KEY
          );

        const savedOrganization =
          normalizedOrganizations.find(
            (organization) =>
              String(organization?._id) ===
              String(savedOrganizationId)
          );

        // -------------------------------------------------
        // Saved organization exists
        // -------------------------------------------------

        if (savedOrganization) {
          setCurrentOrganization(
            savedOrganization
          );

          return;
        }

        // -------------------------------------------------
        // Select first organization
        // -------------------------------------------------

        const firstOrganization =
          normalizedOrganizations[0];

        setCurrentOrganization(
          firstOrganization
        );

        localStorage.setItem(
          STORAGE_KEY,
          firstOrganization._id
        );
      } catch (err) {
        console.error(
          "Organization loading error:",
          err
        );

        setOrganizations([]);
        setCurrentOrganization(null);

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load organizations."
        );
      } finally {
        setLoading(false);
      }
    }, [
      authLoading,
      isAuthenticated,
    ]);

  // =======================================================
  // INITIAL LOAD
  // =======================================================

  useEffect(() => {
    loadOrganizations();
  }, [loadOrganizations]);

  // =======================================================
  // SWITCH ORGANIZATION
  // =======================================================

  const switchOrganization = (
    organization
  ) => {
    if (!organization?._id) {
      return;
    }

    setCurrentOrganization(
      organization
    );

    localStorage.setItem(
      STORAGE_KEY,
      organization._id
    );
  };

  // =======================================================
  // CLEAR ORGANIZATION
  // =======================================================

  const clearOrganization = () => {
    setCurrentOrganization(null);

    localStorage.removeItem(
      STORAGE_KEY
    );
  };

  // =======================================================
  // REFRESH ORGANIZATIONS
  // =======================================================

  const refreshOrganizations =
    async () => {
      await loadOrganizations();
    };

  // =======================================================
  // PROVIDER
  // =======================================================

  return (
    <OrganizationContext.Provider
      value={{
        organizations,
        currentOrganization,
        switchOrganization,
        clearOrganization,
        refreshOrganizations,
        loading,
        error,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};

// =========================================================
// CUSTOM HOOK
// =========================================================

export const useOrganization = () => {
  const context =
    useContext(
      OrganizationContext
    );

  if (!context) {
    throw new Error(
      "useOrganization must be used inside OrganizationProvider"
    );
  }

  return context;
};