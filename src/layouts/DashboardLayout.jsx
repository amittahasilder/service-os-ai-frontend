
import { motion, useReducedMotion } from "framer-motion";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

const DashboardLayout = ({ children }) => {
  const reduceMotion = useReducedMotion();

  const floatTransition = (duration, delay = 0) => ({
    duration: reduceMotion ? 0 : duration,
    delay,
    repeat: reduceMotion ? 0 : Infinity,
    ease: "easeInOut",
  });

  return (
    <div className="relative isolate min-h-screen overflow-x-clip bg-[#030306] text-white selection:bg-violet-500/30">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={
            reduceMotion
              ? {}
              : {
                  x: [0, 35, -20, 0],
                  y: [0, 20, -15, 0],
                  scale: [1, 1.1, 0.96, 1],
                }
          }
          transition={floatTransition(18)}
          className="absolute -left-32 -top-52 h-[600px] w-[600px] rounded-full bg-violet-600/[0.09] blur-[150px]"
        />

        <motion.div
          animate={
            reduceMotion
              ? {}
              : {
                  x: [0, -30, 15, 0],
                  y: [0, 25, -15, 0],
                  scale: [1, 0.94, 1.08, 1],
                }
          }
          transition={floatTransition(22, 1)}
          className="absolute -right-60 top-[18%] h-[520px] w-[520px] rounded-full bg-cyan-500/[0.055] blur-[150px]"
        />

        <motion.div
          animate={
            reduceMotion
              ? {}
              : {
                  x: [0, 20, -15, 0],
                  opacity: [0.45, 0.8, 0.45],
                }
          }
          transition={floatTransition(20, 2)}
          className="absolute -bottom-64 -left-48 h-[550px] w-[550px] rounded-full bg-fuchsia-600/[0.045] blur-[160px]"
        />

        {/* Futuristic grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:72px_72px]" />

        {/* Soft cinematic vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#030306]/10 via-transparent to-black/30" />
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* Application area */}
      <div className="relative min-h-screen lg:ml-72">
        {/* Glass topbar */}
        <div className="sticky top-0 z-40 border-b border-white/[0.07] bg-[#07070b]/75 shadow-[0_8px_35px_rgba(0,0,0,0.15)] backdrop-blur-2xl">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/30 to-transparent" />

          <Topbar />
        </div>

        {/* Main content */}
        <motion.main
          initial={
            reduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 14,
                  filter: "blur(5px)",
                }
          }
          animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
          }}
          transition={{
            duration: reduceMotion ? 0 : 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 xl:p-10"
        >
          {/* Content boundary glow */}
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.09] to-transparent sm:inset-x-6 lg:inset-x-8 xl:inset-x-10"
          />

          {/* Glass atmosphere behind page content */}
          <div className="pointer-events-none absolute right-8 top-12 h-48 w-48 rounded-full bg-violet-500/[0.025] blur-[90px]" />

          <div className="relative z-10">
            {children}
          </div>
        </motion.main>
      </div>

      {/* Subtle screen-edge depth */}
      <div className="pointer-events-none fixed inset-0 -z-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.18)]" />
    </div>
  );
};

export default DashboardLayout;