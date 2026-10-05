import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getMyOrganizations,
} from "../api/organizationApi";

import { useAuth } from "./AuthContext";

// =========================================================
// CONTEXT
// =========================================================

const OrganizationContext =
  createContext(null);

const STORAGE_KEY =
  "serviceos_current_organization";

// =========================================================
// OBJECT ID VALIDATOR
// =========================================================

const isValidObjectId = (value) => {
  if (!value) {
    return false;
  }

  const id = String(value).trim();

  return /^[a-fA-F0-9]{24}$/.test(id);
};

// =========================================================
// GET ORGANIZATION ID
// =========================================================

const getOrganizationId = (
  organization
) => {
  if (!organization) {
    return null;
  }

  /*
   * Support possible backend structures:
   *
   * {
   *   _id: "..."
   * }
   *
   * {
   *   id: "..."
   * }
   *
   * {
   *   organizationId: "..."
   * }
   *
   * {
   *   organization: {
   *     _id: "..."
   *   }
   * }
   *
   * {
   *   business: {
   *     _id: "..."
   *   }
   * }
   */

  const possibleIds = [
    organization?._id,

    organization?.id,

    organization?.organizationId,

    organization?.organization?._id,

    organization?.organization?.id,

    organization?.business?._id,

    organization?.business?.id,

    organization?.business?.organizationId,
  ];

  for (const value of possibleIds) {
    if (
      isValidObjectId(value)
    ) {
      return String(value).trim();
    }
  }

  return null;
};

// =========================================================
// NORMALIZE ORGANIZATION
// =========================================================

const normalizeOrganization = (
  organization
) => {
  if (!organization) {
    return null;
  }

  const organizationId =
    getOrganizationId(
      organization
    );

  if (!organizationId) {
    console.warn(
      "ServiceOS: Could not find valid organization ID:",
      organization
    );

    return null;
  }

  /*
   * Keep original organization data,
   * but force _id to be the real MongoDB ID.
   */

  return {
    ...organization,

    _id: organizationId,
  };
};

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
      // WAIT FOR AUTH
      // ---------------------------------------------------

      if (authLoading) {
        return;
      }

      // ---------------------------------------------------
      // NOT AUTHENTICATED
      // ---------------------------------------------------

      if (!isAuthenticated) {
        setOrganizations([]);
        setCurrentOrganization(null);
        setError("");
        setLoading(false);

        localStorage.removeItem(
          STORAGE_KEY
        );

        return;
      }

      // ---------------------------------------------------
      // LOAD
      // ---------------------------------------------------

      try {
        setLoading(true);
        setError("");

        const response =
          await getMyOrganizations();

        console.log(
          "========================================"
        );

        console.log(
          "SERVICEOS ORGANIZATION RESPONSE:"
        );

        console.log(
          response
        );

        console.log(
          "========================================"
        );

        // =================================================
        // EXTRACT ORGANIZATION LIST
        // =================================================

        let organizationList = [];

        // -----------------------------------------------
        // response = [...]
        // -----------------------------------------------

        if (
          Array.isArray(response)
        ) {
          organizationList =
            response;
        }

        // -----------------------------------------------
        // response.businesses
        // -----------------------------------------------

        else if (
          Array.isArray(
            response?.businesses
          )
        ) {
          organizationList =
            response.businesses;
        }

        // -----------------------------------------------
        // response.organizations
        // -----------------------------------------------

        else if (
          Array.isArray(
            response?.organizations
          )
        ) {
          organizationList =
            response.organizations;
        }

        // -----------------------------------------------
        // response.data.businesses
        // -----------------------------------------------

        else if (
          Array.isArray(
            response?.data?.businesses
          )
        ) {
          organizationList =
            response.data.businesses;
        }

        // -----------------------------------------------
        // response.data.organizations
        // -----------------------------------------------

        else if (
          Array.isArray(
            response?.data?.organizations
          )
        ) {
          organizationList =
            response.data.organizations;
        }

        // -----------------------------------------------
        // response.data
        // -----------------------------------------------

        else if (
          Array.isArray(
            response?.data
          )
        ) {
          organizationList =
            response.data;
        }

        // =================================================
        // RAW LIST DEBUG
        // =================================================

        console.log(
          "SERVICEOS RAW ORGANIZATION LIST:",
          organizationList
        );

        // =================================================
        // NORMALIZE
        // =================================================

        const normalizedOrganizations =
          organizationList
            .map(
              normalizeOrganization
            )
            .filter(Boolean);

        // =================================================
        // NORMALIZED DEBUG
        // =================================================

        console.log(
          "SERVICEOS NORMALIZED ORGANIZATIONS:",
          normalizedOrganizations
        );

        console.log(
          "SERVICEOS ORGANIZATION COUNT:",
          normalizedOrganizations.length
        );

        // =================================================
        // SAVE ORGANIZATIONS
        // =================================================

        setOrganizations(
          normalizedOrganizations
        );

        // =================================================
        // NO ORGANIZATION
        // =================================================

        if (
          normalizedOrganizations.length ===
          0
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

        // =================================================
        // SAVED ORGANIZATION ID
        // =================================================

        const savedOrganizationId =
          localStorage.getItem(
            STORAGE_KEY
          );

        console.log(
          "SERVICEOS SAVED ORGANIZATION ID:",
          savedOrganizationId
        );

        // =================================================
        // FIND SAVED ORGANIZATION
        // =================================================

        let selectedOrganization =
          normalizedOrganizations.find(
            (organization) =>
              String(
                organization._id
              ) ===
              String(
                savedOrganizationId
              )
          );

        // =================================================
        // FALLBACK
        // =================================================

        if (!selectedOrganization) {
          selectedOrganization =
            normalizedOrganizations[0];
        }

        // =================================================
        // FINAL VALIDATION
        // =================================================

        const finalOrganizationId =
          getOrganizationId(
            selectedOrganization
          );

        if (
          !finalOrganizationId
        ) {
          throw new Error(
            "Selected organization has an invalid ID."
          );
        }

        // =================================================
        // FINAL ORGANIZATION
        // =================================================

        const finalOrganization = {
          ...selectedOrganization,

          _id: finalOrganizationId,
        };

        // =================================================
        // SET CURRENT
        // =================================================

        setCurrentOrganization(
          finalOrganization
        );

        // =================================================
        // SAVE ONLY ID
        // =================================================

        localStorage.setItem(
          STORAGE_KEY,
          finalOrganizationId
        );

        // =================================================
        // FINAL DEBUG
        // =================================================

        console.log(
          "========================================"
        );

        console.log(
          "SERVICEOS CURRENT ORGANIZATION:"
        );

        console.log(
          finalOrganization
        );

        console.log(
          "SERVICEOS CURRENT ORGANIZATION ID:",
          finalOrganizationId
        );

        console.log(
          "SERVICEOS ID TYPE:",
          typeof finalOrganizationId
        );

        console.log(
          "SERVICEOS ID VALID:",
          isValidObjectId(
            finalOrganizationId
          )
        );

        console.log(
          "========================================"
        );
      } catch (err) {
        console.error(
          "Organization loading error:",
          err
        );

        setOrganizations([]);
        setCurrentOrganization(null);

        localStorage.removeItem(
          STORAGE_KEY
        );

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

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    loadOrganizations();
  }, [loadOrganizations]);

  // =========================================================
  // STORAGE SYNC
  // =========================================================

  useEffect(() => {
    const organizationId =
      getOrganizationId(
        currentOrganization
      );

    if (organizationId) {
      localStorage.setItem(
        STORAGE_KEY,
        organizationId
      );
    }
  }, [
    currentOrganization,
  ]);

  // =========================================================
  // SWITCH ORGANIZATION
  // =========================================================

  const switchOrganization =
    useCallback(
      (organization) => {
        const normalized =
          normalizeOrganization(
            organization
          );

        if (!normalized) {
          console.warn(
            "ServiceOS: Invalid organization selected:",
            organization
          );

          return;
        }

        setCurrentOrganization(
          normalized
        );

        localStorage.setItem(
          STORAGE_KEY,
          normalized._id
        );

        setError("");

        console.log(
          "ServiceOS switched organization:",
          normalized
        );
      },
      []
    );

  // =========================================================
  // CLEAR ORGANIZATION
  // =========================================================

  const clearOrganization =
    useCallback(() => {
      setCurrentOrganization(null);

      localStorage.removeItem(
        STORAGE_KEY
      );
    }, []);

  // =========================================================
  // REFRESH
  // =========================================================

  const refreshOrganizations =
    useCallback(async () => {
      await loadOrganizations();
    }, [
      loadOrganizations,
    ]);

  // =========================================================
  // PROVIDER
  // =========================================================

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
// HOOK
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