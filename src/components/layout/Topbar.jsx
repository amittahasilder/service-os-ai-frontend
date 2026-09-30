import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const Topbar = () => {
  const { user, logout } = useAuth();

  const [searchFocused, setSearchFocused] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const userName = user?.name || "User";
  const userEmail = user?.email || "Workspace account";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <header className="relative h-16">
      {/* =====================================================
          GLASS TOPBAR
      ===================================================== */}

      <div className="absolute inset-0 border-b border-white/[0.07] bg-[#07070b]/70 backdrop-blur-2xl" />

      {/* Animated top gradient line */}
      <motion.div
        animate={{
          opacity: [0.35, 0.75, 0.35],
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "linear",
        }}
        className="
          pointer-events-none
          absolute
          left-0
          right-0
          top-0
          h-px
          bg-[linear-gradient(90deg,transparent,rgba(139,92,246,0.55),rgba(34,211,238,0.35),transparent)]
          bg-[length:200%_100%]
        "
      />

      {/* Ambient topbar glow */}
      <div className="pointer-events-none absolute left-1/4 top-0 h-24 w-72 -translate-y-1/2 rounded-full bg-violet-500/[0.035] blur-[60px]" />

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="relative z-10 flex h-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 xl:px-10">
        {/* ===================================================
            LEFT
        =================================================== */}

        <div className="flex min-w-0 items-center gap-3">
          {/* Mobile menu button */}
          <motion.button
            whileHover={{
              scale: 1.04,
              backgroundColor: "rgba(255,255,255,0.06)",
            }}
            whileTap={{ scale: 0.94 }}
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-white/[0.07]
              bg-white/[0.025]
              text-white/50
              transition-colors
              lg:hidden
            "
          >
            <div className="space-y-1">
              <span className="block h-[1.5px] w-4 bg-white/60" />
              <span className="block h-[1.5px] w-3 bg-white/40" />
              <span className="block h-[1.5px] w-4 bg-white/60" />
            </div>
          </motion.button>

          {/* Page title */}
          <div className="hidden min-w-0 sm:block">
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/25">
              Workspace
            </p>

            <motion.h2
              key={window.location.pathname}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-0.5 truncate text-sm font-semibold tracking-tight text-white"
            >
              Overview
            </motion.h2>
          </div>
        </div>

        {/* ===================================================
            CENTER SEARCH
        =================================================== */}

        <motion.div
          animate={{
            width: searchFocused ? "min(420px, 42vw)" : "min(360px, 36vw)",
          }}
          transition={{
            duration: 0.35,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative hidden md:block"
        >
          {/* Search glow */}
          <motion.div
            animate={{
              opacity: searchFocused ? 1 : 0,
              scale: searchFocused ? 1 : 0.96,
            }}
            transition={{ duration: 0.25 }}
            className="
              pointer-events-none
              absolute
              -inset-[1px]
              rounded-2xl
              bg-gradient-to-r
              from-violet-500/30
              via-purple-500/10
              to-cyan-400/20
              blur-md
            "
          />

          <div
            className={`
              group
              relative
              flex
              h-10
              items-center
              overflow-hidden
              rounded-2xl
              border
              bg-white/[0.025]
              backdrop-blur-xl
              transition-all
              duration-300
              ${
                searchFocused
                  ? "border-violet-400/25 shadow-[0_0_30px_rgba(139,92,246,0.08)]"
                  : "border-white/[0.07]"
              }
            `}
          >
            {/* Moving glass shine */}
            <motion.div
              animate={{
                x: ["-120%", "120%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatDelay: 4,
                ease: "easeInOut",
              }}
              className="
                pointer-events-none
                absolute
                inset-y-0
                w-1/3
                -skew-x-12
                bg-gradient-to-r
                from-transparent
                via-white/[0.035]
                to-transparent
              "
            />

            {/* Search icon */}
            <motion.div
              animate={{
                scale: searchFocused ? 1.08 : 1,
                color: searchFocused
                  ? "rgba(167,139,250,1)"
                  : "rgba(255,255,255,0.35)",
              }}
              className="relative z-10 ml-3.5 flex h-6 w-6 items-center justify-center text-sm"
            >
              ⌕
            </motion.div>

            <input
              type="text"
              placeholder="Search anything..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="
                relative
                z-10
                h-full
                min-w-0
                flex-1
                bg-transparent
                px-2.5
                text-xs
                text-white
                outline-none
                placeholder:text-white/25
              "
            />

            {/* Keyboard shortcut */}
            <div className="relative z-10 mr-2 hidden rounded-lg border border-white/[0.07] bg-white/[0.035] px-2 py-1 text-[9px] font-medium text-white/25 lg:block">
              ⌘ K
            </div>
          </div>
        </motion.div>

        {/* ===================================================
            RIGHT ACTIONS
        =================================================== */}

        <div className="flex shrink-0 items-center gap-2">
          {/* Status */}
          <motion.div
            whileHover={{
              y: -1,
              borderColor: "rgba(52,211,153,0.2)",
              backgroundColor: "rgba(52,211,153,0.05)",
            }}
            className="
              hidden
              items-center
              gap-2
              rounded-xl
              border
              border-white/[0.06]
              bg-white/[0.02]
              px-3
              py-2
              transition-all
              duration-300
              lg:flex
            "
          >
            <motion.span
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [0.9, 1.15, 0.9],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]"
            />

            <span className="text-[10px] font-medium text-white/35">
              All systems operational
            </span>
          </motion.div>

          {/* Notification */}
          <div className="relative">
            <motion.button
              type="button"
              onClick={() => setNotificationsOpen((value) => !value)}
              whileHover={{
                y: -2,
                scale: 1.03,
              }}
              whileTap={{ scale: 0.94 }}
              className={`
                relative
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                border
                bg-white/[0.025]
                backdrop-blur-xl
                transition-all
                duration-300
                ${
                  notificationsOpen
                    ? "border-violet-400/20 bg-violet-500/[0.07] shadow-[0_0_25px_rgba(139,92,246,0.1)]"
                    : "border-white/[0.07] hover:border-white/[0.12] hover:bg-white/[0.05]"
                }
              `}
            >
              <motion.span
                animate={
                  notificationsOpen
                    ? { rotate: 0 }
                    : { rotate: [0, -8, 8, -5, 5, 0] }
                }
                transition={{
                  duration: 1,
                  repeat: notificationsOpen ? 0 : Infinity,
                  repeatDelay: 7,
                }}
                className="text-sm text-white/55"
              >
                ♢
              </motion.span>

              {/* Notification badge */}
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_9px_rgba(167,139,250,0.9)]" />
            </motion.button>

            <AnimatePresence>
              {notificationsOpen && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -8,
                    scale: 0.96,
                    filter: "blur(4px)",
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    filter: "blur(0px)",
                  }}
                  exit={{
                    opacity: 0,
                    y: -8,
                    scale: 0.96,
                    filter: "blur(4px)",
                  }}
                  transition={{
                    duration: 0.2,
                    ease: "easeOut",
                  }}
                  className="
                    absolute
                    right-0
                    top-12
                    z-50
                    w-80
                    overflow-hidden
                    rounded-2xl
                    border
                    border-white/[0.09]
                    bg-[#09090e]/95
                    shadow-[0_25px_80px_rgba(0,0,0,0.55)]
                    backdrop-blur-2xl
                  "
                >
                  <div className="border-b border-white/[0.06] px-4 py-3">
                    <p className="text-xs font-semibold text-white">
                      Notifications
                    </p>

                    <p className="mt-1 text-[10px] text-white/30">
                      Your latest workspace activity
                    </p>
                  </div>

                  <div className="p-2">
                    <div className="rounded-xl p-3 transition-colors hover:bg-white/[0.035]">
                      <p className="text-xs font-medium text-white/70">
                        Welcome to ServiceOS
                      </p>

                      <p className="mt-1 text-[10px] text-white/30">
                        Your workspace is ready.
                      </p>
                    </div>

                    <div className="rounded-xl p-3 transition-colors hover:bg-white/[0.035]">
                      <p className="text-xs font-medium text-white/70">
                        Everything looks good
                      </p>

                      <p className="mt-1 text-[10px] text-white/30">
                        No critical issues detected.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Divider */}
          <div className="mx-1 hidden h-7 w-px bg-white/[0.07] sm:block" />

          {/* Profile */}
          <div className="relative">
            <motion.button
              type="button"
              onClick={() => setProfileOpen((value) => !value)}
              whileHover={{
                y: -2,
              }}
              whileTap={{
                scale: 0.97,
              }}
              className={`
                group
                flex
                items-center
                gap-2
                rounded-xl
                border
                p-1.5
                pr-2.5
                backdrop-blur-xl
                transition-all
                duration-300
                ${
                  profileOpen
                    ? "border-violet-400/20 bg-violet-500/[0.06]"
                    : "border-white/[0.07] bg-white/[0.025] hover:border-white/[0.12] hover:bg-white/[0.045]"
                }
              `}
            >
              <motion.div
                whileHover={{
                  scale: 1.06,
                  rotate: 2,
                }}
                className="
                  relative
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-lg
                  bg-gradient-to-br
                  from-violet-500/30
                  via-purple-500/20
                  to-cyan-400/10
                  text-xs
                  font-bold
                  text-violet-200
                  shadow-[0_0_20px_rgba(139,92,246,0.08)]
                "
              >
                {userInitial}

                {/* Avatar shine */}
                <motion.div
                  animate={{
                    x: ["-130%", "130%"],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatDelay: 5,
                  }}
                  className="
                    absolute
                    inset-y-0
                    w-1/2
                    -skew-x-12
                    bg-gradient-to-r
                    from-transparent
                    via-white/10
                    to-transparent
                  "
                />
              </motion.div>

              <div className="hidden max-w-28 text-left sm:block">
                <p className="truncate text-[11px] font-semibold text-white/75">
                  {userName}
                </p>

                <p className="truncate text-[9px] text-white/25">
                  {userEmail}
                </p>
              </div>

              <span
                className={`hidden text-[10px] text-white/25 transition-transform duration-300 sm:block ${
                  profileOpen ? "rotate-180" : ""
                }`}
              >
                ▾
              </span>
            </motion.button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -8,
                    scale: 0.96,
                    filter: "blur(4px)",
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    filter: "blur(0px)",
                  }}
                  exit={{
                    opacity: 0,
                    y: -8,
                    scale: 0.96,
                    filter: "blur(4px)",
                  }}
                  transition={{
                    duration: 0.2,
                    ease: "easeOut",
                  }}
                  className="
                    absolute
                    right-0
                    top-12
                    z-50
                    w-64
                    overflow-hidden
                    rounded-2xl
                    border
                    border-white/[0.09]
                    bg-[#09090e]/95
                    p-2
                    shadow-[0_25px_80px_rgba(0,0,0,0.55)]
                    backdrop-blur-2xl
                  "
                >
                  <div className="rounded-xl bg-white/[0.025] p-3">
                    <p className="truncate text-xs font-semibold text-white">
                      {userName}
                    </p>

                    <p className="mt-1 truncate text-[10px] text-white/30">
                      {userEmail}
                    </p>
                  </div>

                  <div className="my-2 h-px bg-white/[0.06]" />

                  <button
                    type="button"
                    className="flex w-full items-center rounded-xl px-3 py-2.5 text-left text-xs text-white/50 transition-all duration-300 hover:bg-white/[0.04] hover:text-white"
                  >
                    Profile
                  </button>

                  <button
                    type="button"
                    className="flex w-full items-center rounded-xl px-3 py-2.5 text-left text-xs text-white/50 transition-all duration-300 hover:bg-white/[0.04] hover:text-white"
                  >
                    Settings
                  </button>

                  <button
                    type="button"
                    onClick={logout}
                    className="flex w-full items-center rounded-xl px-3 py-2.5 text-left text-xs text-red-400/60 transition-all duration-300 hover:bg-red-500/[0.07] hover:text-red-300"
                  >
                    Sign out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;