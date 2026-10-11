import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  Search,
  Plus,
  Users,
  UserCheck,
  UserX,
  Wallet,
  RefreshCw,
  MoreHorizontal,
  Eye,
  Pencil,
  Archive,
  Filter,
  ChevronDown,
  Mail,
  Phone,
  Building2,
  X,
  Save,
  UserPlus,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileText,
} from "lucide-react";

import {
  getCustomers,
  getCustomerStats,
  createCustomer,
  updateCustomer,
  archiveCustomer,
} from "../api/customerApi";

import {
  useOrganization,
} from "../context/OrganizationContext";

// =========================================================
// CUSTOMERS PAGE
// =========================================================

const Customers = () => {
  // =====================================================
  // ORGANIZATION
  // =====================================================

  const {
    currentOrganization,
    loading: organizationLoading,
  } = useOrganization();

  const organizationId =
    currentOrganization?._id
      ? String(
          currentOrganization._id
        ).trim()
      : "";

  // =====================================================
  // CUSTOMER STATE
  // =====================================================

  const [customers, setCustomers] =
    useState([]);

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    totalSpent: 0,
  });

  const [loading, setLoading] =
    useState(true);

  const [statsLoading, setStatsLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  // =====================================================
  // FILTER STATE
  // =====================================================

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [source, setSource] =
    useState("");

  const [showFilters, setShowFilters] =
    useState(false);

  const [refreshing, setRefreshing] =
    useState(false);

  // =====================================================
  // MODAL STATE
  // =====================================================

  const [
    selectedCustomer,
    setSelectedCustomer,
  ] = useState(null);

  const [showAddModal, setShowAddModal] =
    useState(false);

  const [
    editingCustomer,
    setEditingCustomer,
  ] = useState(null);

  // =====================================================
  // LOAD CUSTOMERS
  // =====================================================

  const loadCustomers = useCallback(
    async () => {
      if (
        organizationLoading ||
        !organizationId
      ) {
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response =
          await getCustomers({
            organizationId,
            status,
            source,
            search,
          });

        console.log(
          "ServiceOS customers response:",
          response
        );

        const customerList =
          Array.isArray(response)
            ? response
            : Array.isArray(
                response?.customers
              )
            ? response.customers
            : Array.isArray(
                response?.data?.customers
              )
            ? response.data.customers
            : Array.isArray(
                response?.data
              )
            ? response.data
            : [];

        setCustomers(customerList);
      } catch (err) {
        console.error(
          "Load customers error:",
          err
        );

        setCustomers([]);

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load customers."
        );
      } finally {
        setLoading(false);
      }
    },
    [
      organizationId,
      organizationLoading,
      status,
      source,
      search,
    ]
  );

  // =====================================================
  // LOAD STATS
  // =====================================================

  const loadStats = useCallback(
    async () => {
      if (
        organizationLoading ||
        !organizationId
      ) {
        return;
      }

      try {
        setStatsLoading(true);

        const response =
          await getCustomerStats(
            organizationId
          );

        console.log(
          "ServiceOS customer stats:",
          response
        );

        const statsData =
          response?.stats ||
          response?.data?.stats ||
          response?.data ||
          response;

        setStats({
          total: Number(
            statsData?.total ??
              statsData?.totalCustomers ??
              0
          ),

          active: Number(
            statsData?.active ??
              statsData?.activeCustomers ??
              0
          ),

          inactive: Number(
            statsData?.inactive ??
              statsData?.inactiveCustomers ??
              0
          ),

          totalSpent: Number(
            statsData?.totalSpent ?? 0
          ),
        });
      } catch (err) {
        console.error(
          "Load customer stats error:",
          err
        );

        setStats({
          total: 0,
          active: 0,
          inactive: 0,
          totalSpent: 0,
        });
      } finally {
        setStatsLoading(false);
      }
    },
    [
      organizationId,
      organizationLoading,
    ]
  );

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // =====================================================
  // AUTO CLEAR SUCCESS
  // =====================================================

  useEffect(() => {
    if (!successMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setSuccessMessage("");
    }, 3500);

    return () =>
      clearTimeout(timer);
  }, [successMessage]);

  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh = async () => {
    if (
      refreshing ||
      !organizationId
    ) {
      return;
    }

    try {
      setRefreshing(true);

      await Promise.all([
        loadCustomers(),
        loadStats(),
      ]);
    } finally {
      setRefreshing(false);
    }
  };

  // =====================================================
  // CREATE CUSTOMER
  // =====================================================

  const handleCreateCustomer =
    async (formData) => {
      if (!organizationId) {
        return;
      }

      try {
        setError("");

        // IMPORTANT:
        // customerApi.js expects customerData
        await createCustomer({
          organizationId,
          customerData: formData,
        });

        setShowAddModal(false);

        setSuccessMessage(
          "Customer created successfully."
        );

        await Promise.all([
          loadCustomers(),
          loadStats(),
        ]);
      } catch (err) {
        console.error(
          "Create customer error:",
          err
        );

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to create customer."
        );

        throw err;
      }
    };

  // =====================================================
  // UPDATE CUSTOMER
  // =====================================================

  const handleUpdateCustomer =
    async (
      customerId,
      formData
    ) => {
      if (
        !organizationId ||
        !customerId
      ) {
        return;
      }

      try {
        setError("");

        // IMPORTANT:
        // customerApi.js expects customerData
        await updateCustomer({
          organizationId,
          customerId,
          customerData: formData,
        });

        setEditingCustomer(null);
        setSelectedCustomer(null);

        setSuccessMessage(
          "Customer updated successfully."
        );

        await Promise.all([
          loadCustomers(),
          loadStats(),
        ]);
      } catch (err) {
        console.error(
          "Update customer error:",
          err
        );

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to update customer."
        );

        throw err;
      }
    };

  // =====================================================
  // ARCHIVE CUSTOMER
  // =====================================================

  const handleArchive = async (
    customer
  ) => {
    if (
      !customer?._id ||
      !organizationId
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        `Archive ${getCustomerName(
          customer
        )}?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await archiveCustomer({
        organizationId,
        customerId: customer._id,
      });

      setCustomers(
        (previous) =>
          previous.filter(
            (item) =>
              item._id !==
              customer._id
          )
      );

      setSuccessMessage(
        "Customer archived successfully."
      );

      await loadStats();
    } catch (err) {
      console.error(
        "Archive customer error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to archive customer."
      );
    }
  };

  // =====================================================
  // VISIBLE CUSTOMERS
  // =====================================================

  const visibleCustomers =
    useMemo(() => {
      return customers;
    }, [customers]);

  // =====================================================
  // NO ORGANIZATION
  // =====================================================

  if (
    !organizationLoading &&
    !organizationId
  ) {
    return (
      <div className="min-h-screen bg-[#050507] px-6 py-10 text-white">
        <div className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center">
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025] p-10 text-center shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
          >
            <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" />

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10">
              <Building2 className="h-7 w-7 text-violet-300" />
            </div>

            <h2 className="mt-6 text-xl font-bold text-white">
              Select a business
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/40">
              Please select an organization
              before managing your
              customers.
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  // =====================================================
  // MAIN
  // =====================================================

  return (
    <div className="min-h-screen bg-[#050507] px-4 py-5 text-white sm:px-6 lg:px-8">
      {/* AMBIENT BACKGROUND */}

      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-violet-600/[0.07] blur-[120px]" />

        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-cyan-500/[0.045] blur-[120px]" />

        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-purple-600/[0.05] blur-[110px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px]">
        {/* HEADER */}

        <motion.div
          initial={{
            opacity: 0,
            y: -15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.35,
          }}
          className="mb-7 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between"
        >
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_12px_rgba(167,139,250,0.8)]" />

              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-violet-300/70">
                CRM
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Customers
            </h1>

            <p className="mt-1.5 max-w-xl text-sm text-white/40">
              Manage your customers,
              relationships and business
              history from one place.
            </p>
          </div>

          {/* ACTIONS */}

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={
                refreshing ||
                loading ||
                statsLoading
              }
              className="group flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.035] px-3.5 py-2.5 text-sm font-medium text-white/60 backdrop-blur-xl transition hover:border-white/[0.14] hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <RefreshCw
                className={`h-4 w-4 transition ${
                  refreshing
                    ? "animate-spin"
                    : "group-hover:rotate-90"
                }`}
              />

              Refresh
            </button>

            <button
              type="button"
              onClick={() => {
                setError("");
                setShowAddModal(true);
              }}
              className="group flex items-center gap-2 rounded-xl border border-violet-400/25 bg-gradient-to-r from-violet-600/90 to-purple-600/90 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_35px_rgba(124,58,237,0.2)] transition hover:from-violet-500 hover:to-purple-500 hover:shadow-[0_12px_40px_rgba(124,58,237,0.3)]"
            >
              <Plus className="h-4 w-4 transition group-hover:rotate-90" />

              Add Customer
            </button>
          </div>
        </motion.div>

        {/* SUCCESS MESSAGE */}

        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{
                opacity: 0,
                y: -10,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: -10,
                scale: 0.98,
              }}
              className="mb-5 flex items-center gap-3 rounded-2xl border border-emerald-400/15 bg-emerald-500/[0.07] px-4 py-3 text-sm text-emerald-300"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0" />

              <span>
                {successMessage}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* STATS */}

        <div className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Customers"
            value={stats.total}
            icon={Users}
            loading={statsLoading}
            description="All customer records"
          />

          <StatCard
            title="Active"
            value={stats.active}
            icon={UserCheck}
            loading={statsLoading}
            description="Currently active"
          />

          <StatCard
            title="Inactive"
            value={stats.inactive}
            icon={UserX}
            loading={statsLoading}
            description="Inactive customers"
          />

          <StatCard
            title="Total Spent"
            value={formatCurrency(
              stats.totalSpent
            )}
            icon={Wallet}
            loading={statsLoading}
            description="Customer lifetime value"
          />
        </div>

        {/* MAIN PANEL */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.4,
            delay: 0.1,
          }}
          className="overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025] shadow-[0_25px_90px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
        >
          {/* TOOLBAR */}

          <div className="border-b border-white/[0.07] p-4 sm:p-5">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="relative w-full xl:max-w-md">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search customers..."
                  className="w-full rounded-xl border border-white/[0.08] bg-black/20 py-2.5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-white/25 transition focus:border-violet-400/30 focus:bg-white/[0.04] focus:ring-2 focus:ring-violet-500/10"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setShowFilters(
                      (previous) =>
                        !previous
                    )
                  }
                  className={`flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-medium transition ${
                    showFilters ||
                    status ||
                    source
                      ? "border-violet-400/25 bg-violet-500/10 text-violet-200"
                      : "border-white/[0.08] bg-white/[0.025] text-white/55 hover:border-white/[0.14] hover:bg-white/[0.05] hover:text-white"
                  }`}
                >
                  <Filter className="h-4 w-4" />

                  Filters

                  <ChevronDown
                    className={`h-3.5 w-3.5 transition ${
                      showFilters
                        ? "rotate-180"
                        : ""
                    }`}
                  />
                </button>

                {(status || source) && (
                  <button
                    type="button"
                    onClick={() => {
                      setStatus("");
                      setSource("");
                    }}
                    className="rounded-xl border border-red-400/15 bg-red-500/[0.06] px-3 py-2.5 text-xs font-semibold text-red-300 transition hover:bg-red-500/10"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>

            {/* FILTER ROW */}

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{
                    opacity: 0,
                    height: 0,
                  }}
                  animate={{
                    opacity: 1,
                    height: "auto",
                  }}
                  exit={{
                    opacity: 0,
                    height: 0,
                  }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 flex flex-col gap-3 border-t border-white/[0.06] pt-4 sm:flex-row">
                    <div className="relative w-full sm:w-52">
                      <select
                        value={status}
                        onChange={(event) =>
                          setStatus(
                            event.target.value
                          )
                        }
                        className="w-full appearance-none rounded-xl border border-white/[0.08] bg-white/[0.025] px-3.5 py-2.5 pr-10 text-sm text-white outline-none transition focus:border-violet-400/30 focus:ring-2 focus:ring-violet-500/10"
                      >
                        <option
                          value=""
                          className="bg-[#111118]"
                        >
                          All Statuses
                        </option>

                        <option
                          value="active"
                          className="bg-[#111118]"
                        >
                          Active
                        </option>

                        <option
                          value="inactive"
                          className="bg-[#111118]"
                        >
                          Inactive
                        </option>

                        <option
                          value="archived"
                          className="bg-[#111118]"
                        >
                          Archived
                        </option>
                      </select>

                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                    </div>

                    <div className="relative w-full sm:w-52">
                      <select
                        value={source}
                        onChange={(event) =>
                          setSource(
                            event.target.value
                          )
                        }
                        className="w-full appearance-none rounded-xl border border-white/[0.08] bg-white/[0.025] px-3.5 py-2.5 pr-10 text-sm text-white outline-none transition focus:border-violet-400/30 focus:ring-2 focus:ring-violet-500/10"
                      >
                        <option
                          value=""
                          className="bg-[#111118]"
                        >
                          All Sources
                        </option>

                        <option
                          value="lead"
                          className="bg-[#111118]"
                        >
                          Lead
                        </option>

                        <option
                          value="website"
                          className="bg-[#111118]"
                        >
                          Website
                        </option>

                        <option
                          value="facebook"
                          className="bg-[#111118]"
                        >
                          Facebook
                        </option>

                        <option
                          value="instagram"
                          className="bg-[#111118]"
                        >
                          Instagram
                        </option>

                        <option
                          value="google"
                          className="bg-[#111118]"
                        >
                          Google
                        </option>

                        <option
                          value="referral"
                          className="bg-[#111118]"
                        >
                          Referral
                        </option>

                        <option
                          value="phone"
                          className="bg-[#111118]"
                        >
                          Phone
                        </option>

                        <option
                          value="email"
                          className="bg-[#111118]"
                        >
                          Email
                        </option>

                        <option
                          value="whatsapp"
                          className="bg-[#111118]"
                        >
                          WhatsApp
                        </option>

                        <option
                          value="walk_in"
                          className="bg-[#111118]"
                        >
                          Walk-in
                        </option>

                        <option
                          value="other"
                          className="bg-[#111118]"
                        >
                          Other
                        </option>
                      </select>

                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ERROR */}

          {error && (
            <motion.div
              initial={{
                opacity: 0,
                y: -8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="mx-4 mt-4 flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-500/[0.07] px-4 py-3 text-sm text-red-300 sm:mx-5"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

              <span>{error}</span>

              <button
                type="button"
                onClick={() =>
                  setError("")
                }
                className="ml-auto text-red-300/50 transition hover:text-red-300"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}

          {/* CONTENT */}

          {loading ? (
            <CustomerTableSkeleton />
          ) : visibleCustomers.length ===
            0 ? (
            <EmptyState
              search={search}
              status={status}
              source={source}
              onAdd={() => {
                setError("");
                setShowAddModal(true);
              }}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px]">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.16em] text-white/30">
                      Customer
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.16em] text-white/30">
                      Contact
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.16em] text-white/30">
                      Company
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.16em] text-white/30">
                      Source
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.16em] text-white/30">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-[11px] font-bold uppercase tracking-[0.16em] text-white/30">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {visibleCustomers.map(
                    (
                      customer,
                      index
                    ) => (
                      <CustomerRow
                        key={
                          customer._id ||
                          index
                        }
                        customer={
                          customer
                        }
                        index={index}
                        onView={() =>
                          setSelectedCustomer(
                            customer
                          )
                        }
                        onEdit={() =>
                          setEditingCustomer(
                            customer
                          )
                        }
                        onArchive={
                          handleArchive
                        }
                      />
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* FOOTER */}

          {!loading &&
            visibleCustomers.length >
              0 && (
              <div className="flex flex-col gap-2 border-t border-white/[0.06] px-5 py-4 text-xs text-white/30 sm:flex-row sm:items-center sm:justify-between">
                <span>
                  Showing{" "}
                  <span className="font-semibold text-white/55">
                    {
                      visibleCustomers.length
                    }
                  </span>{" "}
                  customer
                  {visibleCustomers.length !==
                  1
                    ? "s"
                    : ""}
                </span>

                <span>
                  Business:{" "}
                  <span className="font-semibold text-white/50">
                    {currentOrganization?.name ||
                      currentOrganization?.businessName ||
                      "Current business"}
                  </span>
                </span>
              </div>
            )}
        </motion.div>
      </div>

      {/* =====================================================
          ADD CUSTOMER MODAL
      ===================================================== */}

      <AnimatePresence>
        {showAddModal && (
          <CustomerFormModal
            mode="create"
            onClose={() =>
              setShowAddModal(false)
            }
            onSubmit={
              handleCreateCustomer
            }
          />
        )}
      </AnimatePresence>

      {/* =====================================================
          EDIT CUSTOMER MODAL
      ===================================================== */}

      <AnimatePresence>
        {editingCustomer && (
          <CustomerFormModal
            mode="edit"
            customer={
              editingCustomer
            }
            onClose={() =>
              setEditingCustomer(
                null
              )
            }
            onSubmit={(formData) =>
              handleUpdateCustomer(
                editingCustomer._id,
                formData
              )
            }
          />
        )}
      </AnimatePresence>

      {/* =====================================================
          CUSTOMER PREVIEW
      ===================================================== */}

      <AnimatePresence>
        {selectedCustomer && (
          <CustomerPreview
            customer={
              selectedCustomer
            }
            onClose={() =>
              setSelectedCustomer(
                null
              )
            }
            onEdit={() => {
              setEditingCustomer(
                selectedCustomer
              );

              setSelectedCustomer(
                null
              );
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// =========================================================
// STAT CARD
// =========================================================

const StatCard = ({
  title,
  value,
  icon: Icon,
  loading,
  description,
}) => {
  return (
    <motion.div
      whileHover={{
        y: -2,
      }}
      transition={{
        duration: 0.2,
      }}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 shadow-[0_15px_50px_rgba(0,0,0,0.2)] backdrop-blur-xl"
    >
      <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-violet-500/[0.07] blur-3xl transition duration-500 group-hover:bg-violet-500/[0.12]" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-white/40">
            {title}
          </p>

          {loading ? (
            <div className="mt-3 h-8 w-24 animate-pulse rounded-lg bg-white/[0.06]" />
          ) : (
            <p className="mt-2 text-2xl font-bold tracking-tight text-white">
              {value}
            </p>
          )}

          <p className="mt-1.5 text-[11px] text-white/25">
            {description}
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-500/[0.08]">
          <Icon className="h-4 w-4 text-violet-300" />
        </div>
      </div>
    </motion.div>
  );
};

// =========================================================
// CUSTOMER ROW
// =========================================================

const CustomerRow = ({
  customer,
  index,
  onView,
  onEdit,
  onArchive,
}) => {
  const name =
    getCustomerName(customer);

  const initials =
    getInitials(customer);

  const status =
    customer?.status ||
    "active";

  const source =
    customer?.source ||
    "other";

  return (
    <motion.tr
      initial={{
        opacity: 0,
        y: 8,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.25,
        delay:
          index * 0.025,
      }}
      className="group border-b border-white/[0.045] transition hover:bg-white/[0.025]"
    >
      {/* CUSTOMER */}

      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-400/15 bg-gradient-to-br from-violet-500/15 to-purple-500/[0.05] text-xs font-bold text-violet-200">
            {initials}
          </div>

          <div className="min-w-0">
            <button
              type="button"
              onClick={onView}
              className="max-w-[220px] truncate text-left text-sm font-semibold text-white/85 transition hover:text-violet-300"
            >
              {name}
            </button>

            {customer?.createdAt && (
              <p className="mt-0.5 text-[11px] text-white/25">
                Added{" "}
                {formatDate(
                  customer.createdAt
                )}
              </p>
            )}
          </div>
        </div>
      </td>

      {/* CONTACT */}

      <td className="px-5 py-4">
        <div className="space-y-1.5">
          {customer?.email ? (
            <div className="flex items-center gap-2 text-xs text-white/50">
              <Mail className="h-3.5 w-3.5 text-white/25" />

              <span className="max-w-[210px] truncate">
                {customer.email}
              </span>
            </div>
          ) : null}

          {customer?.phone ? (
            <div className="flex items-center gap-2 text-xs text-white/40">
              <Phone className="h-3.5 w-3.5 text-white/20" />

              <span>
                {customer.phone}
              </span>
            </div>
          ) : null}

          {!customer?.email &&
            !customer?.phone && (
              <span className="text-xs text-white/20">
                No contact info
              </span>
            )}
        </div>
      </td>

      {/* COMPANY */}

      <td className="px-5 py-4">
        {customer?.company ? (
          <div className="flex items-center gap-2 text-sm text-white/55">
            <Building2 className="h-4 w-4 text-white/20" />

            <span className="max-w-[180px] truncate">
              {customer.company}
            </span>
          </div>
        ) : (
          <span className="text-xs text-white/20">
            Individual
          </span>
        )}
      </td>

      {/* SOURCE */}

      <td className="px-5 py-4">
        <SourceBadge
          source={source}
        />
      </td>

      {/* STATUS */}

      <td className="px-5 py-4">
        <StatusBadge
          status={status}
        />
      </td>

      {/* ACTIONS */}

      <td className="px-5 py-4">
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={onView}
            title="View customer"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/30 transition hover:bg-white/[0.06] hover:text-white"
          >
            <Eye className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onEdit}
            title="Edit customer"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/30 transition hover:bg-violet-500/10 hover:text-violet-300"
          >
            <Pencil className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() =>
              onArchive(customer)
            }
            title="Archive customer"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/30 transition hover:bg-red-500/10 hover:text-red-300"
          >
            <Archive className="h-4 w-4" />
          </button>

          <button
            type="button"
            title="More actions"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/20 transition hover:bg-white/[0.06] hover:text-white/60"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </td>
    </motion.tr>
  );
};

// =========================================================
// CUSTOMER FORM MODAL
// =========================================================

const CustomerFormModal = ({
  mode,
  customer,
  onClose,
  onSubmit,
}) => {
  const isEdit =
    mode === "edit";

  const [form, setForm] =
    useState({
      firstName:
        customer?.firstName || "",

      lastName:
        customer?.lastName || "",

      email:
        customer?.email || "",

      phone:
        customer?.phone || "",

      company:
        customer?.company || "",

      source:
        customer?.source || "other",

      status:
        customer?.status || "active",

      notes:
        customer?.notes || "",
    });

  const [formError, setFormError] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const validate = () => {
    if (
      !form.firstName.trim()
    ) {
      return "First name is required.";
    }

    if (
      form.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email.trim()
      )
    ) {
      return "Please enter a valid email address.";
    }

    return "";
  };

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    const validationError =
      validate();

    if (validationError) {
      setFormError(
        validationError
      );

      return;
    }

    try {
      setSubmitting(true);
      setFormError("");

      await onSubmit({
        firstName:
          form.firstName.trim(),

        lastName:
          form.lastName.trim(),

        email:
          form.email.trim(),

        phone:
          form.phone.trim(),

        company:
          form.company.trim(),

        source:
          form.source,

        status:
          form.status,

        notes:
          form.notes.trim(),
      });
    } catch (err) {
      setFormError(
        err?.response?.data
          ?.message ||
          err?.message ||
          `Failed to ${
            isEdit
              ? "update"
              : "create"
          } customer.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[140] flex items-center justify-center px-4 py-6"
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
    >
      {/* BACKDROP */}

      <motion.div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={
          submitting
            ? undefined
            : onClose
        }
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        exit={{
          opacity: 0,
        }}
      />

      {/* PANEL */}

      <motion.div
        initial={{
          opacity: 0,
          y: 25,
          scale: 0.96,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        exit={{
          opacity: 0,
          y: 20,
          scale: 0.98,
        }}
        transition={{
          duration: 0.25,
        }}
        className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-white/[0.09] bg-[#0a0a0f]/95 shadow-[0_30px_120px_rgba(0,0,0,0.75)] backdrop-blur-2xl"
      >
        {/* GLOW */}

        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-600/10 blur-3xl" />

        {/* HEADER */}

        <div className="relative flex items-center justify-between border-b border-white/[0.07] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-500/10">
              {isEdit ? (
                <Pencil className="h-5 w-5 text-violet-300" />
              ) : (
                <UserPlus className="h-5 w-5 text-violet-300" />
              )}
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">
                {isEdit
                  ? "Edit Customer"
                  : "Add Customer"}
              </h2>

              <p className="mt-0.5 text-xs text-white/35">
                {isEdit
                  ? "Update customer information."
                  : "Create a new customer record."}
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={submitting}
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03] text-white/40 transition hover:bg-white/[0.06] hover:text-white disabled:opacity-40"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="relative overflow-y-auto"
        >
          <div className="space-y-5 px-6 py-6">
            {formError && (
              <div className="flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-500/[0.07] px-4 py-3 text-sm text-red-300">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

                <span>
                  {formError}
                </span>
              </div>
            )}

            {/* NAME */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                label="First Name"
                required
                name="firstName"
                value={
                  form.firstName
                }
                onChange={
                  handleChange
                }
                placeholder="John"
              />

              <FormField
                label="Last Name"
                name="lastName"
                value={
                  form.lastName
                }
                onChange={
                  handleChange
                }
                placeholder="Doe"
              />
            </div>

            {/* CONTACT */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                label="Email"
                type="email"
                name="email"
                value={
                  form.email
                }
                onChange={
                  handleChange
                }
                placeholder="john@example.com"
              />

              <FormField
                label="Phone"
                name="phone"
                value={
                  form.phone
                }
                onChange={
                  handleChange
                }
                placeholder="+880 1XXXXXXXXX"
              />
            </div>

            {/* COMPANY */}

            <FormField
              label="Company"
              name="company"
              value={
                form.company
              }
              onChange={
                handleChange
              }
              placeholder="Company name"
            />

            {/* SOURCE + STATUS */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormSelect
                label="Source"
                name="source"
                value={
                  form.source
                }
                onChange={
                  handleChange
                }
                options={[
                  [
                    "lead",
                    "Lead",
                  ],
                  [
                    "website",
                    "Website",
                  ],
                  [
                    "facebook",
                    "Facebook",
                  ],
                  [
                    "instagram",
                    "Instagram",
                  ],
                  [
                    "google",
                    "Google",
                  ],
                  [
                    "referral",
                    "Referral",
                  ],
                  [
                    "phone",
                    "Phone",
                  ],
                  [
                    "email",
                    "Email",
                  ],
                  [
                    "whatsapp",
                    "WhatsApp",
                  ],
                  [
                    "walk_in",
                    "Walk-in",
                  ],
                  [
                    "other",
                    "Other",
                  ],
                ]}
              />

              <FormSelect
                label="Status"
                name="status"
                value={
                  form.status
                }
                onChange={
                  handleChange
                }
                options={[
                  [
                    "active",
                    "Active",
                  ],
                  [
                    "inactive",
                    "Inactive",
                  ],
                ]}
              />
            </div>

            {/* NOTES */}

            <div>
              <label className="mb-2 block text-xs font-semibold text-white/50">
                Notes
              </label>

              <div className="relative">
                <FileText className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-white/20" />

                <textarea
                  name="notes"
                  value={
                    form.notes
                  }
                  onChange={
                    handleChange
                  }
                  rows={4}
                  placeholder="Add notes about this customer..."
                  className="w-full resize-none rounded-xl border border-white/[0.08] bg-black/20 py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-white/20 transition focus:border-violet-400/30 focus:bg-white/[0.04] focus:ring-2 focus:ring-violet-500/10"
                />
              </div>
            </div>
          </div>

          {/* FOOTER */}

          <div className="flex items-center justify-end gap-2 border-t border-white/[0.07] bg-white/[0.015] px-6 py-4">
            <button
              type="button"
              disabled={submitting}
              onClick={onClose}
              className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-white/55 transition hover:bg-white/[0.06] hover:text-white disabled:opacity-40"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 rounded-xl border border-violet-400/25 bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_35px_rgba(124,58,237,0.2)] transition hover:from-violet-500 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />

                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />

                  {isEdit
                    ? "Save Changes"
                    : "Create Customer"}
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// =========================================================
// FORM FIELD
// =========================================================

const FormField = ({
  label,
  required = false,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-white/50">
        {label}

        {required && (
          <span className="ml-1 text-violet-400">
            *
          </span>
        )}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/[0.08] bg-black/20 px-3.5 py-3 text-sm text-white outline-none placeholder:text-white/20 transition focus:border-violet-400/30 focus:bg-white/[0.04] focus:ring-2 focus:ring-violet-500/10"
      />
    </div>
  );
};

// =========================================================
// FORM SELECT
// =========================================================

const FormSelect = ({
  label,
  name,
  value,
  onChange,
  options,
}) => {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-white/50">
        {label}
      </label>

      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full appearance-none rounded-xl border border-white/[0.08] bg-black/20 px-3.5 py-3 pr-10 text-sm text-white outline-none transition focus:border-violet-400/30 focus:bg-white/[0.04] focus:ring-2 focus:ring-violet-500/10"
        >
          {options.map(
            ([
              optionValue,
              optionLabel,
            ]) => (
              <option
                key={optionValue}
                value={optionValue}
                className="bg-[#111118]"
              >
                {optionLabel}
              </option>
            )
          )}
        </select>

        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
      </div>
    </div>
  );
};

// =========================================================
// STATUS BADGE
// =========================================================

const StatusBadge = ({
  status,
}) => {
  const config = {
    active: {
      label: "Active",
      dot: "bg-emerald-400",
      className:
        "border-emerald-400/15 bg-emerald-500/[0.07] text-emerald-300",
    },

    inactive: {
      label: "Inactive",
      dot: "bg-amber-400",
      className:
        "border-amber-400/15 bg-amber-500/[0.07] text-amber-300",
    },

    archived: {
      label: "Archived",
      dot: "bg-red-400",
      className:
        "border-red-400/15 bg-red-500/[0.07] text-red-300",
    },
  };

  const current =
    config[status] ||
    config.active;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${current.className}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${current.dot}`}
      />

      {current.label}
    </span>
  );
};

// =========================================================
// SOURCE BADGE
// =========================================================

const SourceBadge = ({
  source,
}) => {
  const labels = {
    lead: "Lead",
    website: "Website",
    facebook: "Facebook",
    instagram: "Instagram",
    google: "Google",
    referral: "Referral",
    phone: "Phone",
    email: "Email",
    whatsapp: "WhatsApp",
    walk_in: "Walk-in",
    other: "Other",
  };

  return (
    <span className="inline-flex rounded-lg border border-white/[0.07] bg-white/[0.025] px-2.5 py-1 text-[11px] font-medium text-white/45">
      {labels[source] ||
        source ||
        "Other"}
    </span>
  );
};

// =========================================================
// EMPTY STATE
// =========================================================

const EmptyState = ({
  search,
  status,
  source,
  onAdd,
}) => {
  const filtered =
    Boolean(
      search ||
        status ||
        source
    );

  return (
    <div className="flex min-h-[420px] items-center justify-center px-6 py-12">
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.96,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        className="max-w-md text-center"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-400/15 bg-violet-500/[0.07]">
          {filtered ? (
            <Search className="h-7 w-7 text-violet-300/70" />
          ) : (
            <Users className="h-7 w-7 text-violet-300/70" />
          )}
        </div>

        <h3 className="mt-5 text-lg font-bold text-white">
          {filtered
            ? "No customers found"
            : "No customers yet"}
        </h3>

        <p className="mt-2 text-sm leading-6 text-white/35">
          {filtered
            ? "Try changing your search or filters to find what you're looking for."
            : "Your customer records will appear here once you add your first customer."}
        </p>

        {!filtered && (
          <button
            type="button"
            onClick={onAdd}
            className="mt-5 inline-flex items-center gap-2 rounded-xl border border-violet-400/20 bg-violet-500/10 px-4 py-2.5 text-sm font-semibold text-violet-200 transition hover:bg-violet-500/15"
          >
            <Plus className="h-4 w-4" />

            Add your first customer
          </button>
        )}
      </motion.div>
    </div>
  );
};

// =========================================================
// TABLE SKELETON
// =========================================================

const CustomerTableSkeleton =
  () => {
    return (
      <div className="space-y-0 overflow-x-auto">
        {Array.from({
          length: 6,
        }).map((_, index) => (
          <div
            key={index}
            className="flex min-w-[900px] items-center gap-6 border-b border-white/[0.045] px-5 py-5"
          >
            <div className="h-10 w-10 animate-pulse rounded-xl bg-white/[0.06]" />

            <div className="w-48 space-y-2">
              <div className="h-3 w-32 animate-pulse rounded bg-white/[0.06]" />

              <div className="h-2.5 w-20 animate-pulse rounded bg-white/[0.04]" />
            </div>

            <div className="w-52 space-y-2">
              <div className="h-2.5 w-36 animate-pulse rounded bg-white/[0.05]" />

              <div className="h-2.5 w-24 animate-pulse rounded bg-white/[0.04]" />
            </div>

            <div className="h-3 w-28 animate-pulse rounded bg-white/[0.05]" />

            <div className="h-6 w-20 animate-pulse rounded-full bg-white/[0.05]" />

            <div className="h-6 w-20 animate-pulse rounded-full bg-white/[0.05]" />

            <div className="ml-auto h-8 w-24 animate-pulse rounded-lg bg-white/[0.04]" />
          </div>
        ))}
      </div>
    );
  };

// =========================================================
// CUSTOMER PREVIEW
// =========================================================

const CustomerPreview = ({
  customer,
  onClose,
  onEdit,
}) => {
  return (
    <motion.div
      className="fixed inset-0 z-[120] flex items-center justify-center px-4 py-6"
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
    >
      {/* BACKDROP */}

      <motion.div
        className="absolute inset-0 bg-black/75 backdrop-blur-md"
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        exit={{
          opacity: 0,
        }}
        onClick={onClose}
      />

      {/* PANEL */}

      <motion.div
        initial={{
          opacity: 0,
          y: 25,
          scale: 0.97,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        exit={{
          opacity: 0,
          y: 20,
          scale: 0.98,
        }}
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-white/[0.09] bg-[#0b0b10]/95 shadow-[0_30px_100px_rgba(0,0,0,0.7)] backdrop-blur-2xl"
      >
        <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" />

        {/* HEADER */}

        <div className="relative flex items-center justify-between border-b border-white/[0.07] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-500/10 text-sm font-bold text-violet-200">
              {getInitials(
                customer
              )}
            </div>

            <div>
              <h3 className="font-bold text-white">
                {getCustomerName(
                  customer
                )}
              </h3>

              <p className="mt-0.5 text-xs text-white/35">
                Customer profile
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03] text-white/40 transition hover:bg-white/[0.06] hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* BODY */}

        <div className="relative space-y-5 px-6 py-6">
          <PreviewItem
            icon={Mail}
            label="Email"
            value={
              customer?.email ||
              "Not provided"
            }
          />

          <PreviewItem
            icon={Phone}
            label="Phone"
            value={
              customer?.phone ||
              "Not provided"
            }
          />

          <PreviewItem
            icon={Building2}
            label="Company"
            value={
              customer?.company ||
              "Individual"
            }
          />

          <div className="flex items-center justify-between border-t border-white/[0.06] pt-5">
            <span className="text-xs text-white/35">
              Status
            </span>

            <StatusBadge
              status={
                customer?.status ||
                "active"
              }
            />
          </div>

          <div className="flex items-center justify-between border-t border-white/[0.06] pt-5">
            <span className="text-xs text-white/35">
              Source
            </span>

            <SourceBadge
              source={
                customer?.source ||
                "other"
              }
            />
          </div>

          {customer?.notes && (
            <div className="border-t border-white/[0.06] pt-5">
              <p className="mb-2 text-xs font-semibold text-white/40">
                Notes
              </p>

              <p className="text-sm leading-6 text-white/55">
                {customer.notes}
              </p>
            </div>
          )}

          <div className="flex justify-end border-t border-white/[0.06] pt-5">
            <button
              type="button"
              onClick={onEdit}
              className="flex items-center gap-2 rounded-xl border border-violet-400/20 bg-violet-500/10 px-4 py-2.5 text-sm font-semibold text-violet-200 transition hover:bg-violet-500/15"
            >
              <Pencil className="h-4 w-4" />

              Edit Customer
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// =========================================================
// PREVIEW ITEM
// =========================================================

const PreviewItem = ({
  icon: Icon,
  label,
  value,
}) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03]">
        <Icon className="h-4 w-4 text-white/35" />
      </div>

      <div className="min-w-0">
        <p className="text-[11px] text-white/25">
          {label}
        </p>

        <p className="mt-0.5 truncate text-sm text-white/65">
          {value}
        </p>
      </div>
    </div>
  );
};

// =========================================================
// HELPERS
// =========================================================

const getCustomerName = (
  customer
) => {
  const fullName = [
    customer?.firstName,
    customer?.lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return (
    fullName ||
    customer?.name ||
    customer?.fullName ||
    "Unnamed Customer"
  );
};

// =========================================================
// INITIALS
// =========================================================

const getInitials = (
  customer
) => {
  const name =
    getCustomerName(
      customer
    );

  const parts =
    name.split(" ");

  if (
    parts.length >= 2
  ) {
    return (
      parts[0][0] +
      parts[
        parts.length - 1
      ][0]
    ).toUpperCase();
  }

  return name
    .slice(0, 2)
    .toUpperCase();
};

// =========================================================
// CURRENCY
// =========================================================

const formatCurrency = (
  value
) => {
  const amount =
    Number(value) || 0;

  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }
  ).format(amount);
};

// =========================================================
// DATE
// =========================================================

const formatDate = (
  value
) => {
  if (!value) {
    return "";
  }

  try {
    return new Intl.DateTimeFormat(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    ).format(
      new Date(value)
    );
  } catch {
    return "";
  }
};

// =========================================================
// EXPORT
// =========================================================

export default Customers;