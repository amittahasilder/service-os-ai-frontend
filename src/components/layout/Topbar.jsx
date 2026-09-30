import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

const Topbar = () => {
  const { user } = useAuth();

  return (
    <motion.header
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="sticky top-0 z-30 border-b border-white/10 bg-[#050505]/80 backdrop-blur-2xl"
    >
      <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">

        <div>
          <p className="text-xs text-gray-500">
            ServiceOS
          </p>

          <h2 className="text-lg font-semibold">
            Dashboard
          </h2>
        </div>

        <div className="flex items-center gap-4">

          <button className="hidden rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 transition hover:bg-white/10 sm:block">
            + New
          </button>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-sm font-bold">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

        </div>
      </div>
    </motion.header>
  );
};

export default Topbar;