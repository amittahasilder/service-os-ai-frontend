import { motion } from "framer-motion";

const StatCard = ({
  title,
  value,
  change,
  description,
}) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 18,
        scale: 0.98,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      whileHover={{
        y: -6,
        scale: 1.015,
      }}
      transition={{
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="
        group
        relative
        overflow-hidden
        rounded-[24px]
        border
        border-white/[0.075]
        bg-white/[0.025]
        shadow-[0_25px_70px_rgba(0,0,0,0.42)]
        backdrop-blur-2xl
        backdrop-saturate-150
      "
    >
      {/* =====================================================
          DEEP AMBIENT GLOW
      ===================================================== */}

      <motion.div
        initial={{ opacity: 0.25 }}
        animate={{
          opacity: [0.2, 0.38, 0.2],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          pointer-events-none
          absolute
          -right-16
          -top-16
          h-40
          w-40
          rounded-full
          bg-violet-600/[0.10]
          blur-[70px]
        "
      />

      {/* =====================================================
          SECOND MAROON GLOW
      ===================================================== */}

      <motion.div
        animate={{
          opacity: [0.08, 0.18, 0.08],
          x: [0, -12, 0],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          pointer-events-none
          absolute
          -bottom-20
          -left-16
          h-36
          w-36
          rounded-full
          bg-fuchsia-950/[0.25]
          blur-[70px]
        "
      />

      {/* =====================================================
          INNER GLASS LAYER
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-[1px]
          rounded-[23px]
          border
          border-white/[0.025]
        "
      />

      {/* =====================================================
          PREMIUM TOP REFLECTION
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-x-6
          top-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-white/[0.16]
          to-transparent
        "
      />

      {/* Purple reflection */}

      <div
        className="
          pointer-events-none
          absolute
          left-[18%]
          right-[18%]
          top-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-violet-400/35
          to-transparent
          blur-[1px]
        "
      />

      {/* =====================================================
          MOVING GLASS LIGHT
      ===================================================== */}

      <motion.div
        animate={{
          x: ["-140%", "180%"],
        }}
        transition={{
          duration: 6.5,
          repeat: Infinity,
          repeatDelay: 5,
          ease: "linear",
        }}
        className="
          pointer-events-none
          absolute
          -top-[80%]
          h-[260%]
          w-20
          rotate-[22deg]
          bg-gradient-to-r
          from-transparent
          via-white/[0.045]
          to-transparent
          blur-xl
        "
      />

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="relative z-10 p-5 sm:p-6">

        {/* Top row */}

        <div className="flex items-start justify-between gap-4">

          <div className="min-w-0">

            <p
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.18em]
                text-white/30
              "
            >
              {title}
            </p>

            {/* Value */}

            <motion.p
              initial={{
                opacity: 0,
                y: 8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.15,
                duration: 0.45,
              }}
              className="
                mt-3
                truncate
                text-2xl
                font-black
                tracking-[-0.035em]
                text-white
                sm:text-3xl
              "
            >
              {value}
            </motion.p>
          </div>

          {/* Animated icon */}

          <motion.div
            whileHover={{
              rotate: 8,
              scale: 1.08,
            }}
            className="
              relative
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              overflow-hidden
              rounded-xl
              border
              border-violet-400/[0.12]
              bg-violet-500/[0.055]
              text-violet-300
              shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]
              transition
              duration-300
              group-hover:border-violet-300/25
              group-hover:bg-violet-500/[0.09]
            "
          >
            <span className="text-sm font-bold">
              {title === "Total Revenue"
                ? "$"
                : title === "Active Jobs"
                  ? "◷"
                  : title === "New Leads"
                    ? "✦"
                    : "◎"}
            </span>

            {/* icon shine */}

            <motion.div
              animate={{
                x: ["-150%", "150%"],
              }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                repeatDelay: 4,
              }}
              className="
                pointer-events-none
                absolute
                inset-y-0
                w-5
                rotate-12
                bg-gradient-to-r
                from-transparent
                via-white/[0.10]
                to-transparent
                blur-sm
              "
            />
          </motion.div>
        </div>

        {/* ===================================================
            BOTTOM METRICS
        =================================================== */}

        <div
          className="
            mt-5
            flex
            items-center
            justify-between
            border-t
            border-white/[0.045]
            pt-4
          "
        >

          {/* Change */}

          <div className="flex items-center gap-2">

            <motion.span
              animate={{
                y: [0, -2, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="
                flex
                h-5
                min-w-5
                items-center
                justify-center
                rounded-md
                border
                border-emerald-400/[0.12]
                bg-emerald-400/[0.055]
                px-1
                text-[9px]
                font-bold
                text-emerald-300
              "
            >
              ↑
            </motion.span>

            <span className="text-xs font-semibold text-emerald-300">
              {change}
            </span>

          </div>

          {/* Description */}

          <span className="text-[10px] text-white/20">
            {description}
          </span>
        </div>
      </div>

      {/* =====================================================
          HOVER BORDER GLOW
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          rounded-[24px]
          border
          border-transparent
          transition
          duration-500
          group-hover:border-violet-400/[0.18]
        "
      />

      {/* =====================================================
          HOVER BOTTOM LIGHT
      ===================================================== */}

      <motion.div
        initial={{
          scaleX: 0.35,
          opacity: 0.2,
        }}
        whileHover={{
          scaleX: 1,
          opacity: 0.8,
        }}
        className="
          pointer-events-none
          absolute
          bottom-0
          left-[15%]
          right-[15%]
          h-px
          origin-center
          bg-gradient-to-r
          from-transparent
          via-violet-400/50
          to-transparent
          blur-[1px]
        "
      />

      {/* =====================================================
          HOVER CORNER GLOW
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -bottom-10
          -right-10
          h-28
          w-28
          rounded-full
          bg-violet-500/[0.07]
          blur-3xl
          opacity-0
          transition
          duration-500
          group-hover:opacity-100
        "
      />
    </motion.div>
  );
};

export default StatCard;