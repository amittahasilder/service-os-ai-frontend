import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

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
              GLASS LIGHT
          ================================================= */}

          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-0 top-0 h-40 w-full bg-gradient-to-b from-violet-500/[0.07] to-transparent" />

            <div className="absolute -left-20 top-20 h-40 w-40 rounded-full bg-violet-500/[0.08] blur-[80px]" />

            <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-cyan-500/[0.025] blur-[90px]" />
          </div>

          {/* =================================================
              BRAND
          ================================================= */}

          <div className="relative flex h-20 shrink-0 items-center border-b border-white/[0.06] px-5">
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
              {/* Logo shine */}
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
              <h1 className="truncate text-[15px] font-bold tracking-tight text-white">
                ServiceOS
              </h1>

              <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-white/30">
                Business Operating System
              </p>
            </div>
          </div>

          {/* =================================================
              WORKSPACE
          ================================================= */}

          <div className="relative px-4 pt-5">
            <motion.div
              whileHover={{
                borderColor: "rgba(167,139,250,0.22)",
                backgroundColor: "rgba(255,255,255,0.045)",
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
                transition-all
                duration-300
              "
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/10 text-sm font-bold text-violet-300">
                B
              </div>

              <div className="ml-3 min-w-0 flex-1">
                <p className="text-[10px] uppercase tracking-widest text-white/25">
                  Workspace
                </p>

                <p className="mt-0.5 truncate text-xs font-semibold text-white/75">
                  My Business
                </p>
              </div>

              <span className="text-xs text-white/25 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-white/50">
                ›
              </span>
            </motion.div>
          </div>

          {/* =================================================
              NAVIGATION
          ================================================= */}

          <nav className="relative mt-5 flex-1 overflow-y-auto px-3 pb-4 [scrollbar-width:none]">
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/20">
              Workspace
            </p>

            <div className="space-y-1">
              {navItems.map((item, index) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `group relative block rounded-xl ${
                      isActive ? "text-white" : "text-white/45"
                    }`
                  }
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
                      className="relative flex items-center overflow-hidden rounded-xl px-3 py-2.5"
                    >
                      {/* Active glass background */}
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

                      {/* Hover glass */}
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

                      {/* Active left indicator */}
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

                      {/* Icon */}
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

                      {/* Label */}
                      <span className="relative z-10 ml-3 flex-1 text-[13px] font-medium">
                        {item.label}
                      </span>

                      {/* Active dot */}
                      {isActive && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="relative z-10 h-1.5 w-1.5 rounded-full bg-violet-300 shadow-[0_0_10px_rgba(167,139,250,0.9)]"
                        />
                      )}

                      {/* Hover arrow */}
                      {!isActive && (
                        <span className="relative z-10 translate-x-1 text-xs text-white/0 transition-all duration-300 group-hover:translate-x-0 group-hover:text-white/25">
                          →
                        </span>
                      )}
                    </motion.div>
                  )}
                </NavLink>
              ))}
            </div>

            {/* More section */}
            <p className="mb-2 mt-7 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/20">
              System
            </p>

            <NavLink
              to="/settings"
              className="group relative block rounded-xl text-white/45"
            >
              <motion.div
                whileHover={{ x: 3 }}
                transition={{
                  type: "spring",
                  stiffness: 450,
                  damping: 28,
                }}
                className="flex items-center rounded-xl px-3 py-2.5 transition-colors duration-300 group-hover:bg-white/[0.025] group-hover:text-white/75"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-sm transition-all duration-300 group-hover:border-white/[0.06] group-hover:bg-white/[0.04]">
                  ⚙
                </div>

                <span className="ml-3 text-[13px] font-medium">
                  Settings
                </span>
              </motion.div>
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
              <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-violet-500/25 to-cyan-500/10 text-xs font-bold text-violet-200">
                {(user?.name || "U").charAt(0).toUpperCase()}

                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.08] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>

              <div className="ml-2.5 min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-white/80">
                  {user?.name || "User"}
                </p>

                <p className="truncate text-[10px] text-white/30">
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

            <p className="mt-2 text-center text-[9px] tracking-wide text-white/15">
              ServiceOS · Business OS
            </p>
          </div>
        </motion.div>
      </aside>

      {/* =====================================================
          MOBILE TOP NAV
      ===================================================== */}

      <div className="fixed left-3 right-3 top-3 z-50 lg:hidden">
        <div className="flex h-14 items-center rounded-2xl border border-white/[0.08] bg-[#08080d]/80 px-3 shadow-[0_15px_50px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-500/10">
            <span className="bg-gradient-to-r from-violet-300 to-cyan-300 bg-clip-text text-sm font-black text-transparent">
              S
            </span>
          </div>

          <div className="ml-3">
            <p className="text-xs font-bold text-white">
              ServiceOS
            </p>

            <p className="text-[9px] uppercase tracking-widest text-white/25">
              Business OS
            </p>
          </div>

          <div className="ml-auto h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
        </div>
      </div>
    </>
  );
};

export default Sidebar;