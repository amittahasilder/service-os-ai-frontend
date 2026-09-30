import { motion } from "framer-motion";

const StatCard = ({ title, value, change, description }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl"
    >
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-purple-500/10 blur-3xl transition group-hover:bg-purple-500/20" />

      <p className="relative text-sm text-gray-500">
        {title}
      </p>

      <h3 className="relative mt-3 text-3xl font-bold tracking-tight">
        {value}
      </h3>

      <div className="relative mt-3 flex items-center gap-2">
        <span className="text-sm text-emerald-400">
          {change}
        </span>

        <span className="text-xs text-gray-600">
          {description}
        </span>
      </div>
    </motion.div>
  );
};

export default StatCard;