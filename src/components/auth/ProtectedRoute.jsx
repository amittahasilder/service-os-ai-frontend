import { Navigate, Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // ================================
  // AUTH CHECK LOADING
  // ================================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#050507] flex items-center justify-center overflow-hidden relative">
        {/* Ambient Glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-[320px] h-[320px] rounded-full bg-violet-600/10 blur-[100px]" />
          </div>

          <div className="absolute top-0 left-0 w-[300px] h-[300px] rounded-full bg-cyan-500/5 blur-[100px]" />

          <div className="absolute bottom-0 right-0 w-[350px] h-[350px] rounded-full bg-purple-600/5 blur-[100px]" />
        </div>

        {/* Loader */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 flex flex-col items-center"
        >
          {/* Logo */}
          <motion.div
            animate={{
              scale: [1, 1.04, 1],
              boxShadow: [
                "0 0 0 rgba(139,92,246,0)",
                "0 0 40px rgba(139,92,246,0.25)",
                "0 0 0 rgba(139,92,246,0)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="
              w-16
              h-16
              rounded-2xl
              flex
              items-center
              justify-center
              bg-white/[0.04]
              border
              border-white/10
              backdrop-blur-xl
            "
          >
            <span className="text-2xl font-black bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              S
            </span>
          </motion.div>

          {/* Brand */}
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
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
            transition={{ delay: 0.25 }}
            className="mt-1 text-sm text-white/40"
          >
            Preparing your workspace...
          </motion.p>

          {/* Loading Line */}
          <div className="mt-6 w-40 h-[2px] overflow-hidden rounded-full bg-white/5">
            <motion.div
              animate={{ x: ["-100%", "100%"] }}
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

  // ================================
  // NOT AUTHENTICATED
  // ================================
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // ================================
  // AUTHENTICATED
  // ================================
  return <Outlet />;
};

export default ProtectedRoute;