import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

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
// SIDEBAR
// =====================================================

const Sidebar = () => {
  const { user, logout } = useAuth();

  return (
    <>
      {/* =====================================================
          DESKTOP SIDEBAR
      ===================================================== */}

      <aside className="fixed inset-y-0 left-0 z-50 hidden w-72 p-3 lg:block">
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: 1, x: 0 }}
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
            {/* Top glow */}
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

            {/* Purple ambient glow */}
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

            {/* Cyan ambient glow */}
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

            {/* Subtle vertical shine */}
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
            {/* Logo */}
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
              {/* Logo shine animation */}
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

              {/* Logo letter */}
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

            {/* Brand text */}
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
              WORKSPACE SWITCHER
          ================================================= */}

          <div className="relative px-4 pt-5">
            <motion.div
              whileHover={{
                y: -1,
                borderColor: "rgba(167,139,250,0.22)",
                backgroundColor: "rgba(255,255,255,0.045)",
              }}
              transition={{
                type: "spring",
                stiffness: 350,
                damping: 25,
              }}
              className="
                group
                flex
                cursor-pointer
                items-center
                rounded-2xl
                border
                border-white/[0.06]
                bg-white/[0.025]
                p-3
                shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]
                transition-all
                duration-300
              "
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
                B

                {/* shine */}
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
                    text-white/75
                  "
                >
                  My Business
                </p>
              </div>

              {/* Arrow */}
              <span
                className="
                  text-xs
                  text-white/25
                  transition-all
                  duration-300
                  group-hover:translate-x-0.5
                  group-hover:text-white/50
                "
              >
                ›
              </span>
            </motion.div>
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
            {/* Workspace label */}
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

            {/* Navigation items */}
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
                      {/* ======================================
                          ACTIVE GLASS BACKGROUND
                      ====================================== */}

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

                      {/* ======================================
                          HOVER GLASS
                      ====================================== */}

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

                      {/* ======================================
                          ACTIVE LEFT INDICATOR
                      ====================================== */}

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

                      {/* ======================================
                          ICON
                      ====================================== */}

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
                          repeat: isActive ? Infinity : 0,
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

                      {/* ======================================
                          LABEL
                      ====================================== */}

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

                      {/* ======================================
                          ACTIVE DOT
                      ====================================== */}

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

                      {/* ======================================
                          HOVER ARROW
                      ====================================== */}

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
                SYSTEM SECTION
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

            {/* Settings */}
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
                  {/* Active background */}
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

                  {/* Hover background */}
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

                  {/* Active indicator */}
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

                  {/* Icon */}
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

                  {/* Label */}
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

                  {/* Active dot */}
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
              {/* User avatar */}
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

                {/* Avatar shine */}
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

              {/* User info */}
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

              {/* Logout */}
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

            {/* Footer */}
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
          {/* Mobile logo */}
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

          {/* Mobile brand */}
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

          {/* Online indicator */}
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