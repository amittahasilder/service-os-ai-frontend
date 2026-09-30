import { Navigate, Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // ==========================================
  // AUTHENTICATION CHECK
  // ==========================================
  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050507]">
        {/* ==========================================
            AMBIENT BACKGROUND
        ========================================== */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[100px]" />

          <div className="absolute left-0 top-0 h-[300px] w-[300px] rounded-full bg-cyan-500/5 blur-[100px]" />

          <div className="absolute bottom-0 right-0 h-[350px] w-[350px] rounded-full bg-purple-600/5 blur-[100px]" />
        </div>

        {/* ==========================================
            LOADER CONTENT
        ========================================== */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: 0.45,
            ease: "easeOut",
          }}
          className="relative z-10 flex flex-col items-center"
        >
          {/* ========================================
              SERVICEOS LOGO
          ======================================== */}
          <motion.div
            animate={{
              scale: [1, 1.04, 1],
              boxShadow: [
                "0 0 0 rgba(139,92,246,0)",
                "0 0 45px rgba(139,92,246,0.25)",
                "0 0 0 rgba(139,92,246,0)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-2xl
              border
              border-white/10
              bg-white/[0.04]
              backdrop-blur-xl
            "
          >
            <span
              className="
                bg-gradient-to-r
                from-violet-400
                via-purple-400
                to-cyan-400
                bg-clip-text
                text-2xl
                font-black
                text-transparent
              "
            >
              S
            </span>
          </motion.div>

          {/* ========================================
              BRAND
          ======================================== */}
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.12,
              duration: 0.4,
            }}
            className="
              mt-5
              text-lg
              font-semibold
              tracking-tight
              text-white
            "
          >
            ServiceOS
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 0.22,
              duration: 0.4,
            }}
            className="mt-1 text-sm text-white/40"
          >
            Preparing your workspace...
          </motion.p>

          {/* ========================================
              LOADING BAR
          ======================================== */}
          <div className="mt-6 h-[2px] w-40 overflow-hidden rounded-full bg-white/5">
            <motion.div
              animate={{
                x: ["-100%", "200%"],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="
                h-full
                w-1/2
                rounded-full
                bg-gradient-to-r
                from-transparent
                via-violet-400
                to-transparent
              "
            />
          </div>
        </motion.div>
      </div>
    );
  }

  // ==========================================
  // USER IS NOT AUTHENTICATED
  // ==========================================
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  // ==========================================
  // USER IS AUTHENTICATED
  // ==========================================
  return <Outlet />;
};

export default ProtectedRoute;