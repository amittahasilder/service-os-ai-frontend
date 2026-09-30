import { motion } from "framer-motion";

const menuItems = [
  "Dashboard",
  "Leads",
  "Customers",
  "Services",
  "Staff",
  "Bookings",
  "Jobs",
  "Quotes",
  "Invoices",
  "Payments",
];

const Sidebar = () => {
  return (
    <motion.aside
      initial={{ x: -30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed left-0 top-0 z-40 hidden h-screen w-72 border-r border-white/10 bg-[#080808]/95 backdrop-blur-2xl lg:block"
    >
      <div className="flex h-full flex-col">

        {/* Logo */}
        <div className="flex h-20 items-center border-b border-white/10 px-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Service<span className="text-purple-500">OS</span>
            </h1>

            <p className="mt-1 text-xs text-gray-500">
              Business Operating System
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {menuItems.map((item, index) => (
            <motion.button
              key={item}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.04,
              }}
              className={`group flex w-full items-center rounded-xl px-4 py-3 text-left text-sm transition-all duration-200 ${
                item === "Dashboard"
                  ? "bg-purple-500/15 text-purple-300"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span
                className={`mr-3 h-2 w-2 rounded-full ${
                  item === "Dashboard"
                    ? "bg-purple-400"
                    : "bg-gray-700 group-hover:bg-purple-400"
                }`}
              />

              {item}
            </motion.button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="border-t border-white/10 p-4">
          <button className="w-full rounded-xl px-4 py-3 text-left text-sm text-gray-400 transition hover:bg-white/5 hover:text-white">
            ⚙ Settings
          </button>
        </div>

      </div>
    </motion.aside>
  );
};

export default Sidebar;