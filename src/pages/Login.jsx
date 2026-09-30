import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { login, isAuthenticated, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ============================================
  // IF ALREADY LOGGED IN
  // ============================================

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  // ============================================
  // INPUT CHANGE
  // ============================================

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

  // ============================================
  // VALIDATION
  // ============================================

  const validateForm = () => {
    const email = formData.email.trim();
    const password = formData.password;

    if (!email) {
      return "Please enter your email address.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Please enter a valid email address.";
    }

    if (!password) {
      return "Please enter your password.";
    }

    return null;
  };

  // ============================================
  // SUBMIT
  // ============================================

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
      await login({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      const destination =
        location.state?.from?.pathname || "/dashboard";

      navigate(destination, {
        replace: true,
      });
    } catch (err) {
      console.error("Login error:", err);

      const backendMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error;

      if (typeof backendMessage === "string") {
        setError(backendMessage);
      } else {
        setError(
          "Invalid email or password. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030305] text-white overflow-hidden relative">

      {/* ==========================================
          AMBIENT BACKGROUND
      =========================================== */}

      <div className="fixed inset-0 pointer-events-none overflow-hidden">

        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -35, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            -top-48
            -left-48
            w-[600px]
            h-[600px]
            rounded-full
            bg-violet-600/[0.12]
            blur-[150px]
          "
        />

        <motion.div
          animate={{
            x: [0, -40, 0],
            y: [0, 35, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            -bottom-52
            -right-48
            w-[600px]
            h-[600px]
            rounded-full
            bg-cyan-500/[0.08]
            blur-[160px]
          "
        />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* ==========================================
          CONTENT
      =========================================== */}

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
          className="w-full max-w-md"
        >

          {/* ======================================
              BRAND
          ======================================= */}

          <div className="text-center mb-8">

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.7,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
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
                bg-white/[0.04]
                border
                border-white/10
                backdrop-blur-2xl
                shadow-[0_0_50px_rgba(139,92,246,.15)]
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

            <h1 className="mt-5 text-2xl font-bold tracking-tight">
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-white/40">
              Sign in to your ServiceOS workspace.
            </p>
          </div>

          {/* ======================================
              GLASS CARD
          ======================================= */}

          <div
            className="
              relative
              rounded-[28px]
              border
              border-white/[0.09]
              bg-white/[0.035]
              backdrop-blur-2xl
              shadow-[0_30px_100px_rgba(0,0,0,.5)]
              overflow-hidden
            "
          >

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
              className="p-6 sm:p-8"
            >

              {/* ==================================
                  ERROR
              =================================== */}

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
                    <span>!</span>
                    <span className="leading-6">
                      {error}
                    </span>
                  </div>
                </motion.div>
              )}

              {/* ==================================
                  EMAIL
              =================================== */}

              <div className="mb-5">

                <label
                  htmlFor="email"
                  className="
                    block
                    text-sm
                    font-medium
                    text-white/70
                    mb-2
                  "
                >
                  Email address
                </label>

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

              {/* ==================================
                  PASSWORD
              =================================== */}

              <div className="mb-3">

                <div className="flex items-center justify-between mb-2">

                  <label
                    htmlFor="password"
                    className="
                      text-sm
                      font-medium
                      text-white/70
                    "
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    className="
                      text-xs
                      text-violet-300/70
                      hover:text-violet-200
                      transition-colors
                    "
                    onClick={() => {
                      setError(
                        "Password recovery will be connected in the next authentication step."
                      );
                    }}
                  >
                    Forgot password?
                  </button>

                </div>

                <div className="relative">

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={loading}
                    className="
                      w-full
                      h-12
                      rounded-xl
                      border
                      border-white/[0.08]
                      bg-black/20
                      px-4
                      pr-16
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
              </div>

              {/* ==================================
                  REMEMBER
              =================================== */}

              <label className="flex items-center gap-2 mt-5 cursor-pointer">

                <input
                  type="checkbox"
                  className="
                    w-4
                    h-4
                    rounded
                    border-white/10
                    bg-white/5
                    accent-violet-600
                  "
                />

                <span className="text-xs text-white/35">
                  Keep me signed in
                </span>

              </label>

              {/* ==================================
                  SUBMIT
              =================================== */}

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{
                  scale: loading ? 1 : 1.01,
                }}
                whileTap={{
                  scale: loading ? 1 : 0.98,
                }}
                className="
                  relative
                  mt-7
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
                  shadow-[0_10px_40px_rgba(124,58,237,.22)]
                  hover:shadow-[0_12px_50px_rgba(124,58,237,.35)]
                  transition-all
                  disabled:opacity-60
                  disabled:cursor-not-allowed
                "
              >

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

                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <span className="text-white/70">
                        →
                      </span>
                    </>
                  )}

                </span>

              </motion.button>

              {/* ==================================
                  SIGNUP
              =================================== */}

              <p className="mt-6 text-center text-sm text-white/35">

                Don't have an account?{" "}

                <Link
                  to="/signup"
                  className="
                    text-violet-300
                    hover:text-violet-200
                    transition-colors
                  "
                >
                  Create one
                </Link>

              </p>

            </form>
          </div>

          <p className="mt-6 text-center text-xs text-white/20">
            Secure authentication · ServiceOS
          </p>

        </motion.div>
      </div>
    </div>
  );
};

export default Login;