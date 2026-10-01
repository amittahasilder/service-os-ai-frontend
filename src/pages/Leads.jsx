import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { motion } from "framer-motion";

import {
  getLeadStats,
  getLeads,
} from "../api/leadApi";

import CreateLeadModal from "../components/leads/CreateLeadModal";
import EditLeadModal from "../components/leads/EditLeadModal";

// =========================================================
// STATUS STYLES
// =========================================================

const statusStyles = {
  new: "border-violet-400/20 bg-violet-500/10 text-violet-300",

  contacted:
    "border-cyan-400/20 bg-cyan-500/10 text-cyan-300",

  qualified:
    "border-emerald-400/20 bg-emerald-500/10 text-emerald-300",

  proposal:
    "border-amber-400/20 bg-amber-500/10 text-amber-300",

  won: "border-green-400/20 bg-green-500/10 text-green-300",

  lost: "border-red-400/20 bg-red-500/10 text-red-300",
};

// =========================================================
// FORMATTERS
// =========================================================

const formatStatus = (status = "") => {
  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
};

const formatSource = (source = "") => {
  return source
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
};

const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsedDate);
};

const getInitials = (name = "") => {
  return (
    name
      .trim()
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "L"
  );
};

// =========================================================
// LEADS PAGE
// =========================================================

const Leads = () => {
  // =======================================================
  // DATA
  // =======================================================

  const [leads, setLeads] = useState([]);

  const [leadStats, setLeadStats] = useState([]);

  // =======================================================
  // UI STATE
  // =======================================================

  const [loading, setLoading] = useState(true);

  const [statsLoading, setStatsLoading] =
    useState(true);

  const [error, setError] = useState("");

  const [statsError, setStatsError] =
    useState("");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [sourceFilter, setSourceFilter] =
    useState("All");

  const [priorityFilter, setPriorityFilter] =
    useState("All");

  // =======================================================
  // CREATE LEAD MODAL
  // =======================================================

  const [createModalOpen, setCreateModalOpen] =
    useState(false);

  // =======================================================
  // EDIT LEAD
  // =======================================================

  const [editLead, setEditLead] =
    useState(null);

  // =======================================================
  // FETCH LEADS
  // =======================================================

  const loadLeads = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      if (statusFilter !== "All") {
        params.status = statusFilter;
      }

      if (sourceFilter !== "All") {
        params.source = sourceFilter;
      }

      if (priorityFilter !== "All") {
        params.priority = priorityFilter;
      }

      if (search.trim()) {
        params.search = search.trim();
      }

      const response = await getLeads(params);

      const leadList =
        response?.data?.leads || [];

      setLeads(
        Array.isArray(leadList)
          ? leadList
          : []
      );
    } catch (err) {
      console.error(
        "Lead loading error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load leads."
      );

      setLeads([]);
    } finally {
      setLoading(false);
    }
  }, [
    search,
    statusFilter,
    sourceFilter,
    priorityFilter,
  ]);

  // =======================================================
  // FETCH STATS
  // =======================================================

  const loadLeadStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      setStatsError("");

      const response =
        await getLeadStats();

      const stats =
        response?.data?.stats || [];

      setLeadStats(
        Array.isArray(stats)
          ? stats
          : []
      );
    } catch (err) {
      console.error(
        "Lead stats loading error:",
        err
      );

      setStatsError(
        err?.response?.data?.message ||
          "Failed to load lead statistics."
      );

      setLeadStats([]);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // =======================================================
  // INITIAL LOAD
  // =======================================================

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  useEffect(() => {
    loadLeadStats();
  }, [loadLeadStats]);

  // =======================================================
  // STATS CALCULATION
  // =======================================================

  const stats = useMemo(() => {
    const getStatusCount = (status) => {
      const item = leadStats.find(
        (stat) => stat?._id === status
      );

      return item?.count || 0;
    };

    return {
      total: leadStats.reduce(
        (total, stat) =>
          total + (stat?.count || 0),
        0
      ),

      new: getStatusCount("new"),

      contacted:
        getStatusCount("contacted"),

      qualified:
        getStatusCount("qualified"),
    };
  }, [leadStats]);

  // =======================================================
  // CLIENT-SIDE SAFETY FILTER
  // =======================================================

  const filteredLeads = useMemo(() => {
    if (!Array.isArray(leads)) {
      return [];
    }

    return leads;
  }, [leads]);

  // =======================================================
  // REFRESH
  // =======================================================

  const handleRefresh = async () => {
    await Promise.all([
      loadLeads(),
      loadLeadStats(),
    ]);
  };

  // =======================================================
  // CREATE LEAD SUCCESS
  // =======================================================

  const handleCreateLeadSuccess =
    async () => {
      await handleRefresh();
    };

  // =======================================================
  // EDIT LEAD SUCCESS
  // =======================================================

  const handleEditLeadSuccess =
    async () => {
      await handleRefresh();
    };

  // =======================================================
  // OPEN EDIT MODAL
  // =======================================================

  const handleEditLead = (lead) => {
    if (!lead?._id) {
      return;
    }

    setEditLead(lead);
  };

  // =======================================================
  // CLOSE EDIT MODAL
  // =======================================================

  const handleCloseEditModal = () => {
    setEditLead(null);
  };

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <div className="min-h-screen bg-[#050507] text-white">
      {/* =====================================================
          AMBIENT BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[10%] top-[5%] h-[320px] w-[320px] rounded-full bg-violet-600/[0.07] blur-[120px]" />

        <div className="absolute right-[5%] top-[25%] h-[300px] w-[300px] rounded-full bg-cyan-500/[0.05] blur-[120px]" />

        <div className="absolute bottom-[5%] left-[40%] h-[350px] w-[350px] rounded-full bg-purple-600/[0.05] blur-[140px]" />
      </div>

      <div className="relative z-10 space-y-6 p-4 sm:p-6 lg:p-8">
        {/* =====================================================
            HEADER
        ===================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 18,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.45,
          }}
          className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
        >
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_12px_rgba(167,139,250,0.8)]" />

              <span className="text-xs font-medium uppercase tracking-[0.2em] text-violet-300/70">
                CRM
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Leads
            </h1>

            <p className="mt-1 text-sm text-white/40">
              Manage and convert your potential
              customers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* REFRESH */}

            <button
              type="button"
              onClick={handleRefresh}
              disabled={
                loading || statsLoading
              }
              className="
                inline-flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                border
                border-white/[0.08]
                bg-white/[0.025]
                text-white/50
                backdrop-blur-xl
                transition
                hover:border-white/[0.14]
                hover:bg-white/[0.05]
                hover:text-white
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
              title="Refresh leads"
            >
              <motion.span
                animate={
                  loading || statsLoading
                    ? {
                        rotate: 360,
                      }
                    : {
                        rotate: 0,
                      }
                }
                transition={{
                  duration: 0.8,
                  repeat:
                    loading ||
                    statsLoading
                      ? Infinity
                      : 0,
                  ease: "linear",
                }}
                className="text-base"
              >
                ↻
              </motion.span>
            </button>

            {/* NEW LEAD */}

            <button
              type="button"
              onClick={() =>
                setCreateModalOpen(true)
              }
              className="
                group
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-violet-400/20
                bg-violet-500/10
                px-5
                py-3
                text-sm
                font-semibold
                text-violet-200
                shadow-[0_0_30px_rgba(139,92,246,0.08)]
                backdrop-blur-xl
                transition
                hover:border-violet-400/40
                hover:bg-violet-500/15
                hover:text-white
              "
            >
              <span className="text-lg leading-none transition-transform group-hover:rotate-90">
                +
              </span>

              New Lead
            </button>
          </div>
        </motion.div>

        {/* =====================================================
            STATS
        ===================================================== */}

        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          <Stat
            label="Total Leads"
            value={
              statsLoading
                ? "—"
                : stats.total
            }
            description="All active leads"
            icon="◎"
            loading={statsLoading}
          />

          <Stat
            label="New"
            value={
              statsLoading
                ? "—"
                : stats.new
            }
            description="Needs attention"
            icon="✦"
            loading={statsLoading}
          />

          <Stat
            label="Contacted"
            value={
              statsLoading
                ? "—"
                : stats.contacted
            }
            description="Follow-up in progress"
            icon="↗"
            loading={statsLoading}
          />

          <Stat
            label="Qualified"
            value={
              statsLoading
                ? "—"
                : stats.qualified
            }
            description="High potential"
            icon="✓"
            loading={statsLoading}
          />
        </div>

        {/* =====================================================
            STATS ERROR
        ===================================================== */}

        {statsError && (
          <div className="rounded-xl border border-amber-400/10 bg-amber-500/[0.05] px-4 py-3 text-xs text-amber-200/70">
            Statistics could not be loaded.
          </div>
        )}

        {/* =====================================================
            MAIN PANEL
        ===================================================== */}

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
            duration: 0.5,
            delay: 0.1,
          }}
          className="
            overflow-hidden
            rounded-2xl
            border
            border-white/[0.08]
            bg-white/[0.025]
            shadow-[0_20px_80px_rgba(0,0,0,0.35)]
            backdrop-blur-2xl
          "
        >
          {/* ===================================================
              TOOLBAR
          =================================================== */}

          <div className="border-b border-white/[0.06] p-4 sm:p-5">
            <div className="flex flex-col gap-3 xl:flex-row">
              {/* SEARCH */}

              <div className="relative flex-1">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-white/30">
                  ⌕
                </span>

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search leads by name, email, phone..."
                  className="
                    h-11
                    w-full
                    rounded-xl
                    border
                    border-white/[0.08]
                    bg-black/20
                    pl-11
                    pr-4
                    text-sm
                    text-white
                    outline-none
                    placeholder:text-white/25
                    transition
                    focus:border-violet-400/30
                    focus:bg-white/[0.035]
                    focus:ring-1
                    focus:ring-violet-400/10
                  "
                />
              </div>

              {/* STATUS */}

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value
                  )
                }
                className="
                  h-11
                  rounded-xl
                  border
                  border-white/[0.08]
                  bg-[#0a0a0d]
                  px-4
                  text-sm
                  text-white/70
                  outline-none
                  transition
                  focus:border-violet-400/30
                "
              >
                <option value="All">
                  All Status
                </option>

                <option value="new">
                  New
                </option>

                <option value="contacted">
                  Contacted
                </option>

                <option value="qualified">
                  Qualified
                </option>

                <option value="proposal">
                  Proposal
                </option>

                <option value="won">
                  Won
                </option>

                <option value="lost">
                  Lost
                </option>
              </select>

              {/* SOURCE */}

              <select
                value={sourceFilter}
                onChange={(event) =>
                  setSourceFilter(
                    event.target.value
                  )
                }
                className="
                  h-11
                  rounded-xl
                  border
                  border-white/[0.08]
                  bg-[#0a0a0d]
                  px-4
                  text-sm
                  text-white/70
                  outline-none
                  transition
                  focus:border-violet-400/30
                "
              >
                <option value="All">
                  All Sources
                </option>

                <option value="website">
                  Website
                </option>

                <option value="facebook">
                  Facebook
                </option>

                <option value="instagram">
                  Instagram
                </option>

                <option value="google">
                  Google
                </option>

                <option value="referral">
                  Referral
                </option>

                <option value="phone">
                  Phone
                </option>

                <option value="email">
                  Email
                </option>

                <option value="whatsapp">
                  WhatsApp
                </option>

                <option value="walk_in">
                  Walk In
                </option>

                <option value="other">
                  Other
                </option>
              </select>

              {/* PRIORITY */}

              <select
                value={priorityFilter}
                onChange={(event) =>
                  setPriorityFilter(
                    event.target.value
                  )
                }
                className="
                  h-11
                  rounded-xl
                  border
                  border-white/[0.08]
                  bg-[#0a0a0d]
                  px-4
                  text-sm
                  text-white/70
                  outline-none
                  transition
                  focus:border-violet-400/30
                "
              >
                <option value="All">
                  All Priority
                </option>

                <option value="low">
                  Low
                </option>

                <option value="medium">
                  Medium
                </option>

                <option value="high">
                  High
                </option>
              </select>
            </div>
          </div>

          {/* ===================================================
              ERROR
          =================================================== */}

          {error && (
            <div className="border-b border-red-400/10 bg-red-500/[0.04] px-5 py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-red-200/90">
                    Failed to load leads
                  </p>

                  <p className="mt-1 text-xs text-red-200/50">
                    {error}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={loadLeads}
                  className="
                    rounded-lg
                    border
                    border-red-400/15
                    bg-red-500/10
                    px-3
                    py-2
                    text-xs
                    font-medium
                    text-red-200
                    transition
                    hover:bg-red-500/15
                  "
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* ===================================================
              LOADING
          =================================================== */}

          {loading && (
            <LeadTableSkeleton />
          )}

          {/* ===================================================
              TABLE
          =================================================== */}

          {!loading && !error && (
            <div className="overflow-x-auto">
              {filteredLeads.length > 0 ? (
                <table className="w-full min-w-[950px]">
                  <thead>
                    <tr className="border-b border-white/[0.06] text-left">
                      <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-white/30">
                        Lead
                      </th>

                      <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-white/30">
                        Company
                      </th>

                      <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-white/30">
                        Source
                      </th>

                      <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-white/30">
                        Priority
                      </th>

                      <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-white/30">
                        Status
                      </th>

                      <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-white/30">
                        Created
                      </th>

                      <th className="px-5 py-4 text-right text-[11px] font-semibold uppercase tracking-wider text-white/30">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredLeads.map(
                      (lead, index) => (
                        <motion.tr
                          key={lead._id}
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
                              index * 0.04,
                          }}
                          className="
                            group
                            border-b
                            border-white/[0.045]
                            transition
                            hover:bg-white/[0.025]
                          "
                        >
                          {/* LEAD */}

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="
                                  flex
                                  h-10
                                  w-10
                                  shrink-0
                                  items-center
                                  justify-center
                                  rounded-xl
                                  border
                                  border-violet-400/15
                                  bg-gradient-to-br
                                  from-violet-500/15
                                  to-cyan-500/10
                                  text-sm
                                  font-bold
                                  text-violet-200
                                "
                              >
                                {getInitials(
                                  lead.name
                                )}
                              </div>

                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-white/90">
                                  {lead.name}
                                </p>

                                <p className="mt-0.5 truncate text-xs text-white/35">
                                  {lead.email ||
                                    "No email"}
                                </p>

                                {lead.phone && (
                                  <p className="mt-0.5 text-[10px] text-white/20">
                                    {lead.phone}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* COMPANY */}

                          <td className="px-5 py-4">
                            <p className="text-sm text-white/60">
                              {lead.company ||
                                "—"}
                            </p>
                          </td>

                          {/* SOURCE */}

                          <td className="px-5 py-4">
                            <span className="text-sm text-white/55">
                              {formatSource(
                                lead.source
                              )}
                            </span>
                          </td>

                          {/* PRIORITY */}

                          <td className="px-5 py-4">
                            <span className="text-xs capitalize text-white/50">
                              {lead.priority ||
                                "medium"}
                            </span>
                          </td>

                          {/* STATUS */}

                          <td className="px-5 py-4">
                            <span
                              className={`
                                inline-flex
                                items-center
                                rounded-full
                                border
                                px-2.5
                                py-1
                                text-[11px]
                                font-medium
                                ${
                                  statusStyles[
                                    lead.status
                                  ] ||
                                  "border-white/10 bg-white/5 text-white/50"
                                }
                              `}
                            >
                              <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />

                              {formatStatus(
                                lead.status
                              )}
                            </span>
                          </td>

                          {/* CREATED */}

                          <td className="px-5 py-4">
                            <span className="text-xs text-white/35">
                              {formatDate(
                                lead.createdAt
                              )}
                            </span>
                          </td>

                          {/* ACTION */}

                          <td className="px-5 py-4 text-right">
                            <button
                              type="button"
                              onClick={() =>
                                handleEditLead(
                                  lead
                                )
                              }
                              className="
                                rounded-lg
                                border
                                border-white/[0.07]
                                bg-white/[0.025]
                                px-3
                                py-2
                                text-xs
                                font-medium
                                text-white/45
                                transition
                                hover:border-violet-400/20
                                hover:bg-violet-500/10
                                hover:text-violet-200
                              "
                            >
                              Edit
                            </button>
                          </td>
                        </motion.tr>
                      )
                    )}
                  </tbody>
                </table>
              ) : (
                <EmptyLeadsState
                  search={search}
                  hasFilters={
                    statusFilter !== "All" ||
                    sourceFilter !== "All" ||
                    priorityFilter !== "All"
                  }
                  onClear={() => {
                    setSearch("");
                    setStatusFilter("All");
                    setSourceFilter("All");
                    setPriorityFilter("All");
                  }}
                />
              )}
            </div>
          )}

          {/* ===================================================
              FOOTER
          =================================================== */}

          {!loading && (
            <div className="flex items-center justify-between border-t border-white/[0.06] px-5 py-4">
              <p className="text-xs text-white/30">
                Showing{" "}
                <span className="text-white/60">
                  {filteredLeads.length}
                </span>{" "}
                leads
              </p>

              <span className="hidden text-[11px] text-white/20 sm:block">
                ServiceOS CRM
              </span>
            </div>
          )}
        </motion.div>
      </div>

      {/* =====================================================
          CREATE LEAD MODAL
      ===================================================== */}

      <CreateLeadModal
        isOpen={createModalOpen}
        onClose={() =>
          setCreateModalOpen(false)
        }
        onSuccess={
          handleCreateLeadSuccess
        }
      />

      {/* =====================================================
          EDIT LEAD MODAL
      ===================================================== */}

      <EditLeadModal
        isOpen={Boolean(editLead)}
        lead={editLead}
        onClose={handleCloseEditModal}
        onSuccess={handleEditLeadSuccess}
      />
    </div>
  );
};

// =========================================================
// STAT CARD
// =========================================================

const Stat = ({
  label,
  value,
  description,
  icon,
  loading,
}) => {
  return (
    <motion.div
      whileHover={{
        y: -3,
      }}
      transition={{
        duration: 0.2,
      }}
      className="
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        border-white/[0.07]
        bg-white/[0.025]
        p-4
        shadow-[0_15px_50px_rgba(0,0,0,0.25)]
        backdrop-blur-xl
      "
    >
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-violet-500/[0.07] blur-2xl transition group-hover:bg-violet-500/[0.12]" />

      <div className="relative">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-medium text-white/40">
            {label}
          </span>

          <span className="text-sm text-violet-300/70">
            {icon}
          </span>
        </div>

        {loading ? (
          <div className="h-8 w-14 animate-pulse rounded-lg bg-white/[0.06]" />
        ) : (
          <div className="text-2xl font-bold tracking-tight text-white">
            {value}
          </div>
        )}

        <p className="mt-1 text-[11px] text-white/25">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

// =========================================================
// TABLE SKELETON
// =========================================================

const LeadTableSkeleton = () => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[950px]">
        <thead>
          <tr className="border-b border-white/[0.06]">
            {[
              "Lead",
              "Company",
              "Source",
              "Priority",
              "Status",
              "Created",
              "Action",
            ].map((heading) => (
              <th
                key={heading}
                className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-white/20"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {Array.from({
            length: 6,
          }).map((_, index) => (
            <tr
              key={index}
              className="border-b border-white/[0.045]"
            >
              <td className="px-5 py-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 animate-pulse rounded-xl bg-white/[0.05]" />

                  <div className="space-y-2">
                    <div className="h-3 w-28 animate-pulse rounded bg-white/[0.06]" />

                    <div className="h-2 w-36 animate-pulse rounded bg-white/[0.04]" />
                  </div>
                </div>
              </td>

              {Array.from({
                length: 5,
              }).map((__, cellIndex) => (
                <td
                  key={cellIndex}
                  className="px-5 py-5"
                >
                  <div className="h-3 w-20 animate-pulse rounded bg-white/[0.05]" />
                </td>
              ))}

              <td className="px-5 py-5 text-right">
                <div className="ml-auto h-8 w-14 animate-pulse rounded-lg bg-white/[0.05]" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// =========================================================
// EMPTY STATE
// =========================================================

const EmptyLeadsState = ({
  search,
  hasFilters,
  onClear,
}) => {
  const filtered =
    search.trim() || hasFilters;

  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.9,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        className="
          mb-5
          flex
          h-16
          w-16
          items-center
          justify-center
          rounded-2xl
          border
          border-white/[0.08]
          bg-white/[0.03]
          text-2xl
          text-white/25
        "
      >
        {filtered ? "⌕" : "◎"}
      </motion.div>

      <h3 className="text-sm font-semibold text-white/80">
        {filtered
          ? "No leads match your filters"
          : "No leads yet"}
      </h3>

      <p className="mt-1 max-w-sm text-xs leading-5 text-white/35">
        {filtered
          ? "Try changing your search or filters to find other leads."
          : "Your captured leads will appear here once you create your first lead."}
      </p>

      {filtered && (
        <button
          type="button"
          onClick={onClear}
          className="
            mt-5
            rounded-lg
            border
            border-violet-400/15
            bg-violet-500/10
            px-4
            py-2
            text-xs
            font-medium
            text-violet-200
            transition
            hover:border-violet-400/30
            hover:bg-violet-500/15
          "
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default Leads;