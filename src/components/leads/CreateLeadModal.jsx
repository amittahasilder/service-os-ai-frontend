import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { createLead } from "../../api/leadApi";
import { useOrganization } from "../../context/OrganizationContext";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  company: "",
  source: "website",
  priority: "medium",
  estimatedValue: "",
  nextFollowUpAt: "",
  notes: "",
};

const sourceOptions = [
  { value: "website", label: "Website" },
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "google", label: "Google" },
  { value: "referral", label: "Referral" },
  { value: "phone", label: "Phone" },
  { value: "email", label: "Email" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "walk_in", label: "Walk-in" },
  { value: "other", label: "Other" },
];

const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const CreateLeadModal = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  // =====================================================
  // ORGANIZATION
  // =====================================================

  const {
    currentOrganization,
    loading: organizationLoading,
  } = useOrganization();

  const organizationId =
    currentOrganization?._id
      ? String(
          currentOrganization._id
        ).trim()
      : "";

  // =====================================================
  // STATE
  // =====================================================

  const [form, setForm] =
    useState(initialForm);

  const [errors, setErrors] =
    useState({});

  const [submitError, setSubmitError] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  // =====================================================
  // RESET FORM
  // =====================================================

  useEffect(() => {
    if (isOpen) {
      setForm(initialForm);
      setErrors({});
      setSubmitError("");
    }
  }, [isOpen]);

  // =====================================================
  // HANDLE CHANGE
  // =====================================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setSubmitError("");
  };

  // =====================================================
  // VALIDATE FORM
  // =====================================================

  const validate = () => {
    const nextErrors = {};

    // ---------------------------------------------------
    // ORGANIZATION
    // ---------------------------------------------------

    if (!organizationId) {
      setSubmitError(
        "No business is selected. Please select a business first."
      );

      return false;
    }

    // ---------------------------------------------------
    // NAME
    // ---------------------------------------------------

    if (!form.name.trim()) {
      nextErrors.name =
        "Lead name is required.";
    } else if (
      form.name.trim().length < 2
    ) {
      nextErrors.name =
        "Lead name must be at least 2 characters.";
    }

    // ---------------------------------------------------
    // EMAIL
    // ---------------------------------------------------

    if (form.email.trim()) {
      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        !emailRegex.test(
          form.email.trim()
        )
      ) {
        nextErrors.email =
          "Enter a valid email address.";
      }
    }

    // ---------------------------------------------------
    // ESTIMATED VALUE
    // ---------------------------------------------------

    if (
      form.estimatedValue !== ""
    ) {
      const value = Number(
        form.estimatedValue
      );

      if (
        Number.isNaN(value) ||
        value < 0
      ) {
        nextErrors.estimatedValue =
          "Estimated value must be 0 or greater.";
      }
    }

    // ---------------------------------------------------
    // SAVE ERRORS
    // ---------------------------------------------------

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors)
        .length === 0
    );
  };

  // =====================================================
  // HANDLE SUBMIT
  // =====================================================

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setSubmitError("");

    // ---------------------------------------------------
    // ORGANIZATION CHECK
    // ---------------------------------------------------

    if (organizationLoading) {
      setSubmitError(
        "Business information is still loading. Please wait a moment."
      );

      return;
    }

    if (!organizationId) {
      setSubmitError(
        "No business is selected. Please select a business first."
      );

      return;
    }

    // ---------------------------------------------------
    // FORM VALIDATION
    // ---------------------------------------------------

    if (!validate()) {
      return;
    }

    // ---------------------------------------------------
    // SUBMIT
    // ---------------------------------------------------

    try {
      setSubmitting(true);

      // =================================================
      // PAYLOAD
      // =================================================

      const payload = {
        name: form.name.trim(),

        email:
          form.email.trim() ||
          undefined,

        phone:
          form.phone.trim() ||
          undefined,

        company:
          form.company.trim() ||
          undefined,

        source: form.source,

        priority: form.priority,

        estimatedValue:
          form.estimatedValue === ""
            ? 0
            : Number(
                form.estimatedValue
              ),

        nextFollowUpAt:
          form.nextFollowUpAt
            ? new Date(
                form.nextFollowUpAt
              ).toISOString()
            : null,

        notes:
          form.notes.trim() ||
          undefined,
      };

      // =================================================
      // DEBUG
      // =================================================

      console.log(
        "========================================"
      );

      console.log(
        "SERVICEOS CREATE LEAD"
      );

      console.log(
        "Organization ID:",
        organizationId
      );

      console.log(
        "Organization ID Type:",
        typeof organizationId
      );

      console.log(
        "Lead Payload:",
        payload
      );

      console.log(
        "========================================"
      );

      // =================================================
      // CREATE LEAD
      // =================================================
      //
      // IMPORTANT:
      //
      // createLead(
      //   organizationId,
      //   payload
      // )
      //
      // =================================================

      await createLead(
        organizationId,
        payload
      );

      // =================================================
      // SUCCESS
      // =================================================

      onClose?.();

      onSuccess?.();
    } catch (error) {
      console.error(
        "Create lead error:",
        error
      );

      setSubmitError(
        error?.response?.data
          ?.message ||
          error?.message ||
          "Failed to create lead. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
        >
          {/* =================================================
              BACKDROP
          ================================================= */}

          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            onClick={() => {
              if (!submitting) {
                onClose?.();
              }
            }}
          />

          {/* =================================================
              MODAL
          ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 20,
              scale: 0.97,
            }}
            transition={{
              duration: 0.22,
              ease: "easeOut",
            }}
            className="relative z-10 w-full max-w-3xl overflow-hidden rounded-3xl border border-white/[0.09] bg-[#0b0b10]/95 shadow-[0_30px_100px_rgba(0,0,0,0.65)] backdrop-blur-2xl"
          >
            {/* =================================================
                GLOW
            ================================================= */}

            <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-32 -left-20 h-64 w-64 rounded-full bg-cyan-500/[0.06] blur-3xl" />

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="relative flex items-start justify-between border-b border-white/[0.07] px-6 py-5 sm:px-7">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10">
                    <span className="text-lg text-violet-300">
                      +
                    </span>
                  </div>

                  <div>
                    <h2 className="text-lg font-bold tracking-tight text-white">
                      Create New Lead
                    </h2>

                    <p className="mt-0.5 text-xs text-white/40">
                      Add a potential customer
                      to your pipeline.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                disabled={submitting}
                onClick={() =>
                  onClose?.()
                }
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03] text-lg text-white/45 transition hover:border-white/[0.14] hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                ×
              </button>
            </div>

            {/* =================================================
                FORM
            ================================================= */}

            <form
              onSubmit={handleSubmit}
              className="relative max-h-[75vh] overflow-y-auto px-6 py-6 sm:px-7"
            >
              {/* =================================================
                  ERROR
              ================================================= */}

              {submitError && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -6,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="mb-5 rounded-2xl border border-red-400/20 bg-red-500/[0.08] px-4 py-3 text-sm text-red-300"
                >
                  {submitError}
                </motion.div>
              )}

              {/* =================================================
                  FIELDS
              ================================================= */}

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* =================================================
                    NAME
                ================================================= */}

                <Field
                  label="Lead Name"
                  required
                  error={errors.name}
                >
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. John Smith"
                    maxLength={100}
                    autoFocus
                    className={inputClass(
                      errors.name
                    )}
                  />
                </Field>

                {/* =================================================
                    EMAIL
                ================================================= */}

                <Field
                  label="Email"
                  error={errors.email}
                >
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    maxLength={150}
                    className={inputClass(
                      errors.email
                    )}
                  />
                </Field>

                {/* =================================================
                    PHONE
                ================================================= */}

                <Field label="Phone">
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+880 1XXX XXXXXX"
                    maxLength={30}
                    className={inputClass()}
                  />
                </Field>

                {/* =================================================
                    COMPANY
                ================================================= */}

                <Field label="Company">
                  <input
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="Company name"
                    maxLength={150}
                    className={inputClass()}
                  />
                </Field>

                {/* =================================================
                    SOURCE
                ================================================= */}

                <Field
                  label="Source"
                  required
                >
                  <select
                    name="source"
                    value={form.source}
                    onChange={handleChange}
                    className={selectClass}
                  >
                    {sourceOptions.map(
                      (option) => (
                        <option
                          key={
                            option.value
                          }
                          value={
                            option.value
                          }
                          className="bg-[#111118]"
                        >
                          {option.label}
                        </option>
                      )
                    )}
                  </select>
                </Field>

                {/* =================================================
                    PRIORITY
                ================================================= */}

                <Field
                  label="Priority"
                  required
                >
                  <select
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                    className={selectClass}
                  >
                    {priorityOptions.map(
                      (option) => (
                        <option
                          key={
                            option.value
                          }
                          value={
                            option.value
                          }
                          className="bg-[#111118]"
                        >
                          {option.label}
                        </option>
                      )
                    )}
                  </select>
                </Field>

                {/* =================================================
                    ESTIMATED VALUE
                ================================================= */}

                <Field
                  label="Estimated Value"
                  error={
                    errors.estimatedValue
                  }
                >
                  <input
                    name="estimatedValue"
                    type="number"
                    min="0"
                    step="0.01"
                    value={
                      form.estimatedValue
                    }
                    onChange={handleChange}
                    placeholder="0"
                    className={inputClass(
                      errors.estimatedValue
                    )}
                  />
                </Field>

                {/* =================================================
                    FOLLOW UP
                ================================================= */}

                <Field label="Next Follow-up">
                  <input
                    name="nextFollowUpAt"
                    type="datetime-local"
                    value={
                      form.nextFollowUpAt
                    }
                    onChange={handleChange}
                    className={inputClass()}
                  />
                </Field>

                {/* =================================================
                    NOTES
                ================================================= */}

                <div className="sm:col-span-2">
                  <Field label="Notes">
                    <textarea
                      name="notes"
                      value={form.notes}
                      onChange={handleChange}
                      placeholder="Add any useful notes about this lead..."
                      maxLength={2000}
                      rows={4}
                      className={`${inputClass()} min-h-[110px] resize-y`}
                    />

                    <div className="mt-1.5 text-right text-[11px] text-white/25">
                      {
                        form.notes.length
                      }
                      /2000
                    </div>
                  </Field>
                </div>
              </div>

              {/* =================================================
                  FOOTER
              ================================================= */}

              <div className="mt-7 flex flex-col-reverse gap-3 border-t border-white/[0.07] pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() =>
                    onClose?.()
                  }
                  className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 py-2.5 text-sm font-semibold text-white/65 transition hover:border-white/[0.15] hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    submitting ||
                    organizationLoading
                  }
                  className="rounded-xl border border-violet-400/25 bg-gradient-to-r from-violet-600/90 to-purple-600/90 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_35px_rgba(124,58,237,0.22)] transition hover:from-violet-500 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                      Creating...
                    </span>
                  ) : organizationLoading ? (
                    "Loading business..."
                  ) : (
                    "Create Lead"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// =========================================================
// FIELD COMPONENT
// =========================================================

const Field = ({
  label,
  required,
  error,
  children,
}) => {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-white/60">
        {label}

        {required && (
          <span className="ml-1 text-violet-400">
            *
          </span>
        )}
      </label>

      {children}

      {error && (
        <p className="mt-1.5 text-[11px] text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};

// =========================================================
// INPUT CLASS
// =========================================================

const inputClass = (
  error = ""
) =>
  `w-full rounded-xl border ${
    error
      ? "border-red-400/40 bg-red-500/[0.04]"
      : "border-white/[0.08] bg-white/[0.035]"
  } px-3.5 py-2.5 text-sm text-white outline-none placeholder:text-white/25 transition focus:border-violet-400/40 focus:bg-white/[0.05] focus:ring-2 focus:ring-violet-500/10`;

// =========================================================
// SELECT CLASS
// =========================================================

const selectClass =
  "w-full rounded-xl border border-white/[0.08] bg-white/[0.035] px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-violet-400/40 focus:ring-2 focus:ring-violet-500/10";

// =========================================================
// EXPORT
// =========================================================

export default CreateLeadModal;