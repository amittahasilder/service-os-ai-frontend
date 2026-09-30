import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useOrganization } from "../../context/OrganizationContext";

// =====================================================
// NAVIGATION ITEMS
// =====================================================

const navItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: "⌂",
  },
  {
    label: "Leads",
    path: "/leads",
    icon: "◈",
  },
  {
    label: "Customers",
    path: "/customers",
    icon: "◎",
  },
  {
    label: "Services",
    path: "/services",
    icon: "◇",
  },
  {
    label: "Staff",
    path: "/staff",
    icon: "♙",
  },
  {
    label: "Bookings",
    path: "/bookings",
    icon: "◫",
  },
  {
    label: "Jobs",
    path: "/jobs",
    icon: "◆",
  },
  {
    label: "Quotes",
    path: "/quotes",
    icon: "◌",
  },
  {
    label: "Invoices",
    path: "/invoices",
    icon: "▤",
  },
];

// =====================================================
// ORGANIZATION HELPERS
// =====================================================

const getOrganizationName = (organization) => {
  return (
    organization?.name ||
    organization?.businessName ||
    "Unnamed Business"
  );
};

const getOrganizationInitial = (organization) => {
  const name = getOrganizationName(organization);

  return name
    .trim()
    .charAt(0)
    .toUpperCase();
};

const getBusinessType = (organization) => {
  if (!organization?.businessType) {
    return "Business";
  }

  return organization.businessType
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

// =====================================================
// SIDEBAR
// =====================================================

const Sidebar = () => {
  const { user, logout } = useAuth();

  const {
    organizations,
    currentOrganization,
    switchOrganization,
    loading: organizationLoading,
  } = useOrganization();

  const [workspaceOpen, setWorkspaceOpen] = useState(false);

  const workspaceRef = useRef(null);

  // ===================================================
  // CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  // ===================================================

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        workspaceRef.current &&
        !workspaceRef.current.contains(event.target)
      ) {
        setWorkspaceOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  // ===================================================
  // ORGANIZATION SWITCH
  // ===================================================

  const handleOrganizationSwitch = (organization) => {
    switchOrganization(organization);
    setWorkspaceOpen(false);
  };

  return (
    <>
      {/* =====================================================
          DESKTOP SIDEBAR
      ===================================================== */}

      <aside className="fixed inset-y-0 left-0 z-50 hidden w-72 p-3 lg:block">
        <motion.div
          initial={{
            opacity: 0,
            x: -25,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            relative
            flex
            h-full
            flex-col
            overflow-hidden
            rounded-[26px]
            border
            border-white/[0.08]
            bg-[#08080d]/75
            shadow-[0_25px_80px_rgba(0,0,0,0.45)]
            backdrop-blur-2xl
          "
        >
          {/* =================================================
              GLOBAL GLASS LIGHT
          ================================================= */}

          <div className="pointer-events-none absolute inset-0">
            <div
              className="
                absolute
                left-0
                top-0
                h-40
                w-full
                bg-gradient-to-b
                from-violet-500/[0.07]
                to-transparent
              "
            />

            <div
              className="
                absolute
                -left-20
                top-20
                h-40
                w-40
                rounded-full
                bg-violet-500/[0.08]
                blur-[80px]
              "
            />

            <div
              className="
                absolute
                bottom-0
                right-0
                h-48
                w-48
                rounded-full
                bg-cyan-500/[0.025]
                blur-[90px]
              "
            />

            <div
              className="
                absolute
                inset-y-0
                right-0
                w-px
                bg-gradient-to-b
                from-transparent
                via-white/[0.08]
                to-transparent
              "
            />
          </div>

          {/* =================================================
              BRAND
          ================================================= */}

          <div
            className="
              relative
              flex
              h-20
              shrink-0
              items-center
              border-b
              border-white/[0.06]
              px-5
            "
          >
            <motion.div
              whileHover={{
                scale: 1.06,
                rotate: 2,
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 18,
              }}
              className="
                relative
                flex
                h-11
                w-11
                items-center
                justify-center
                overflow-hidden
                rounded-2xl
                border
                border-violet-400/20
                bg-gradient-to-br
                from-violet-500/15
                to-cyan-500/5
                shadow-[0_0_35px_rgba(139,92,246,0.12)]
              "
            >
              <motion.div
                animate={{
                  x: ["-120%", "120%"],
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: "easeInOut",
                }}
                className="
                  absolute
                  inset-y-0
                  w-1/2
                  rotate-12
                  bg-gradient-to-r
                  from-transparent
                  via-white/10
                  to-transparent
                  blur-sm
                "
              />

              <span
                className="
                  relative
                  z-10
                  bg-gradient-to-br
                  from-violet-300
                  via-purple-400
                  to-cyan-300
                  bg-clip-text
                  text-xl
                  font-black
                  text-transparent
                "
              >
                S
              </span>
            </motion.div>

            <div className="ml-3 min-w-0">
              <h1
                className="
                  truncate
                  text-[15px]
                  font-bold
                  tracking-tight
                  text-white
                "
              >
                ServiceOS
              </h1>

              <p
                className="
                  mt-0.5
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.18em]
                  text-white/30
                "
              >
                Business Operating System
              </p>
            </div>
          </div>

          {/* =================================================
              REAL WORKSPACE SWITCHER
          ================================================= */}

          <div
            ref={workspaceRef}
            className="relative px-4 pt-5"
          >
            {/* =================================================
                WORKSPACE BUTTON
            ================================================= */}

            <motion.button
              type="button"
              onClick={() =>
                setWorkspaceOpen((previous) => !previous)
              }
              whileHover={{
                y: -1,
              }}
              whileTap={{
                scale: 0.985,
              }}
              transition={{
                type: "spring",
                stiffness: 350,
                damping: 25,
              }}
              className={`
                group
                relative
                flex
                w-full
                items-center
                rounded-2xl
                border
                p-3
                text-left
                shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]
                transition-all
                duration-300
                ${
                  workspaceOpen
                    ? "border-violet-400/20 bg-white/[0.05]"
                    : "border-white/[0.06] bg-white/[0.025] hover:border-violet-400/20 hover:bg-white/[0.045]"
                }
              `}
            >
              {/* Business avatar */}

              <div
                className="
                  relative
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-xl
                  border
                  border-violet-400/10
                  bg-gradient-to-br
                  from-violet-500/20
                  to-cyan-500/10
                  text-sm
                  font-bold
                  text-violet-300
                "
              >
                {organizationLoading
                  ? (
                    <motion.div
                      animate={{
                        rotate: 360,
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="
                        h-4
                        w-4
                        rounded-full
                        border
                        border-violet-300/20
                        border-t-violet-300
                      "
                    />
                  )
                  : (
                    getOrganizationInitial(
                      currentOrganization
                    )
                  )}

                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-tr
                    from-transparent
                    via-white/[0.07]
                    to-transparent
                    opacity-0
                    transition-opacity
                    duration-300
                    group-hover:opacity-100
                  "
                />
              </div>

              {/* Business information */}

              <div className="ml-3 min-w-0 flex-1">
                <p
                  className="
                    text-[10px]
                    uppercase
                    tracking-widest
                    text-white/25
                  "
                >
                  Workspace
                </p>

                <p
                  className="
                    mt-0.5
                    truncate
                    text-xs
                    font-semibold
                    text-white/80
                  "
                >
                  {organizationLoading
                    ? "Loading workspace..."
                    : getOrganizationName(
                        currentOrganization
                      )}
                </p>
              </div>

              {/* Dropdown arrow */}

              <motion.span
                animate={{
                  rotate: workspaceOpen ? 90 : 0,
                }}
                transition={{
                  duration: 0.2,
                }}
                className="
                  text-sm
                  text-white/30
                  transition-colors
                  duration-300
                  group-hover:text-white/60
                "
              >
                ›
              </motion.span>
            </motion.button>

            {/* =================================================
                ORGANIZATION DROPDOWN
            ================================================= */}

            <AnimatePresence>
              {workspaceOpen && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -8,
                    scale: 0.97,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    y: -6,
                    scale: 0.98,
                  }}
                  transition={{
                    duration: 0.2,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="
                    absolute
                    left-4
                    right-4
                    top-[calc(100%+8px)]
                    z-[100]
                    overflow-hidden
                    rounded-2xl
                    border
                    border-white/[0.09]
                    bg-[#0b0b12]/95
                    shadow-[0_25px_70px_rgba(0,0,0,0.6)]
                    backdrop-blur-2xl
                  "
                >
                  {/* Dropdown top glow */}

                  <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-violet-500/[0.08] to-transparent" />

                  {/* Header */}

                  <div className="relative border-b border-white/[0.06] px-3 py-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p
                          className="
                            text-[9px]
                            font-semibold
                            uppercase
                            tracking-[0.2em]
                            text-white/25
                          "
                        >
                          Your Workspaces
                        </p>

                        <p className="mt-1 text-[11px] text-white/40">
                          Select a business
                        </p>
                      </div>

                      <span
                        className="
                          rounded-lg
                          border
                          border-white/[0.06]
                          bg-white/[0.025]
                          px-2
                          py-1
                          text-[9px]
                          font-medium
                          text-white/30
                        "
                      >
                        {organizations.length}
                      </span>
                    </div>
                  </div>

                  {/* Organizations */}

                  <div className="relative max-h-64 overflow-y-auto p-2 [scrollbar-width:none]">
                    {organizationLoading ? (
                      <div className="space-y-2 p-1">
                        {[1, 2, 3].map((item) => (
                          <div
                            key={item}
                            className="
                              flex
                              items-center
                              gap-3
                              rounded-xl
                              border
                              border-white/[0.04]
                              bg-white/[0.02]
                              p-2.5
                            "
                          >
                            <div className="h-9 w-9 animate-pulse rounded-xl bg-white/[0.06]" />

                            <div className="flex-1 space-y-1.5">
                              <div className="h-2.5 w-2/3 animate-pulse rounded bg-white/[0.06]" />
                              <div className="h-2 w-1/3 animate-pulse rounded bg-white/[0.04]" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : organizations.length === 0 ? (
                      <div className="px-3 py-7 text-center">
                        <div
                          className="
                            mx-auto
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-white/[0.06]
                            bg-white/[0.025]
                            text-sm
                            text-white/30
                          "
                        >
                          +
                        </div>

                        <p className="mt-3 text-xs font-medium text-white/55">
                          No workspaces yet
                        </p>

                        <p className="mt-1 text-[10px] text-white/25">
                          Create a business to get started.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {organizations.map(
                          (organization) => {
                            const isSelected =
                              String(
                                currentOrganization?._id
                              ) ===
                              String(organization?._id);

                            return (
                              <motion.button
                                key={organization._id}
                                type="button"
                                onClick={() =>
                                  handleOrganizationSwitch(
                                    organization
                                  )
                                }
                                whileHover={{
                                  x: 2,
                                }}
                                whileTap={{
                                  scale: 0.985,
                                }}
                                className={`
                                  group
                                  relative
                                  flex
                                  w-full
                                  items-center
                                  overflow-hidden
                                  rounded-xl
                                  border
                                  p-2.5
                                  text-left
                                  transition-all
                                  duration-200
                                  ${
                                    isSelected
                                      ? "border-violet-400/15 bg-violet-500/[0.09]"
                                      : "border-transparent hover:border-white/[0.06] hover:bg-white/[0.035]"
                                  }
                                `}
                              >
                                {/* Selected background */}

                                {isSelected && (
                                  <motion.div
                                    layoutId="selectedOrganization"
                                    className="
                                      absolute
                                      inset-0
                                      bg-gradient-to-r
                                      from-violet-500/[0.08]
                                      to-transparent
                                    "
                                  />
                                )}

                                {/* Avatar */}

                                <div
                                  className={`
                                    relative
                                    z-10
                                    flex
                                    h-9
                                    w-9
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    border
                                    text-xs
                                    font-bold
                                    ${
                                      isSelected
                                        ? "border-violet-400/20 bg-violet-500/15 text-violet-200"
                                        : "border-white/[0.06] bg-white/[0.035] text-white/45 group-hover:text-violet-300"
                                    }
                                  `}
                                >
                                  {getOrganizationInitial(
                                    organization
                                  )}
                                </div>

                                {/* Details */}

                                <div className="relative z-10 ml-3 min-w-0 flex-1">
                                  <p
                                    className={`
                                      truncate
                                      text-xs
                                      font-semibold
                                      ${
                                        isSelected
                                          ? "text-white"
                                          : "text-white/65"
                                      }
                                    `}
                                  >
                                    {getOrganizationName(
                                      organization
                                    )}
                                  </p>

                                  <p className="mt-0.5 truncate text-[9px] text-white/25">
                                    {getBusinessType(
                                      organization
                                    )}
                                  </p>
                                </div>

                                {/* Active indicator */}

                                {isSelected && (
                                  <motion.div
                                    initial={{
                                      scale: 0,
                                      opacity: 0,
                                    }}
                                    animate={{
                                      scale: 1,
                                      opacity: 1,
                                    }}
                                    className="
                                      relative
                                      z-10
                                      mr-1
                                      flex
                                      h-5
                                      w-5
                                      items-center
                                      justify-center
                                      rounded-full
                                      border
                                      border-violet-300/20
                                      bg-violet-400/10
                                      text-[9px]
                                      text-violet-300
                                    "
                                  >
                                    ✓
                                  </motion.div>
                                )}
                              </motion.button>
                            );
                          }
                        )}
                      </div>
                    )}
                  </div>

                  {/* Footer */}

                  <div className="border-t border-white/[0.06] p-2">
                    <button
                      type="button"
                      onClick={() => {
                        setWorkspaceOpen(false);
                        // Organization creation UI will be added later.
                      }}
                      className="
                        flex
                        w-full
                        items-center
                        rounded-xl
                        border
                        border-transparent
                        px-3
                        py-2.5
                        text-left
                        text-[11px]
                        font-medium
                        text-white/35
                        transition-all
                        duration-200
                        hover:border-violet-400/10
                        hover:bg-violet-500/[0.05]
                        hover:text-violet-300
                      "
                    >
                      <span className="mr-2 text-sm">+</span>

                      Create new workspace

                      <span className="ml-auto text-white/20">
                        →
                      </span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* =================================================
              NAVIGATION
          ================================================= */}

          <nav
            className="
              relative
              mt-5
              flex-1
              overflow-y-auto
              px-3
              pb-4
              [scrollbar-width:none]
            "
          >
            <p
              className="
                mb-2
                px-3
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.2em]
                text-white/20
              "
            >
              Workspace
            </p>

            <div className="space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className="group relative block rounded-xl"
                >
                  {({ isActive }) => (
                    <motion.div
                      initial={false}
                      whileHover={{
                        x: 3,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 450,
                        damping: 28,
                      }}
                      className={`
                        relative
                        flex
                        items-center
                        overflow-hidden
                        rounded-xl
                        px-3
                        py-2.5
                        ${
                          isActive
                            ? "text-white"
                            : "text-white/45"
                        }
                      `}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeSidebarItem"
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 32,
                          }}
                          className="
                            absolute
                            inset-0
                            rounded-xl
                            border
                            border-violet-400/15
                            bg-gradient-to-r
                            from-violet-500/[0.13]
                            via-purple-500/[0.07]
                            to-transparent
                            shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_8px_25px_rgba(139,92,246,0.08)]
                          "
                        />
                      )}

                      <div
                        className="
                          pointer-events-none
                          absolute
                          inset-0
                          rounded-xl
                          bg-white/[0.025]
                          opacity-0
                          transition-opacity
                          duration-300
                          group-hover:opacity-100
                        "
                      />

                      {isActive && (
                        <motion.div
                          layoutId="activeSidebarIndicator"
                          className="
                            absolute
                            left-0
                            h-6
                            w-[3px]
                            rounded-r-full
                            bg-gradient-to-b
                            from-violet-300
                            via-violet-500
                            to-cyan-400
                            shadow-[0_0_14px_rgba(139,92,246,0.8)]
                          "
                        />
                      )}

                      <motion.div
                        animate={
                          isActive
                            ? {
                                scale: [1, 1.06, 1],
                              }
                            : {}
                        }
                        transition={{
                          duration: 2,
                          repeat: isActive
                            ? Infinity
                            : 0,
                          ease: "easeInOut",
                        }}
                        className={`
                          relative
                          z-10
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          border
                          text-sm
                          transition-all
                          duration-300
                          ${
                            isActive
                              ? "border-violet-400/15 bg-violet-400/10 text-violet-300 shadow-[0_0_18px_rgba(139,92,246,0.1)]"
                              : "border-transparent text-white/35 group-hover:border-white/[0.06] group-hover:bg-white/[0.04] group-hover:text-white/75"
                          }
                        `}
                      >
                        {item.icon}
                      </motion.div>

                      <span
                        className="
                          relative
                          z-10
                          ml-3
                          flex-1
                          text-[13px]
                          font-medium
                        "
                      >
                        {item.label}
                      </span>

                      {isActive && (
                        <motion.span
                          initial={{
                            opacity: 0,
                            scale: 0,
                          }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                          }}
                          className="
                            relative
                            z-10
                            h-1.5
                            w-1.5
                            rounded-full
                            bg-violet-300
                            shadow-[0_0_10px_rgba(167,139,250,0.9)]
                          "
                        />
                      )}

                      {!isActive && (
                        <span
                          className="
                            relative
                            z-10
                            translate-x-1
                            text-xs
                            text-white/0
                            transition-all
                            duration-300
                            group-hover:translate-x-0
                            group-hover:text-white/25
                          "
                        >
                          →
                        </span>
                      )}
                    </motion.div>
                  )}
                </NavLink>
              ))}
            </div>

            {/* =================================================
                SYSTEM
            ================================================= */}

            <p
              className="
                mb-2
                mt-7
                px-3
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.2em]
                text-white/20
              "
            >
              System
            </p>

            <NavLink
              to="/settings"
              className="group relative block rounded-xl"
            >
              {({ isActive }) => (
                <motion.div
                  initial={false}
                  whileHover={{
                    x: 3,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 450,
                    damping: 28,
                  }}
                  className={`
                    relative
                    flex
                    items-center
                    overflow-hidden
                    rounded-xl
                    px-3
                    py-2.5
                    ${
                      isActive
                        ? "text-white"
                        : "text-white/45"
                    }
                  `}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeSidebarSystem"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 32,
                      }}
                      className="
                        absolute
                        inset-0
                        rounded-xl
                        border
                        border-violet-400/15
                        bg-gradient-to-r
                        from-violet-500/[0.13]
                        via-purple-500/[0.07]
                        to-transparent
                        shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_8px_25px_rgba(139,92,246,0.08)]
                      "
                    />
                  )}

                  <div
                    className="
                      pointer-events-none
                      absolute
                      inset-0
                      rounded-xl
                      bg-white/[0.025]
                      opacity-0
                      transition-opacity
                      duration-300
                      group-hover:opacity-100
                    "
                  />

                  {isActive && (
                    <motion.div
                      layoutId="activeSidebarSystemIndicator"
                      className="
                        absolute
                        left-0
                        h-6
                        w-[3px]
                        rounded-r-full
                        bg-gradient-to-b
                        from-violet-300
                        via-violet-500
                        to-cyan-400
                        shadow-[0_0_14px_rgba(139,92,246,0.8)]
                      "
                    />
                  )}

                  <div
                    className={`
                      relative
                      z-10
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      border
                      text-sm
                      transition-all
                      duration-300
                      ${
                        isActive
                          ? "border-violet-400/15 bg-violet-400/10 text-violet-300 shadow-[0_0_18px_rgba(139,92,246,0.1)]"
                          : "border-transparent text-white/35 group-hover:border-white/[0.06] group-hover:bg-white/[0.04] group-hover:text-white/75"
                      }
                    `}
                  >
                    ⚙
                  </div>

                  <span
                    className="
                      relative
                      z-10
                      ml-3
                      flex-1
                      text-[13px]
                      font-medium
                    "
                  >
                    Settings
                  </span>

                  {isActive && (
                    <motion.span
                      initial={{
                        opacity: 0,
                        scale: 0,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                      }}
                      className="
                        relative
                        z-10
                        h-1.5
                        w-1.5
                        rounded-full
                        bg-violet-300
                        shadow-[0_0_10px_rgba(167,139,250,0.9)]
                      "
                    />
                  )}
                </motion.div>
              )}
            </NavLink>
          </nav>

          {/* =================================================
              USER AREA
          ================================================= */}

          <div className="relative border-t border-white/[0.06] p-3">
            <motion.div
              whileHover={{
                y: -2,
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
              }}
              className="
                group
                flex
                items-center
                rounded-2xl
                border
                border-white/[0.06]
                bg-white/[0.025]
                p-2.5
                shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]
                transition-all
                duration-300
                hover:border-white/[0.1]
                hover:bg-white/[0.04]
              "
            >
              <div
                className="
                  relative
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-xl
                  border
                  border-violet-400/10
                  bg-gradient-to-br
                  from-violet-500/25
                  to-cyan-500/10
                  text-xs
                  font-bold
                  text-violet-200
                "
              >
                {(user?.name || "U")
                  .charAt(0)
                  .toUpperCase()}

                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-tr
                    from-transparent
                    via-white/[0.08]
                    to-transparent
                    opacity-0
                    transition-opacity
                    duration-300
                    group-hover:opacity-100
                  "
                />
              </div>

              <div className="ml-2.5 min-w-0 flex-1">
                <p
                  className="
                    truncate
                    text-xs
                    font-semibold
                    text-white/80
                  "
                >
                  {user?.name || "User"}
                </p>

                <p
                  className="
                    truncate
                    text-[10px]
                    text-white/30
                  "
                >
                  {user?.email || "Workspace account"}
                </p>
              </div>

              <button
                type="button"
                onClick={logout}
                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  text-white/25
                  transition-all
                  duration-300
                  hover:bg-red-500/10
                  hover:text-red-300
                  active:scale-95
                "
                title="Logout"
              >
                ↪
              </button>
            </motion.div>

            <p
              className="
                mt-2
                text-center
                text-[9px]
                tracking-wide
                text-white/15
              "
            >
              ServiceOS · Business OS
            </p>
          </div>
        </motion.div>
      </aside>

      {/* =====================================================
          MOBILE TOP NAV
      ===================================================== */}

      <div className="fixed left-3 right-3 top-3 z-50 lg:hidden">
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
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            flex
            h-14
            items-center
            rounded-2xl
            border
            border-white/[0.08]
            bg-[#08080d]/80
            px-3
            shadow-[0_15px_50px_rgba(0,0,0,0.35)]
            backdrop-blur-2xl
          "
        >
          <div
            className="
              relative
              flex
              h-9
              w-9
              items-center
              justify-center
              overflow-hidden
              rounded-xl
              border
              border-violet-400/15
              bg-violet-500/10
            "
          >
            <span
              className="
                bg-gradient-to-r
                from-violet-300
                to-cyan-300
                bg-clip-text
                text-sm
                font-black
                text-transparent
              "
            >
              S
            </span>
          </div>

          <div className="ml-3">
            <p className="text-xs font-bold text-white">
              ServiceOS
            </p>

            <p
              className="
                text-[9px]
                uppercase
                tracking-widest
                text-white/25
              "
            >
              Business OS
            </p>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span className="text-[9px] font-medium text-white/25">
              Online
            </span>

            <div
              className="
                h-2
                w-2
                rounded-full
                bg-emerald-400
                shadow-[0_0_10px_rgba(52,211,153,0.8)]
              "
            />
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Sidebar;