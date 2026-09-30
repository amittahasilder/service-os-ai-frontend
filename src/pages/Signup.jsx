import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const BUSINESS_TYPES = [
  {
    value: "cleaning",
    label: "Cleaning",
    description: "Cleaning & home services",
  },
  {
    value: "plumbing",
    label: "Plumbing",
    description: "Plumbing & pipe services",
  },
  {
    value: "hvac",
    label: "HVAC",
    description: "Heating & cooling services",
  },
  {
    value: "electrical",
    label: "Electrical",
    description: "Electrical services",
  },
  {
    value: "repair",
    label: "Repair",
    description: "Repair & maintenance",
  },
  {
    value: "salon",
    label: "Salon",
    description: "Salon & beauty services",
  },
  {
    value: "agency",
    label: "Agency",
    description: "Digital & creative agency",
  },
  {
    value: "consultant",
    label: "Consultant",
    description: "Consulting business",
  },
  {
    value: "freelancer",
    label: "Freelancer",
    description: "Independent professional",
  },
  {
    value: "photography",
    label: "Photography",
    description: "Photography services",
  },
  {
    value: "landscaping",
    label: "Landscaping",
    description: "Garden & landscaping",
  },
  {
    value: "automotive",
    label: "Automotive",
    description: "Automotive services",
  },
  {
    value: "other",
    label: "Other",
    description: "Other service business",
  },
];

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    businessName: "",
    businessType: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const validateForm = () => {
    const name = formData.name.trim();
    const email = formData.email.trim();
    const password = formData.password;
    const businessName = formData.businessName.trim();
    const businessType = formData.businessType;

    if (!name) {
      return "Please enter your full name.";
    }

    if (name.length < 2) {
      return "Your name must be at least 2 characters.";
    }

    if (!email) {
      return "Please enter your email address.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Please enter a valid email address.";
    }

    if (!password) {
      return "Please create a password.";
    }

    if (password.length < 6) {
      return "Password must be at least 6 characters.";
    }

    if (!businessName) {
      return "Please enter your business name.";
    }

    if (businessName.length < 2) {
      return "Business name must be at least 2 characters.";
    }

    if (!businessType) {
      return "Please select your business type.";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        businessName: formData.businessName.trim(),
        businessType: formData.businessType,
      };

      await signup(payload);

      navigate("/dashboard", {
        replace: true,
      });
    } catch (err) {
      console.error("Signup error:", err);

      const backendMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.response?.data;

      if (Array.isArray(backendMessage)) {
        setError(
          backendMessage
            .map((item) => item.message || item)
            .join(" ")
        );
      } else if (typeof backendMessage === "string") {
        setError(backendMessage);
      } else {
        setError(
          "Unable to create your account. Please check your information and try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030305] text-white overflow-hidden relative">

      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="fixed inset-0 pointer-events-none overflow-hidden">

        {/* Violet glow */}
        <motion.div
          animate={{
            x: [0, 40, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            -top-40
            -left-40
            w-[500px]
            h-[500px]
            rounded-full
            bg-violet-600/15
            blur-[140px]
          "
        />

        {/* Cyan glow */}
        <motion.div
          animate={{
            x: [0, -50, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            -bottom-48
            -right-40
            w-[550px]
            h-[550px]
            rounded-full
            bg-cyan-500/10
            blur-[150px]
          "
        />

        {/* Center glow */}
        <div
          className="
            absolute
            top-1/2
            left-1/2
            -translate-x-1/2
            -translate-y-1/2
            w-[450px]
            h-[450px]
            rounded-full
            bg-purple-500/[0.04]
            blur-[120px]
          "
        />

        {/* Grid */}
        <div
          className="
            absolute
            inset-0
            opacity-[0.025]
          "
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-10">

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
            scale: 0.98,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="w-full max-w-xl"
        >

          {/* =================================================
              BRAND
          ================================================== */}

          <div className="text-center mb-7">

            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.15,
                duration: 0.5,
              }}
              className="
                mx-auto
                w-14
                h-14
                rounded-2xl
                flex
                items-center
                justify-center
                bg-white/[0.045]
                border
                border-white/10
                backdrop-blur-2xl
                shadow-[0_0_50px_rgba(139,92,246,0.15)]
              "
            >
              <span
                className="
                  text-2xl
                  font-black
                  bg-gradient-to-br
                  from-violet-300
                  via-purple-400
                  to-cyan-300
                  bg-clip-text
                  text-transparent
                "
              >
                S
              </span>
            </motion.div>

            <h1 className="mt-4 text-2xl font-bold tracking-tight">
              Create your{" "}
              <span className="bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">
                account
              </span>
            </h1>

            <p className="mt-2 text-sm text-white/40">
              Start managing your business with ServiceOS.
            </p>
          </div>

          {/* =================================================
              GLASS CARD
          ================================================== */}

          <div
            className="
              relative
              rounded-[28px]
              border
              border-white/[0.09]
              bg-white/[0.035]
              backdrop-blur-2xl
              shadow-[0_30px_100px_rgba(0,0,0,0.45)]
              overflow-hidden
            "
          >

            {/* top shine */}
            <div
              className="
                absolute
                top-0
                left-1/2
                -translate-x-1/2
                w-2/3
                h-px
                bg-gradient-to-r
                from-transparent
                via-violet-400/60
                to-transparent
              "
            />

            <form
              onSubmit={handleSubmit}
              className="relative p-6 sm:p-8"
            >

              {/* =================================================
                  ERROR
              ================================================== */}

              {error && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="
                    mb-6
                    rounded-2xl
                    border
                    border-red-400/20
                    bg-red-500/[0.08]
                    px-4
                    py-3
                    text-sm
                    text-red-300
                  "
                >
                  <div className="flex gap-3">
                    <span className="mt-0.5">!</span>

                    <span className="leading-6">
                      {error}
                    </span>
                  </div>
                </motion.div>
              )}

              {/* =================================================
                  PERSONAL INFORMATION
              ================================================== */}

              <div className="mb-7">

                <p className="text-[11px] uppercase tracking-[0.18em] text-white/30 mb-4">
                  Personal information
                </p>

                {/* Full Name */}
                <div className="mb-4">

                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-white/70 mb-2"
                  >
                    Full name
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                      ◯
                    </span>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Amit Tahasilder"
                      autoComplete="name"
                      disabled={loading}
                      className="
                        w-full
                        h-12
                        rounded-xl
                        border
                        border-white/[0.08]
                        bg-black/20
                        pl-11
                        pr-4
                        text-sm
                        text-white
                        placeholder:text-white/20
                        outline-none
                        transition-all
                        focus:border-violet-400/40
                        focus:bg-white/[0.045]
                        focus:ring-4
                        focus:ring-violet-500/[0.06]
                        disabled:opacity-50
                      "
                    />
                  </div>
                </div>

                {/* Email */}
                <div>

                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-white/70 mb-2"
                  >
                    Email address
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                      @
                    </span>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@company.com"
                      autoComplete="email"
                      disabled={loading}
                      className="
                        w-full
                        h-12
                        rounded-xl
                        border
                        border-white/[0.08]
                        bg-black/20
                        pl-11
                        pr-4
                        text-sm
                        text-white
                        placeholder:text-white/20
                        outline-none
                        transition-all
                        focus:border-violet-400/40
                        focus:bg-white/[0.045]
                        focus:ring-4
                        focus:ring-violet-500/[0.06]
                        disabled:opacity-50
                      "
                    />
                  </div>
                </div>
              </div>

              {/* =================================================
                  SECURITY
              ================================================== */}

              <div className="mb-7">

                <p className="text-[11px] uppercase tracking-[0.18em] text-white/30 mb-4">
                  Security
                </p>

                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-white/70 mb-2"
                >
                  Password
                </label>

                <div className="relative">

                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                    •
                  </span>

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a secure password"
                    autoComplete="new-password"
                    disabled={loading}
                    className="
                      w-full
                      h-12
                      rounded-xl
                      border
                      border-white/[0.08]
                      bg-black/20
                      pl-11
                      pr-14
                      text-sm
                      text-white
                      placeholder:text-white/20
                      outline-none
                      transition-all
                      focus:border-violet-400/40
                      focus:bg-white/[0.045]
                      focus:ring-4
                      focus:ring-violet-500/[0.06]
                      disabled:opacity-50
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    className="
                      absolute
                      right-3
                      top-1/2
                      -translate-y-1/2
                      px-2
                      py-1
                      text-xs
                      text-white/35
                      hover:text-white/70
                      transition-colors
                    "
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                <p className="mt-2 text-xs text-white/25">
                  Use at least 6 characters.
                </p>
              </div>

              {/* =================================================
                  BUSINESS
              ================================================== */}

              <div>

                <p className="text-[11px] uppercase tracking-[0.18em] text-white/30 mb-4">
                  Your business
                </p>

                {/* Business Name */}

                <div className="mb-4">

                  <label
                    htmlFor="businessName"
                    className="block text-sm font-medium text-white/70 mb-2"
                  >
                    Business name
                  </label>

                  <input
                    id="businessName"
                    name="businessName"
                    type="text"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="Your Business Name"
                    autoComplete="organization"
                    disabled={loading}
                    className="
                      w-full
                      h-12
                      rounded-xl
                      border
                      border-white/[0.08]
                      bg-black/20
                      px-4
                      text-sm
                      text-white
                      placeholder:text-white/20
                      outline-none
                      transition-all
                      focus:border-violet-400/40
                      focus:bg-white/[0.045]
                      focus:ring-4
                      focus:ring-violet-500/[0.06]
                      disabled:opacity-50
                    "
                  />
                </div>

                {/* Business Type */}

                <div>

                  <label
                    htmlFor="businessType"
                    className="block text-sm font-medium text-white/70 mb-2"
                  >
                    Business type
                  </label>

                  <div className="relative">

                    <select
                      id="businessType"
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleChange}
                      disabled={loading}
                      className="
                        appearance-none
                        w-full
                        h-12
                        rounded-xl
                        border
                        border-white/[0.08]
                        bg-[#0b0b10]
                        px-4
                        pr-10
                        text-sm
                        text-white
                        outline-none
                        transition-all
                        focus:border-violet-400/40
                        focus:ring-4
                        focus:ring-violet-500/[0.06]
                        disabled:opacity-50
                      "
                    >
                      <option
                        value=""
                        disabled
                        className="bg-[#0b0b10]"
                      >
                        Select your business type
                      </option>

                      {BUSINESS_TYPES.map((type) => (
                        <option
                          key={type.value}
                          value={type.value}
                          className="bg-[#0b0b10]"
                        >
                          {type.label} — {type.description}
                        </option>
                      ))}
                    </select>

                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/30">
                      ↓
                    </span>

                  </div>

                </div>
              </div>

              {/* =================================================
                  SUBMIT
              ================================================== */}

              <motion.button
                whileHover={{
                  scale: loading ? 1 : 1.01,
                }}
                whileTap={{
                  scale: loading ? 1 : 0.98,
                }}
                type="submit"
                disabled={loading}
                className="
                  relative
                  mt-8
                  w-full
                  h-12
                  rounded-xl
                  overflow-hidden
                  border
                  border-violet-300/20
                  bg-gradient-to-r
                  from-violet-600
                  via-purple-600
                  to-indigo-600
                  text-sm
                  font-semibold
                  text-white
                  shadow-[0_10px_40px_rgba(124,58,237,0.22)]
                  transition-all
                  hover:shadow-[0_12px_50px_rgba(124,58,237,0.35)]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >

                {/* Button shine */}

                {!loading && (
                  <motion.div
                    animate={{
                      x: ["-120%", "120%"],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      repeatDelay: 2,
                      ease: "easeInOut",
                    }}
                    className="
                      absolute
                      inset-y-0
                      w-1/3
                      bg-gradient-to-r
                      from-transparent
                      via-white/15
                      to-transparent
                      skew-x-[-20deg]
                    "
                  />
                )}

                <span className="relative z-10 flex items-center justify-center gap-2">

                  {loading ? (
                    <>
                      <span
                        className="
                          w-4
                          h-4
                          rounded-full
                          border-2
                          border-white/30
                          border-t-white
                          animate-spin
                        "
                      />

                      Creating workspace...
                    </>
                  ) : (
                    <>
                      Create account

                      <span className="text-white/70">
                        →
                      </span>
                    </>
                  )}

                </span>
              </motion.button>

              {/* =================================================
                  LOGIN
              ================================================== */}

              <p className="mt-6 text-center text-sm text-white/35">

                Already have an account?{" "}

                <Link
                  to="/login"
                  className="
                    text-violet-300
                    hover:text-violet-200
                    transition-colors
                  "
                >
                  Sign in
                </Link>

              </p>

            </form>
          </div>

          {/* Footer */}

          <p className="mt-6 text-center text-xs text-white/20">
            Secure workspace creation · ServiceOS
          </p>

        </motion.div>
      </div>
    </div>
  );
};

export default Signup;