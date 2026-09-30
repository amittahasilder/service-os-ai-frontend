import { motion } from "framer-motion";
import DashboardLayout from "../layouts/DashboardLayout";
import StatCard from "../components/dashboard/StatCard";

const revenueData = [
  { month: "Jan", value: 42 },
  { month: "Feb", value: 58 },
  { month: "Mar", value: 48 },
  { month: "Apr", value: 72 },
  { month: "May", value: 64 },
  { month: "Jun", value: 84 },
  { month: "Jul", value: 76 },
  { month: "Aug", value: 96 },
  { month: "Sep", value: 82 },
  { month: "Oct", value: 91 },
  { month: "Nov", value: 100 },
  { month: "Dec", value: 94 },
];

const activities = [
  ["New customer", "John Smith", "2m ago"],
  ["Job completed", "AC Repair", "18m ago"],
  ["Invoice paid", "$850.00", "1h ago"],
  ["New lead", "Sarah Wilson", "2h ago"],
  ["Booking created", "Cleaning Service", "3h ago"],
];

const jobs = [
  {
    title: "HVAC Maintenance",
    customer: "Michael Anderson",
    time: "10:30 AM",
    status: "Scheduled",
  },
  {
    title: "Office Cleaning",
    customer: "Nova Corporation",
    time: "01:00 PM",
    status: "Confirmed",
  },
  {
    title: "Electrical Repair",
    customer: "Emma Wilson",
    time: "03:30 PM",
    status: "Pending",
  },
];

const quickActions = [
  {
    title: "New Lead",
    description: "Capture a potential customer",
    icon: "+",
  },
  {
    title: "New Customer",
    description: "Add customer profile",
    icon: "◎",
  },
  {
    title: "New Booking",
    description: "Schedule a service",
    icon: "◷",
  },
  {
    title: "Create Invoice",
    description: "Generate new invoice",
    icon: "$",
  },
];

const glass =
  "relative overflow-hidden rounded-[26px] border border-white/[0.075] bg-white/[0.025] shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-2xl backdrop-saturate-150";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-[1800px]">

        {/* =====================================================
            HERO
        ===================================================== */}

        <motion.section
          initial={{ opacity: 0, y: 25, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative mb-6 overflow-hidden rounded-[30px]"
        >
          {/* Ambient purple */}

          <motion.div
            animate={{
              x: [0, 50, -30, 0],
              y: [0, -25, 30, 0],
              scale: [1, 1.12, 0.95, 1],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="
              pointer-events-none
              absolute
              -left-32
              -top-40
              h-[420px]
              w-[420px]
              rounded-full
              bg-violet-600/[0.10]
              blur-[120px]
            "
          />

          {/* Maroon atmosphere */}

          <motion.div
            animate={{
              x: [0, -40, 30, 0],
              y: [0, 30, -20, 0],
              scale: [1, 0.9, 1.08, 1],
            }}
            transition={{
              duration: 21,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="
              pointer-events-none
              absolute
              -right-32
              -top-20
              h-[360px]
              w-[360px]
              rounded-full
              bg-fuchsia-950/[0.16]
              blur-[110px]
            "
          />

          {/* Glass shell */}

          <div
            className="
              relative
              overflow-hidden
              rounded-[30px]
              border
              border-white/[0.08]
              bg-gradient-to-br
              from-violet-500/[0.055]
              via-black/[0.30]
              to-fuchsia-950/[0.08]
              p-6
              shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_30px_100px_rgba(0,0,0,0.55)]
              backdrop-blur-3xl
              backdrop-saturate-150
              sm:p-8
            "
          >
            {/* Inner glass */}

            <div className="pointer-events-none absolute inset-[1px] rounded-[29px] border border-white/[0.025]" />

            {/* Reflection */}

            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/50 to-transparent" />

            {/* Moving shine */}

            <motion.div
              animate={{ x: ["-120%", "180%"] }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatDelay: 4,
                ease: "linear",
              }}
              className="
                pointer-events-none
                absolute
                -top-[120%]
                h-[350%]
                w-28
                rotate-[20deg]
                bg-gradient-to-r
                from-transparent
                via-white/[0.045]
                to-transparent
                blur-2xl
              "
            />

            <div className="relative z-10">

              <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">

                <div>
                  <div
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-full
                      border
                      border-violet-400/[0.15]
                      bg-violet-500/[0.055]
                      px-3
                      py-1.5
                      text-[11px]
                      font-medium
                      text-violet-300
                      shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]
                    "
                  >
                    <motion.span
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.8, 0.4, 0.8],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                      className="h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_14px_rgba(167,139,250,0.9)]"
                    />

                    Business Overview
                  </div>

                  <h1 className="mt-4 text-3xl font-black tracking-[-0.045em] sm:text-4xl lg:text-5xl">
                    Business
                    <span className="bg-gradient-to-r from-violet-300 via-purple-300 to-fuchsia-300 bg-clip-text text-transparent">
                      {" "}
                      Command Center
                    </span>
                  </h1>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-white/35 sm:text-base">
                    Your service business performance, operations and
                    customer activity — all in one intelligent workspace.
                  </p>
                </div>

                {/* System status */}

                <motion.div
                  whileHover={{
                    y: -3,
                    scale: 1.01,
                  }}
                  className="
                    rounded-2xl
                    border
                    border-white/[0.07]
                    bg-black/[0.25]
                    px-4
                    py-3
                    backdrop-blur-xl
                  "
                >
                  <div className="flex items-center gap-3">

                    <div className="relative">
                      <motion.div
                        animate={{
                          scale: [1, 1.7, 1],
                          opacity: [0.6, 0, 0.6],
                        }}
                        transition={{
                          duration: 2.2,
                          repeat: Infinity,
                        }}
                        className="absolute inset-0 rounded-full bg-emerald-400"
                      />

                      <div className="relative h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-white/70">
                        System Operational
                      </p>

                      <p className="mt-0.5 text-[10px] text-white/25">
                        All services running normally
                      </p>
                    </div>
                  </div>
                </motion.div>

              </div>
            </div>
          </div>
        </motion.section>

        {/* =====================================================
            KPI STATS
        ===================================================== */}

        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.08,
              },
            },
          }}
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {[
            ["Total Revenue", "$24,580", "+12.5%", "vs last month"],
            ["Active Jobs", "128", "+8.2%", "this month"],
            ["New Leads", "64", "+18.4%", "this month"],
            ["Customers", "1,284", "+6.7%", "total customers"],
          ].map(([title, value, change, description]) => (
            <motion.div
              key={title}
              variants={{
                hidden: {
                  opacity: 0,
                  y: 20,
                  scale: 0.98,
                },
                show: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                },
              }}
              transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <StatCard
                title={title}
                value={value}
                change={change}
                description={description}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* =====================================================
            MAIN ANALYTICS
        ===================================================== */}

        <div className="mt-6 grid gap-6 xl:grid-cols-3">

          {/* ===================================================
              REVENUE ANALYTICS
          =================================================== */}

          <motion.section
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.65 }}
            whileHover={{ y: -3 }}
            className={`${glass} xl:col-span-2`}
          >
            {/* Glow */}

            <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-violet-600/[0.07] blur-[120px]" />

            {/* Reflection */}

            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/35 to-transparent" />

            <div className="relative z-10 p-6 sm:p-7">

              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold">
                      Revenue Analytics
                    </h2>

                    <span className="rounded-full border border-emerald-400/[0.15] bg-emerald-400/[0.055] px-2.5 py-1 text-[10px] font-semibold text-emerald-300">
                      +18.6%
                    </span>
                  </div>

                  <p className="mt-1.5 text-sm text-white/30">
                    Revenue performance over the year
                  </p>
                </div>

                <button
                  className="
                    rounded-xl
                    border
                    border-white/[0.07]
                    bg-white/[0.025]
                    px-4
                    py-2.5
                    text-xs
                    text-white/40
                    backdrop-blur-xl
                    transition
                    hover:border-violet-400/20
                    hover:bg-violet-500/[0.06]
                    hover:text-violet-300
                  "
                >
                  2026
                </button>
              </div>

              {/* Chart */}

              <div className="relative mt-10">

                {/* Y axis */}

                <div className="pointer-events-none absolute inset-y-0 left-0 flex w-8 flex-col justify-between text-[9px] text-white/20">
                  <span>100K</span>
                  <span>75K</span>
                  <span>50K</span>
                  <span>25K</span>
                  <span>0</span>
                </div>

                <div className="ml-10">

                  {/* Grid */}

                  <div className="pointer-events-none absolute inset-x-0 top-0 h-60">
                    <div className="flex h-full flex-col justify-between">
                      {[1, 2, 3, 4, 5].map((line) => (
                        <div
                          key={line}
                          className="border-t border-white/[0.045]"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Bars */}

                  <div className="relative flex h-60 items-end gap-2 sm:gap-3">

                    {revenueData.map((item, index) => (
                      <motion.div
                        key={item.month}
                        initial={{
                          height: 0,
                          opacity: 0,
                        }}
                        animate={{
                          height: `${item.value}%`,
                          opacity: 1,
                        }}
                        transition={{
                          duration: 0.9,
                          delay: 0.4 + index * 0.045,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        whileHover={{
                          scaleX: 1.08,
                        }}
                        className="group relative flex-1 origin-bottom"
                      >

                        {/* Tooltip */}

                        <div
                          className="
                            pointer-events-none
                            absolute
                            -top-11
                            left-1/2
                            z-30
                            -translate-x-1/2
                            rounded-xl
                            border
                            border-violet-400/[0.18]
                            bg-[#0a0710]/95
                            px-3
                            py-2
                            text-[10px]
                            font-semibold
                            text-violet-200
                            opacity-0
                            shadow-[0_15px_40px_rgba(0,0,0,0.5)]
                            backdrop-blur-xl
                            transition
                            duration-200
                            group-hover:opacity-100
                          "
                        >
                          ${(item.value * 980).toLocaleString()}
                        </div>

                        {/* Glow */}

                        <div className="absolute inset-x-0 bottom-0 h-full rounded-t-2xl bg-violet-500/[0.10] opacity-0 blur-2xl transition duration-300 group-hover:opacity-100" />

                        {/* Bar */}

                        <div
                          className="
                            relative
                            h-full
                            overflow-hidden
                            rounded-t-2xl
                            border
                            border-violet-300/[0.09]
                            bg-gradient-to-t
                            from-violet-800/[0.18]
                            via-purple-500/30
                            to-violet-300/80
                            shadow-[0_0_25px_rgba(139,92,246,0.08)]
                            transition
                            duration-300
                            group-hover:border-violet-300/25
                            group-hover:shadow-[0_0_35px_rgba(139,92,246,0.28)]
                          "
                        >
                          {/* Inner glass */}

                          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.16] to-transparent" />

                          {/* Moving light */}

                          <motion.div
                            animate={{
                              y: ["-100%", "300%"],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              delay: index * 0.12,
                              ease: "linear",
                            }}
                            className="absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-white/[0.08] to-transparent blur-sm"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Months */}

                  <div className="mt-3 flex gap-2 sm:gap-3">
                    {revenueData.map((item) => (
                      <span
                        key={item.month}
                        className="flex-1 text-center text-[9px] text-white/20"
                      >
                        {item.month}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chart footer */}

              <div className="mt-7 flex flex-col justify-between gap-5 border-t border-white/[0.05] pt-5 sm:flex-row sm:items-center">

                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-white/20">
                    Total Revenue
                  </p>

                  <p className="mt-1 text-2xl font-black tracking-tight">
                    $24,580
                  </p>
                </div>

                <div className="flex gap-8">

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-white/20">
                      Avg. Monthly
                    </p>

                    <p className="mt-1 text-sm font-semibold text-white/70">
                      $18,420
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-white/20">
                      Growth
                    </p>

                    <p className="mt-1 text-sm font-semibold text-emerald-300">
                      +18.6%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* ===================================================
              BUSINESS PULSE
          =================================================== */}

          <motion.section
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35, duration: 0.65 }}
            whileHover={{ y: -3 }}
            className={glass}
          >
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-fuchsia-700/[0.08] blur-[90px]" />

            <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-300/25 to-transparent" />

            <div className="relative z-10 p-6">

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-300">
                    Intelligence
                  </p>

                  <h2 className="mt-2 text-lg font-bold">
                    Business Pulse
                  </h2>
                </div>

                <div className="rounded-xl border border-violet-400/[0.12] bg-violet-500/[0.05] px-3 py-2 text-[10px] text-violet-300">
                  AI Insight
                </div>
              </div>

              {/* Circular score */}

              <div className="relative mx-auto mt-8 flex h-44 w-44 items-center justify-center">

                <motion.div
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="
                    absolute
                    inset-0
                    rounded-full
                    border
                    border-dashed
                    border-violet-400/[0.15]
                  "
                />

                <div className="absolute inset-4 rounded-full border border-white/[0.05] bg-black/[0.20] backdrop-blur-xl" />

                <div className="relative text-center">
                  <p className="text-4xl font-black">
                    87%
                  </p>

                  <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-white/25">
                    Business Health
                  </p>
                </div>
              </div>

              <div className="mt-7 space-y-3">

                {[
                  ["Revenue", "Strong", "text-emerald-300"],
                  ["Operations", "Healthy", "text-violet-300"],
                  ["Leads", "Growing", "text-cyan-300"],
                ].map(([name, value, color]) => (
                  <div
                    key={name}
                    className="flex items-center justify-between rounded-xl border border-white/[0.045] bg-white/[0.018] px-3 py-2.5"
                  >
                    <span className="text-xs text-white/35">
                      {name}
                    </span>

                    <span className={`text-xs font-semibold ${color}`}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-violet-400/[0.10] bg-violet-500/[0.035] p-4">
                <p className="text-xs leading-5 text-white/45">
                  Revenue and lead activity are trending upward.
                  Keep follow-ups consistent to maintain momentum.
                </p>
              </div>
            </div>
          </motion.section>
        </div>

        {/* =====================================================
            QUICK ACTIONS
        ===================================================== */}

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className={`${glass} mt-6`}
        >
          <div className="pointer-events-none absolute -left-20 top-0 h-48 w-48 rounded-full bg-purple-700/[0.07] blur-[80px]" />

          <div className="relative z-10 p-6">

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-300">
                Workspace
              </p>

              <h2 className="mt-2 text-lg font-bold">
                Quick Actions
              </h2>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

              {quickActions.map((action, index) => (
                <motion.button
                  key={action.title}
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.5 + index * 0.08,
                  }}
                  whileHover={{
                    y: -4,
                    scale: 1.01,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-2xl
                    border
                    border-white/[0.055]
                    bg-white/[0.018]
                    p-4
                    text-left
                    transition
                    duration-300
                    hover:border-violet-400/[0.15]
                    hover:bg-violet-500/[0.035]
                  "
                >
                  <div className="flex items-center gap-4">

                    <div
                      className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-violet-400/[0.12]
                        bg-violet-500/[0.06]
                        text-sm
                        font-bold
                        text-violet-300
                        shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]
                        transition
                        group-hover:border-violet-300/25
                        group-hover:bg-violet-500/[0.10]
                      "
                    >
                      {action.icon}
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white/75">
                        {action.title}
                      </p>

                      <p className="mt-1 truncate text-[10px] text-white/25">
                        {action.description}
                      </p>
                    </div>
                  </div>

                  <span className="absolute right-4 top-4 text-xs text-white/15 transition group-hover:translate-x-1 group-hover:text-violet-300">
                    →
                  </span>

                  {/* Shine */}

                  <div className="pointer-events-none absolute inset-y-0 -left-24 w-20 rotate-12 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent opacity-0 transition duration-700 group-hover:left-[120%] group-hover:opacity-100" />
                </motion.button>
              ))}
            </div>
          </div>
        </motion.section>

        {/* =====================================================
            ACTIVITY + JOBS
        ===================================================== */}

        <div className="mt-6 grid gap-6 xl:grid-cols-3">

          {/* Activity */}

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`${glass} xl:col-span-1`}
          >
            <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-fuchsia-700/[0.06] blur-[90px]" />

            <div className="relative z-10 p-6">

              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">
                    Recent Activity
                  </h2>

                  <p className="mt-1 text-xs text-white/25">
                    Latest workspace events
                  </p>
                </div>

                <span className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-1.5 text-[9px] text-white/30">
                  LIVE
                </span>
              </div>

              <div className="mt-6 space-y-3">

                {activities.map(([title, value, time], index) => (
                  <motion.div
                    key={`${title}-${value}`}
                    initial={{
                      opacity: 0,
                      x: 12,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      delay: 0.6 + index * 0.08,
                    }}
                    whileHover={{
                      x: 4,
                    }}
                    className="
                      group
                      flex
                      gap-3
                      rounded-2xl
                      border
                      border-white/[0.04]
                      bg-white/[0.015]
                      p-3
                      transition
                      hover:border-violet-400/[0.12]
                      hover:bg-violet-500/[0.03]
                    "
                  >
                    <div className="relative mt-1.5">
                      <motion.div
                        animate={{
                          scale: [1, 1.6, 1],
                          opacity: [0.5, 0, 0.5],
                        }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          delay: index * 0.3,
                        }}
                        className="absolute inset-0 rounded-full bg-violet-400"
                      />

                      <span className="relative block h-2 w-2 rounded-full bg-violet-400" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between gap-3">
                        <p className="text-xs text-white/40">
                          {title}
                        </p>

                        <span className="shrink-0 text-[9px] text-white/20">
                          {time}
                        </span>
                      </div>

                      <p className="mt-1.5 truncate text-sm font-semibold text-white/75">
                        {value}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Jobs */}

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className={`${glass} xl:col-span-2`}
          >
            <div className="relative z-10 p-6">

              <div className="flex items-center justify-between">

                <div>
                  <h2 className="text-lg font-bold">
                    Upcoming Jobs
                  </h2>

                  <p className="mt-1 text-xs text-white/25">
                    Your next scheduled service operations
                  </p>
                </div>

                <button
                  className="
                    rounded-xl
                    border
                    border-white/[0.07]
                    bg-white/[0.025]
                    px-4
                    py-2.5
                    text-xs
                    text-white/35
                    transition
                    hover:border-violet-400/20
                    hover:text-violet-300
                  "
                >
                  Schedule
                </button>
              </div>

              <div className="mt-6 grid gap-3">

                {jobs.map((job, index) => (
                  <motion.div
                    key={job.title}
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: 0.65 + index * 0.08,
                    }}
                    whileHover={{
                      x: 4,
                    }}
                    className="
                      group
                      relative
                      overflow-hidden
                      rounded-2xl
                      border
                      border-white/[0.045]
                      bg-white/[0.018]
                      p-4
                      transition
                      duration-300
                      hover:border-violet-400/[0.13]
                      hover:bg-violet-500/[0.03]
                    "
                  >
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                      <div className="flex items-center gap-4">

                        <div
                          className="
                            flex
                            h-11
                            w-11
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-violet-400/[0.10]
                            bg-violet-500/[0.045]
                            text-violet-300
                          "
                        >
                          ◷
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-white/75">
                            {job.title}
                          </p>

                          <p className="mt-1 text-xs text-white/25">
                            {job.customer}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-6 sm:justify-end">

                        <div>
                          <p className="text-[9px] uppercase tracking-[0.16em] text-white/20">
                            Time
                          </p>

                          <p className="mt-1 text-xs font-semibold text-white/60">
                            {job.time}
                          </p>
                        </div>

                        <span
                          className="
                            rounded-full
                            border
                            border-violet-400/[0.12]
                            bg-violet-500/[0.05]
                            px-3
                            py-1.5
                            text-[9px]
                            font-semibold
                            text-violet-300
                          "
                        >
                          {job.status}
                        </span>
                      </div>
                    </div>

                    {/* Hover glow */}

                    <div className="pointer-events-none absolute -bottom-10 right-0 h-24 w-24 rounded-full bg-violet-500/[0.08] blur-2xl opacity-0 transition duration-500 group-hover:opacity-100" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        </div>

        {/* =====================================================
            FOOTER STATUS
        ===================================================== */}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col items-center justify-between gap-3 py-8 text-[10px] text-white/15 sm:flex-row"
        >
          <span>
            ServiceOS Command Center
          </span>

          <div className="flex items-center gap-3">
            <span>Secure</span>
            <span className="h-1 w-1 rounded-full bg-white/15" />
            <span>Encrypted</span>
            <span className="h-1 w-1 rounded-full bg-white/15" />
            <span>Operational</span>
          </div>
        </motion.div>

      </div>
    </DashboardLayout>
  );
};

export default Dashboard;