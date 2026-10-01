import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// =====================================================
// PUBLIC PAGES
// =====================================================

import Login from "./pages/Login";
import Signup from "./pages/Signup";

// =====================================================
// PROTECTED PAGES
// =====================================================

import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";

// =====================================================
// AUTH
// =====================================================

import ProtectedRoute from "./components/auth/ProtectedRoute";

// =====================================================
// APP
// =====================================================

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =================================================
            PUBLIC ROUTES
        ================================================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        {/* =================================================
            PROTECTED ROUTES
        ================================================= */}

        <Route element={<ProtectedRoute />}>

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          {/* Leads */}
          <Route
            path="/leads"
            element={<Leads />}
          />

        </Route>

        {/* =================================================
            ROOT ROUTE
        ================================================= */}

        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

        {/* =================================================
            404
        ================================================= */}

        <Route
          path="*"
          element={
            <div className="flex min-h-screen items-center justify-center bg-[#050507] px-6 text-white">
              <div className="text-center">

                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/[0.08] bg-white/[0.03] shadow-[0_0_60px_rgba(139,92,246,0.08)] backdrop-blur-xl">
                  <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 bg-clip-text text-3xl font-black text-transparent">
                    S
                  </span>
                </div>

                <h1 className="text-6xl font-black tracking-tight">
                  404
                </h1>

                <p className="mt-3 text-sm text-white/40">
                  The page you're looking for doesn't exist.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    window.history.back()
                  }
                  className="
                    mt-7
                    rounded-xl
                    border
                    border-violet-400/20
                    bg-violet-500/10
                    px-5
                    py-3
                    text-sm
                    font-semibold
                    text-violet-200
                    transition
                    hover:border-violet-400/40
                    hover:bg-violet-500/15
                    hover:text-white
                  "
                >
                  Go Back
                </button>

              </div>
            </div>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;