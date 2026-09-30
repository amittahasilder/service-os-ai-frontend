import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { getMyOrganizations } from "../api/organizationApi";

const OrganizationContext = createContext(null);

const STORAGE_KEY = "serviceos_current_organization";

export const OrganizationProvider = ({ children }) => {
  const [organizations, setOrganizations] = useState([]);
  const [currentOrganization, setCurrentOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD ORGANIZATIONS
  // =====================================================

  const loadOrganizations = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyOrganizations();

      // Support common backend response shapes
      const organizationList =
        data?.organizations ||
        data?.data ||
        (Array.isArray(data) ? data : []);

      setOrganizations(organizationList);

      // ================================================
      // RESTORE PREVIOUS ORGANIZATION
      // ================================================

      const savedOrganizationId = localStorage.getItem(
        STORAGE_KEY
      );

      const savedOrganization = organizationList.find(
        (organization) =>
          String(organization._id) ===
          String(savedOrganizationId)
      );

      if (savedOrganization) {
        setCurrentOrganization(savedOrganization);
      } else if (organizationList.length > 0) {
        setCurrentOrganization(organizationList[0]);

        localStorage.setItem(
          STORAGE_KEY,
          organizationList[0]._id
        );
      } else {
        setCurrentOrganization(null);
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (err) {
      console.error(
        "Organization loading error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to load organizations."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadOrganizations();
  }, []);

  // =====================================================
  // SWITCH ORGANIZATION
  // =====================================================

  const switchOrganization = (organization) => {
    if (!organization?._id) return;

    setCurrentOrganization(organization);

    localStorage.setItem(
      STORAGE_KEY,
      organization._id
    );
  };

  // =====================================================
  // CLEAR ORGANIZATION
  // =====================================================

  const clearOrganization = () => {
    setCurrentOrganization(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  // =====================================================
  // REFRESH ORGANIZATIONS
  // =====================================================

  const refreshOrganizations = async () => {
    await loadOrganizations();
  };

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

// =======================================================
// CUSTOM HOOK
// =======================================================

export const useOrganization = () => {
  const context = useContext(OrganizationContext);

  if (!context) {
    throw new Error(
      "useOrganization must be used inside OrganizationProvider"
    );
  }

  return context;
};