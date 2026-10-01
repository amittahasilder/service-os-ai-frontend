import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getLead, updateLead } from "../../api/leadApi";

// =====================================
// CONSTANTS
// =====================================

const SOURCE_OPTIONS = [
  { value: "website", label: "Website" },
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "google", label: "Google" },
  { value: "referral", label: "Referral" },
  { value: "phone", label: "Phone" },
  { value: "email", label: "Email" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "walk_in", label: "Walk In" },
  { value: "other", label: "Other" },
];

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

// =====================================
// EMPTY FORM
// =====================================

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  company: "",
  source: "other",
  priority: "medium",
  estimatedValue: "",
  nextFollowUpAt: "",
  notes: "",
};

// =====================================
// DATE HELPERS
// =====================================

// Convert backend ISO date → datetime-local value
const formatDateTimeLocal = (dateValue) => {
  if (!dateValue) return "";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Convert datetime-local → ISO string
const toISOStringOrNull = (value) => {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
};

// =====================================
// ANIMATION
// =====================================

const backdropVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.18,
    },
  },
};

const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: 12,
    transition: {
      duration: 0.18,
    },
  },
};

// =====================================
// INPUT STYLES
// =====================================

const inputClass = `
  w-full
  rounded-xl
  border
  border-white/10
  bg-white/[0.045]
  px-4
  py-3
  text-sm
  text-white
  placeholder:text-white/30
  outline-none
  transition-all
  duration-200
  focus:border-violet-400/50
  focus:bg-white/[0.07]
  focus:ring-2
  focus:ring-violet-500/10
`;

const selectClass = `
  w-full
  rounded-xl
  border
  border-white/10
  bg-[#11111a]
  px-4
  py-3
  text-sm
  text-white
  outline-none
  transition-all
  duration-200
  focus:border-violet-400/50
  focus:ring-2
  focus:ring-violet-500/10
`;

const textareaClass = `
  w-full
  resize-none
  rounded-xl
  border
  border-white/10
  bg-white/[0.045]
  px-4
  py-3
  text-sm
  text-white
  placeholder:text-white/30
  outline-none
  transition-all
  duration-200
  focus:border-violet-400/50
  focus:bg-white/[0.07]
  focus:ring-2
  focus:ring-violet-500/10
`;

// =====================================
// FIELD COMPONENT
// =====================================

const Field = ({
  label,
  required = false,
  children,
  error,
  hint,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <label className="text-xs font-medium uppercase tracking-[0.12em] text-white/55">
          {label}

          {required && (
            <span className="ml-1 text-red-400">
              *
            </span>
          )}
        </label>

        {hint && (
          <span className="text-[11px] text-white/25">
            {hint}
          </span>
        )}
      </div>

      {children}

      {error && (
        <p className="text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};

// =====================================
// COMPONENT
// =====================================

const EditLeadModal = ({
  isOpen,
  lead,
  onClose,
  onSuccess,
}) => {
  const [form, setForm] = useState(EMPTY_FORM);

  const [loadingLead, setLoadingLead] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  // =====================================
  // LOAD LEAD
  // =====================================

  useEffect(() => {
    if (!isOpen || !lead?._id) {
      return;
    }

    let mounted = true;

    const loadLeadData = async () => {
      setLoadingLead(true);
      setError("");
      setFieldErrors({});

      try {
        const response = await getLead(lead._id);

        if (!mounted) return;

        const leadData =
          response?.data ||
          response?.lead ||
          response;

        setForm({
          name: leadData?.name || "",
          email: leadData?.email || "",
          phone: leadData?.phone || "",
          company: leadData?.company || "",
          source: leadData?.source || "other",
          priority: leadData?.priority || "medium",
          estimatedValue:
            leadData?.estimatedValue !== undefined &&
            leadData?.estimatedValue !== null
              ? String(leadData.estimatedValue)
              : "",
          nextFollowUpAt: formatDateTimeLocal(
            leadData?.nextFollowUpAt
          ),
          notes: leadData?.notes || "",
        });
      } catch (err) {
        if (!mounted) return;

        console.error(
          "Failed to load lead:",
          err
        );

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load lead information."
        );
      } finally {
        if (mounted) {
          setLoadingLead(false);
        }
      }
    };

    loadLeadData();

    return () => {
      mounted = false;
    };
  }, [isOpen, lead?._id]);

  // =====================================
  // RESET WHEN CLOSED
  // =====================================

  useEffect(() => {
    if (!isOpen) {
      setForm(EMPTY_FORM);
      setError("");
      setFieldErrors({});
      setLoadingLead(false);
      setSaving(false);
    }
  }, [isOpen]);

  // =====================================
  // INPUT HANDLER
  // =====================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (fieldErrors[name]) {
      setFieldErrors((previous) => {
        const updated = {
          ...previous,
        };

        delete updated[name];

        return updated;
      });
    }

    if (error) {
      setError("");
    }
  };

  // =====================================
  // VALIDATION
  // =====================================

  const validateForm = () => {
    const errors = {};

    const name = form.name.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();
    const company = form.company.trim();
    const notes = form.notes.trim();

    // Name
    if (!name) {
      errors.name = "Lead name is required.";
    } else if (name.length < 2) {
      errors.name =
        "Lead name must be at least 2 characters.";
    } else if (name.length > 100) {
      errors.name =
        "Lead name cannot exceed 100 characters.";
    }

    // Email
    if (email) {
      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        errors.email =
          "Please enter a valid email address.";
      }

      if (email.length > 150) {
        errors.email =
          "Email cannot exceed 150 characters.";
      }
    }

    // Phone
    if (phone.length > 30) {
      errors.phone =
        "Phone cannot exceed 30 characters.";
    }

    // Company
    if (company.length > 150) {
      errors.company =
        "Company cannot exceed 150 characters.";
    }

    // Estimated Value
    if (form.estimatedValue !== "") {
      const numericValue = Number(
        form.estimatedValue
      );

      if (
        Number.isNaN(numericValue) ||
        numericValue < 0
      ) {
        errors.estimatedValue =
          "Estimated value must be a valid positive number.";
      }
    }

    // Notes
    if (notes.length > 2000) {
      errors.notes =
        "Notes cannot exceed 2000 characters.";
    }

    // Date
    if (form.nextFollowUpAt) {
      const date = new Date(
        form.nextFollowUpAt
      );

      if (Number.isNaN(date.getTime())) {
        errors.nextFollowUpAt =
          "Please enter a valid follow-up date.";
      }
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  };

  // =====================================
  // SUBMIT
  // =====================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!lead?._id) {
      setError("Lead information is missing.");
      return;
    }

    setError("");

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    setSaving(true);

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim() || undefined,
        phone: form.phone.trim() || undefined,
        company: form.company.trim() || undefined,

        source:
          form.source || "other",

        priority:
          form.priority || "medium",

        estimatedValue:
          form.estimatedValue === ""
            ? 0
            : Number(form.estimatedValue),

        nextFollowUpAt:
          toISOStringOrNull(
            form.nextFollowUpAt
          ),

        notes:
          form.notes.trim() || undefined,
      };

      await updateLead(
        lead._id,
        payload
      );

      // Refresh parent data
      if (onSuccess) {
        await onSuccess();
      }

      // Close modal
      if (onClose) {
        onClose();
      }
    } catch (err) {
      console.error(
        "Failed to update lead:",
        err
      );

      const responseMessage =
        err?.response?.data?.message;

      setError(
        responseMessage ||
          err?.message ||
          "Failed to update lead. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================
  // CLOSE HANDLER
  // =====================================

  const handleClose = () => {
    if (saving) return;

    if (onClose) {
      onClose();
    }
  };

  // =====================================
  // ESC KEY
  // =====================================

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !saving) {
        handleClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [isOpen, saving]);

  // =====================================
  // RENDER
  // =====================================

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* ================================= */}
          {/* BACKDROP */}
          {/* ================================= */}

          <motion.button
            type="button"
            aria-label="Close edit lead modal"
            className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-md"
            onClick={handleClose}
            disabled={saving}
          />

          {/* ================================= */}
          {/* MODAL */}
          {/* ================================= */}

          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-lead-title"
            className="
              relative
              z-10
              flex
              max-h-[92vh]
              w-full
              max-w-3xl
              flex-col
              overflow-hidden
              rounded-3xl
              border
              border-white/10
              bg-[#09090f]/95
              shadow-2xl
              shadow-black/50
              backdrop-blur-2xl
            "
          >
            {/* ================================= */}
            {/* TOP GLOW */}
            {/* ================================= */}

            <div className="pointer-events-none absolute left-1/2 top-0 h-32 w-2/3 -translate-x-1/2 rounded-full bg-violet-600/10 blur-3xl" />

            {/* ================================= */}
            {/* HEADER */}
            {/* ================================= */}

            <div className="relative flex items-center justify-between border-b border-white/10 px-5 py-5 sm:px-7">
              <div className="flex min-w-0 items-center gap-4">
                {/* Icon */}
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5 text-violet-300"
                  >
                    <path
                      d="M12 20h9"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />

                    <path
                      d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <div className="min-w-0">
                  <h2
                    id="edit-lead-title"
                    className="truncate text-lg font-semibold text-white"
                  >
                    Edit Lead
                  </h2>

                  <p className="mt-0.5 text-xs text-white/40">
                    Update lead information and follow-up details
                  </p>
                </div>
              </div>

              {/* Close */}
              <button
                type="button"
                onClick={handleClose}
                disabled={saving}
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-white/10
                  bg-white/[0.04]
                  text-white/50
                  transition
                  hover:bg-white/[0.08]
                  hover:text-white
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
                aria-label="Close"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4"
                >
                  <path
                    d="M6 6l12 12M18 6 6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {/* ================================= */}
            {/* CONTENT */}
            {/* ================================= */}

            <div className="overflow-y-auto px-5 py-6 sm:px-7">
              {/* Loading */}
              {loadingLead ? (
                <div className="flex min-h-[420px] flex-col items-center justify-center">
                  <div className="relative h-12 w-12">
                    <div className="absolute inset-0 rounded-full border-2 border-white/10" />

                    <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-violet-400" />
                  </div>

                  <p className="mt-4 text-sm text-white/50">
                    Loading lead information...
                  </p>
                </div>
              ) : (
                <form
                  id="edit-lead-form"
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  {/* ================================= */}
                  {/* ERROR */}
                  {/* ================================= */}

                  <AnimatePresence>
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
                        exit={{
                          opacity: 0,
                          y: -8,
                        }}
                        className="
                          flex
                          items-start
                          gap-3
                          rounded-2xl
                          border
                          border-red-400/20
                          bg-red-500/10
                          px-4
                          py-3
                        "
                      >
                        <div className="mt-0.5 shrink-0">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="h-5 w-5 text-red-400"
                          >
                            <circle
                              cx="12"
                              cy="12"
                              r="9"
                              stroke="currentColor"
                              strokeWidth="1.8"
                            />

                            <path
                              d="M12 8v4"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                            />

                            <circle
                              cx="12"
                              cy="16"
                              r="1"
                              fill="currentColor"
                            />
                          </svg>
                        </div>

                        <p className="text-sm leading-5 text-red-300">
                          {error}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ================================= */}
                  {/* BASIC INFORMATION */}
                  {/* ================================= */}

                  <section>
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-white">
                        Basic Information
                      </h3>

                      <p className="mt-1 text-xs text-white/35">
                        Keep the lead's contact information up to date.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      {/* Name */}
                      <Field
                        label="Lead Name"
                        required
                        error={fieldErrors.name}
                      >
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="e.g. John Smith"
                          maxLength={100}
                          className={inputClass}
                          autoComplete="name"
                          disabled={saving}
                        />
                      </Field>

                      {/* Email */}
                      <Field
                        label="Email"
                        error={fieldErrors.email}
                      >
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          maxLength={150}
                          className={inputClass}
                          autoComplete="email"
                          disabled={saving}
                        />
                      </Field>

                      {/* Phone */}
                      <Field
                        label="Phone"
                        error={fieldErrors.phone}
                      >
                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="+880 1XXX-XXXXXX"
                          maxLength={30}
                          className={inputClass}
                          autoComplete="tel"
                          disabled={saving}
                        />
                      </Field>

                      {/* Company */}
                      <Field
                        label="Company"
                        error={fieldErrors.company}
                      >
                        <input
                          type="text"
                          name="company"
                          value={form.company}
                          onChange={handleChange}
                          placeholder="Company name"
                          maxLength={150}
                          className={inputClass}
                          autoComplete="organization"
                          disabled={saving}
                        />
                      </Field>
                    </div>
                  </section>

                  {/* ================================= */}
                  {/* LEAD DETAILS */}
                  {/* ================================= */}

                  <section>
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-white">
                        Lead Details
                      </h3>

                      <p className="mt-1 text-xs text-white/35">
                        Manage source, priority and estimated opportunity value.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      {/* Source */}
                      <Field label="Source">
                        <select
                          name="source"
                          value={form.source}
                          onChange={handleChange}
                          className={selectClass}
                          disabled={saving}
                        >
                          {SOURCE_OPTIONS.map(
                            (option) => (
                              <option
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </option>
                            )
                          )}
                        </select>
                      </Field>

                      {/* Priority */}
                      <Field label="Priority">
                        <select
                          name="priority"
                          value={form.priority}
                          onChange={handleChange}
                          className={selectClass}
                          disabled={saving}
                        >
                          {PRIORITY_OPTIONS.map(
                            (option) => (
                              <option
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </option>
                            )
                          )}
                        </select>
                      </Field>

                      {/* Estimated Value */}
                      <Field
                        label="Estimated Value"
                        error={
                          fieldErrors.estimatedValue
                        }
                        hint="Optional"
                      >
                        <div className="relative">
                          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-white/35">
                            $
                          </span>

                          <input
                            type="number"
                            name="estimatedValue"
                            value={
                              form.estimatedValue
                            }
                            onChange={handleChange}
                            placeholder="0"
                            min="0"
                            step="0.01"
                            className={`${inputClass} pl-8`}
                            disabled={saving}
                          />
                        </div>
                      </Field>

                      {/* Follow Up */}
                      <Field
                        label="Next Follow-up"
                        error={
                          fieldErrors.nextFollowUpAt
                        }
                      >
                        <input
                          type="datetime-local"
                          name="nextFollowUpAt"
                          value={
                            form.nextFollowUpAt
                          }
                          onChange={handleChange}
                          className={inputClass}
                          disabled={saving}
                        />
                      </Field>
                    </div>
                  </section>

                  {/* ================================= */}
                  {/* NOTES */}
                  {/* ================================= */}

                  <section>
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-white">
                        Notes
                      </h3>

                      <p className="mt-1 text-xs text-white/35">
                        Add useful context for future conversations.
                      </p>
                    </div>

                    <Field
                      label="Lead Notes"
                      hint={`${form.notes.length}/2000`}
                      error={fieldErrors.notes}
                    >
                      <textarea
                        name="notes"
                        value={form.notes}
                        onChange={handleChange}
                        placeholder="Add notes about this lead..."
                        rows={5}
                        maxLength={2000}
                        className={textareaClass}
                        disabled={saving}
                      />
                    </Field>
                  </section>
                </form>
              )}
            </div>

            {/* ================================= */}
            {/* FOOTER */}
            {/* ================================= */}

            {!loadingLead && (
              <div className="relative flex flex-col-reverse gap-3 border-t border-white/10 bg-white/[0.015] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                <p className="hidden text-[11px] text-white/25 sm:block">
                  Changes will be saved to this organization.
                </p>

                <div className="flex w-full flex-col-reverse gap-3 sm:w-auto sm:flex-row">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={saving}
                    className="
                      w-full
                      rounded-xl
                      border
                      border-white/10
                      bg-white/[0.04]
                      px-5
                      py-3
                      text-sm
                      font-medium
                      text-white/65
                      transition
                      hover:bg-white/[0.08]
                      hover:text-white
                      disabled:cursor-not-allowed
                      disabled:opacity-40
                      sm:w-auto
                    "
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    form="edit-lead-form"
                    disabled={saving}
                    className="
                      group
                      relative
                      flex
                      w-full
                      items-center
                      justify-center
                      gap-2
                      overflow-hidden
                      rounded-xl
                      border
                      border-violet-400/20
                      bg-violet-500/15
                      px-5
                      py-3
                      text-sm
                      font-semibold
                      text-violet-100
                      shadow-lg
                      shadow-violet-950/20
                      transition-all
                      duration-200
                      hover:border-violet-300/30
                      hover:bg-violet-500/25
                      hover:shadow-violet-900/30
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                      sm:w-auto
                    "
                  >
                    {/* Button glow */}
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                    {saving ? (
                      <>
                        <span className="relative h-4 w-4 animate-spin rounded-full border-2 border-violet-200/30 border-t-violet-200" />

                        <span className="relative">
                          Saving...
                        </span>
                      </>
                    ) : (
                      <>
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          className="relative h-4 w-4"
                        >
                          <path
                            d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinejoin="round"
                          />

                          <path
                            d="M17 21v-6H7v6M7 3v5h8"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinejoin="round"
                          />
                        </svg>

                        <span className="relative">
                          Save Changes
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditLeadModal;