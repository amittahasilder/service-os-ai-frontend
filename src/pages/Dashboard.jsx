import { motion } from "framer-motion";

import DashboardLayout from "../layouts/DashboardLayout";
import StatCard from "../components/dashboard/StatCard";

const Dashboard = () => {
  return (
    <DashboardLayout>

      {/* Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <p className="text-sm text-purple-400">
            Overview
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Business Dashboard
          </h1>

          <p className="mt-2 text-gray-500">
            Monitor your service business from one place.
          </p>
        </motion.div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Revenue"
          value="$24,580"
          change="+12.5%"
          description="vs last month"
        />

        <StatCard
          title="Active Jobs"
          value="128"
          change="+8.2%"
          description="this month"
        />

        <StatCard
          title="New Leads"
          value="64"
          change="+18.4%"
          description="this month"
        />

        <StatCard
          title="Customers"
          value="1,284"
          change="+6.7%"
          description="total customers"
        />

      </div>

      {/* Main Grid */}
      <div className="mt-6 grid gap-6 xl:grid-cols-3">

        {/* Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 xl:col-span-2"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                Revenue Overview
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Monthly business performance
              </p>
            </div>

            <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-gray-400">
              Last 6 months
            </span>
          </div>

          <div className="mt-8 flex h-64 items-end gap-3">
            {[35, 48, 42, 65, 58, 82, 72, 95, 78, 88, 100, 92].map(
              (height, index) => (
                <motion.div
                  key={index}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{
                    duration: 0.7,
                    delay: index * 0.05,
                  }}
                  className="flex-1 rounded-t-lg bg-gradient-to-t from-purple-600/20 to-purple-400/80"
                />
              )
            )}
          </div>
        </motion.div>

        {/* Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
        >
          <h2 className="text-lg font-semibold">
            Recent Activity
          </h2>

          <div className="mt-6 space-y-5">

            {[
              ["New customer", "John Smith", "2m ago"],
              ["Job completed", "AC Repair", "18m ago"],
              ["Invoice paid", "$850.00", "1h ago"],
              ["New lead", "Sarah Wilson", "2h ago"],
              ["Booking created", "Cleaning Service", "3h ago"],
            ].map(([title, value, time]) => (
              <div
                key={`${title}-${value}`}
                className="flex gap-3"
              >
                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-purple-400" />

                <div className="min-w-0">
                  <p className="text-sm text-gray-300">
                    {title}
                  </p>

                  <p className="mt-1 truncate text-sm font-medium">
                    {value}
                  </p>

                  <p className="mt-1 text-xs text-gray-600">
                    {time}
                  </p>
                </div>
              </div>
            ))}

          </div>
        </motion.div>

      </div>

    </DashboardLayout>
  );
};

export default Dashboard;