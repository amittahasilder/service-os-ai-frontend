
// import { useCallback, useEffect, useMemo, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   CalendarDays,
//   Clock3,
//   Plus,
//   Search,
//   RefreshCw,
//   Users,
//   CalendarCheck,
//   CircleDollarSign,
//   CheckCircle2,
//   XCircle,
//   AlertCircle,
//   LoaderCircle,
//   X,
//   Pencil,
//   MapPin,
//   UserRound,
//   BriefcaseBusiness,
//   Filter,
//   ChevronDown,
//   RotateCcw,
//   CalendarClock,
// } from "lucide-react";

// import DashboardLayout from "../layouts/DashboardLayout";
// import { useOrganization } from "../context/OrganizationContext";

// import {
//   getBookings,
//   getBookingStats,
//   createBooking,
//   updateBooking,
//   cancelBooking,
// } from "../api/bookingApi";

// import { getCustomers } from "../api/customerApi";
// import { getServices } from "../api/serviceApi";
// import { getStaff } from "../api/staffApi";

// // =====================================================
// // CONSTANTS
// // =====================================================

// const STATUS_OPTIONS = [
//   { value: "pending", label: "Pending" },
//   { value: "confirmed", label: "Confirmed" },
//   { value: "in_progress", label: "In Progress" },
//   { value: "completed", label: "Completed" },
//   { value: "cancelled", label: "Cancelled" },
//   { value: "no_show", label: "No Show" },
// ];

// const STATUS_STYLES = {
//   pending: "border-amber-400/20 bg-amber-400/10 text-amber-300",
//   confirmed: "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",
//   in_progress: "border-violet-400/20 bg-violet-400/10 text-violet-300",
//   completed: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
//   cancelled: "border-rose-400/20 bg-rose-400/10 text-rose-300",
//   no_show: "border-slate-400/20 bg-slate-400/10 text-slate-300",
// };

// const ALLOWED_TRANSITIONS = {
//   pending: ["confirmed", "cancelled", "no_show"],
//   confirmed: ["in_progress", "cancelled", "no_show"],
//   in_progress: ["completed", "cancelled"],
//   completed: [],
//   cancelled: [],
//   no_show: [],
// };

// const EMPTY_FORM = {
//   customer: "",
//   service: "",
//   staff: "",
//   bookingDate: "",
//   startTime: "09:00",
//   endTime: "10:00",
//   address: "",
//   city: "",
//   postalCode: "",
//   locationNotes: "",
//   notes: "",
// };

// // =====================================================
// // RESPONSE HELPERS
// // =====================================================

// const getArray = (response) => {
//   if (Array.isArray(response?.data)) return response.data;
//   if (Array.isArray(response?.data?.data)) return response.data.data;
//   if (Array.isArray(response)) return response;
//   return [];
// };

// const getObject = (response) => {
//   if (response?.data && !Array.isArray(response.data)) {
//     return response.data;
//   }
//   return response || {};
// };

// const getId = (item) => item?._id || item?.id || "";

// const getDisplayName = (item, fallback = "Unknown") => {
//   if (!item) return fallback;
//   return item.name || item.fullName || item.email || fallback;
// };

// const getErrorMessage = (error) =>
//   error?.response?.data?.message ||
//   error?.response?.data?.error ||
//   error?.message ||
//   "Something went wrong. Please try again.";

// const formatMoney = (amount) =>
//   new Intl.NumberFormat("en-BD", {
//     style: "currency",
//     currency: "BDT",
//     maximumFractionDigits: 2,
//   }).format(Number(amount || 0));

// const formatDate = (date) => {
//   if (!date) return "Date not set";

//   const parsed = new Date(date);
//   if (Number.isNaN(parsed.getTime())) return "Invalid date";

//   return parsed.toLocaleDateString("en-BD", {
//     day: "numeric",
//     month: "short",
//     year: "numeric",
//   });
// };

// const toDateInput = (date) => {
//   if (!date) return "";

//   const parsed = new Date(date);
//   if (Number.isNaN(parsed.getTime())) return "";

//   const year = parsed.getFullYear();
//   const month = String(parsed.getMonth() + 1).padStart(2, "0");
//   const day = String(parsed.getDate()).padStart(2, "0");

//   return `${year}-${month}-${day}`;
// };

// const getInitials = (name = "") =>
//   name
//     .trim()
//     .split(/\s+/)
//     .slice(0, 2)
//     .map((part) => part[0]?.toUpperCase() || "")
//     .join("") || "?";

// // =====================================================
// // SMALL UI COMPONENTS
// // =====================================================

// function StatusBadge({ status }) {
//   const normalizedStatus = status || "pending";

//   return (
//     <span
//       className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
//         STATUS_STYLES[normalizedStatus] || STATUS_STYLES.pending
//       }`}
//     >
//       <span className="h-1.5 w-1.5 rounded-full bg-current" />
//       {STATUS_OPTIONS.find((item) => item.value === normalizedStatus)?.label ||
//         normalizedStatus}
//     </span>
//   );
// }

// function StatCard({ title, value, subtitle, icon: Icon, accent, loading }) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 14 }}
//       animate={{ opacity: 1, y: 0 }}
//       whileHover={{ y: -4 }}
//       transition={{ duration: 0.2 }}
//       className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5 shadow-xl shadow-black/10 backdrop-blur-xl"
//     >
//       <div
//         className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl ${accent}`}
//       />

//       <div className="relative flex items-start justify-between gap-3">
//         <div className="min-w-0">
//           <p className="text-sm text-slate-400">{title}</p>

//           <div className="mt-3 text-2xl font-bold tracking-tight text-white">
//             {loading ? (
//               <LoaderCircle className="h-6 w-6 animate-spin text-violet-300" />
//             ) : (
//               value
//             )}
//           </div>

//           <p className="mt-2 text-xs text-slate-500">{subtitle}</p>
//         </div>

//         <div className="rounded-xl border border-white/10 bg-white/[0.06] p-3 text-violet-200 transition group-hover:border-violet-400/30 group-hover:bg-violet-500/10">
//           <Icon className="h-5 w-5" />
//         </div>
//       </div>
//     </motion.div>
//   );
// }

// function FormField({ label, children, required }) {
//   return (
//     <label className="block min-w-0">
//       <span className="mb-2 block text-sm font-medium text-slate-300">
//         {label}
//         {required && <span className="ml-1 text-rose-400">*</span>}
//       </span>
//       {children}
//     </label>
//   );
// }

// const inputClass =
//   "w-full rounded-xl border border-white/10 bg-[#11101b] px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/10";

// function EmptyState({ title, description, onReset }) {
//   return (
//     <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
//       <div className="mb-4 rounded-2xl border border-violet-400/15 bg-violet-500/10 p-4">
//         <CalendarDays className="h-8 w-8 text-violet-300" />
//       </div>

//       <h3 className="text-lg font-semibold text-white">{title}</h3>
//       <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
//         {description}
//       </p>

//       {onReset && (
//         <button
//           type="button"
//           onClick={onReset}
//           className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-white/[0.06]"
//         >
//           <RotateCcw className="h-4 w-4" />
//           Clear filters
//         </button>
//       )}
//     </div>
//   );
// }

// // =====================================================
// // CREATE / EDIT MODAL
// // =====================================================

// function BookingModal({
//   booking,
//   customers,
//   services,
//   staffMembers,
//   saving,
//   onClose,
//   onSubmit,
// }) {
//   const [form, setForm] = useState(() => {
//     if (!booking) {
//       return {
//         ...EMPTY_FORM,
//         bookingDate: toDateInput(new Date()),
//       };
//     }

//     return {
//       customer: getId(booking.customer),
//       service: getId(booking.service),
//       staff: getId(booking.staff),
//       bookingDate: toDateInput(booking.bookingDate),
//       startTime: booking.startTime || "09:00",
//       endTime: booking.endTime || "10:00",
//       address: booking.location?.address || "",
//       city: booking.location?.city || "",
//       postalCode: booking.location?.postalCode || "",
//       locationNotes: booking.location?.notes || "",
//       notes: booking.notes || "",
//     };
//   });

//   const [formError, setFormError] = useState("");

//   const change = (event) => {
//     const { name, value } = event.target;

//     setForm((previous) => ({
//       ...previous,
//       [name]: value,
//     }));
//   };

//   const submit = async (event) => {
//     event.preventDefault();
//     setFormError("");

//     if (!form.customer || !form.service) {
//       setFormError("Please select a customer and service.");
//       return;
//     }

//     if (!form.bookingDate || !form.startTime || !form.endTime) {
//       setFormError("Date, start time and end time are required.");
//       return;
//     }

//     if (form.startTime >= form.endTime) {
//       setFormError("End time must be later than start time.");
//       return;
//     }

//     const selectedService = services.find(
//       (item) => getId(item) === form.service
//     );

//     if (!selectedService) {
//       setFormError("The selected service is no longer available.");
//       return;
//     }

//     // Convert the selected date to a valid ISO datetime.
//     const bookingDate = new Date(
//       `${form.bookingDate}T00:00:00`
//     ).toISOString();

//     const bookingData = {
//       customer: form.customer,
//       service: form.service,
//       bookingDate,
//       startTime: form.startTime,
//       endTime: form.endTime,
//       location: {
//         ...(form.address.trim() ? { address: form.address.trim() } : {}),
//         ...(form.city.trim() ? { city: form.city.trim() } : {}),
//         ...(form.postalCode.trim()
//           ? { postalCode: form.postalCode.trim() }
//           : {}),
//         ...(form.locationNotes.trim()
//           ? { notes: form.locationNotes.trim() }
//           : {}),
//       },
//       ...(form.notes.trim() ? { notes: form.notes.trim() } : {}),
//     };

//     if (form.staff) {
//       bookingData.staff = form.staff;
//     } else if (booking) {
//       // Update schema permits null when unassigning staff.
//       bookingData.staff = null;
//     }

//     try {
//       await onSubmit(bookingData);
//     } catch (error) {
//       setFormError(getErrorMessage(error));
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-[100] flex items-end justify-center overflow-y-auto bg-black/75 p-0 backdrop-blur-md sm:items-center sm:p-5">
//       <motion.div
//         initial={{ opacity: 0, y: 20, scale: 0.98 }}
//         animate={{ opacity: 1, y: 0, scale: 1 }}
//         exit={{ opacity: 0, y: 12, scale: 0.99 }}
//         transition={{ duration: 0.2 }}
//         className="my-auto max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl border border-white/10 bg-[#11101b] shadow-2xl shadow-black/50 sm:rounded-3xl"
//       >
//         <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/[0.08] bg-[#11101b]/95 px-5 py-4 backdrop-blur-xl sm:px-7">
//           <div>
//             <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
//               Booking Management
//             </p>
//             <h2 className="mt-1 text-xl font-bold text-white">
//               {booking ? "Edit booking" : "Create booking"}
//             </h2>
//           </div>

//           <button
//             type="button"
//             onClick={onClose}
//             disabled={saving}
//             aria-label="Close modal"
//             className="rounded-xl border border-white/10 p-2.5 text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
//           >
//             <X className="h-5 w-5" />
//           </button>
//         </div>

//         <form onSubmit={submit} className="space-y-6 p-5 sm:p-7">
//           {formError && (
//             <div className="flex gap-3 rounded-xl border border-rose-400/20 bg-rose-500/10 p-3.5 text-sm text-rose-200">
//               <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
//               <p>{formError}</p>
//             </div>
//           )}

//           <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
//             <FormField label="Customer" required>
//               <select
//                 name="customer"
//                 value={form.customer}
//                 onChange={change}
//                 required
//                 className={inputClass}
//               >
//                 <option value="">Select customer</option>
//                 {customers.map((customer) => (
//                   <option key={getId(customer)} value={getId(customer)}>
//                     {getDisplayName(customer)}
//                     {customer.email ? ` — ${customer.email}` : ""}
//                   </option>
//                 ))}
//               </select>
//             </FormField>

//             <FormField label="Service" required>
//               <select
//                 name="service"
//                 value={form.service}
//                 onChange={change}
//                 required
//                 className={inputClass}
//               >
//                 <option value="">Select service</option>
//                 {services.map((service) => (
//                   <option key={getId(service)} value={getId(service)}>
//                     {getDisplayName(service)}
//                     {service.price != null
//                       ? ` — ${formatMoney(service.price)}`
//                       : ""}
//                   </option>
//                 ))}
//               </select>
//             </FormField>

//             <FormField label="Assign staff">
//               <select
//                 name="staff"
//                 value={form.staff}
//                 onChange={change}
//                 className={inputClass}
//               >
//                 <option value="">Unassigned</option>
//                 {staffMembers.map((member) => (
//                   <option key={getId(member)} value={getId(member)}>
//                     {getDisplayName(member)}
//                     {member.jobTitle ? ` — ${member.jobTitle}` : ""}
//                   </option>
//                 ))}
//               </select>
//               <span className="mt-1.5 block text-xs text-slate-500">
//                 Staff assignment is optional.
//               </span>
//             </FormField>

//             <FormField label="Booking date" required>
//               <input
//                 type="date"
//                 name="bookingDate"
//                 value={form.bookingDate}
//                 onChange={change}
//                 required
//                 className={inputClass}
//               />
//             </FormField>

//             <FormField label="Start time" required>
//               <input
//                 type="time"
//                 name="startTime"
//                 value={form.startTime}
//                 onChange={change}
//                 required
//                 className={inputClass}
//               />
//             </FormField>

//             <FormField label="End time" required>
//               <input
//                 type="time"
//                 name="endTime"
//                 value={form.endTime}
//                 onChange={change}
//                 required
//                 className={inputClass}
//               />
//             </FormField>
//           </div>

//           <div className="border-t border-white/[0.08] pt-5">
//             <div className="mb-4 flex items-center gap-2">
//               <MapPin className="h-4 w-4 text-violet-300" />
//               <h3 className="font-semibold text-white">Service location</h3>
//               <span className="text-xs text-slate-500">Optional</span>
//             </div>

//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//               <FormField label="Address">
//                 <input
//                   name="address"
//                   value={form.address}
//                   onChange={change}
//                   maxLength={500}
//                   placeholder="Street address"
//                   className={inputClass}
//                 />
//               </FormField>

//               <FormField label="City">
//                 <input
//                   name="city"
//                   value={form.city}
//                   onChange={change}
//                   maxLength={100}
//                   placeholder="City"
//                   className={inputClass}
//                 />
//               </FormField>

//               <FormField label="Postal code">
//                 <input
//                   name="postalCode"
//                   value={form.postalCode}
//                   onChange={change}
//                   maxLength={20}
//                   placeholder="Postal code"
//                   className={inputClass}
//                 />
//               </FormField>

//               <FormField label="Location notes">
//                 <input
//                   name="locationNotes"
//                   value={form.locationNotes}
//                   onChange={change}
//                   maxLength={1000}
//                   placeholder="Directions or access notes"
//                   className={inputClass}
//                 />
//               </FormField>
//             </div>
//           </div>

//           <FormField label="Booking notes">
//             <textarea
//               name="notes"
//               value={form.notes}
//               onChange={change}
//               maxLength={2000}
//               rows={3}
//               placeholder="Add special instructions..."
//               className={`${inputClass} resize-y`}
//             />
//           </FormField>

//           <div className="flex flex-col-reverse gap-3 border-t border-white/[0.08] pt-5 sm:flex-row sm:justify-end">
//             <button
//               type="button"
//               onClick={onClose}
//               disabled={saving}
//               className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.05] disabled:opacity-50"
//             >
//               Cancel
//             </button>

//             <button
//               type="submit"
//               disabled={saving}
//               className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/40 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
//             >
//               {saving ? (
//                 <LoaderCircle className="h-4 w-4 animate-spin" />
//               ) : (
//                 <CalendarCheck className="h-4 w-4" />
//               )}
//               {saving
//                 ? "Saving..."
//                 : booking
//                   ? "Save changes"
//                   : "Create booking"}
//             </button>
//           </div>
//         </form>
//       </motion.div>
//     </div>
//   );
// }

// // =====================================================
// // MAIN PAGE
// // =====================================================

// export default function Bookings() {
//   const organizationContext = useOrganization();
//   const currentOrganization =
//     organizationContext?.currentOrganization;

//   const organizationId = getId(currentOrganization);

//   const [bookings, setBookings] = useState([]);
//   const [customers, setCustomers] = useState([]);
//   const [services, setServices] = useState([]);
//   const [staffMembers, setStaffMembers] = useState([]);
//   const [stats, setStats] = useState({
//     totalBookings: 0,
//     totalValue: 0,
//     byStatus: [],
//   });

//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [pageError, setPageError] = useState("");

//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [dateFilter, setDateFilter] = useState("");

//   const [showModal, setShowModal] = useState(false);
//   const [editingBooking, setEditingBooking] = useState(null);
//   const [cancelTarget, setCancelTarget] = useState(null);
//   const [actionError, setActionError] = useState("");
//   const [statusUpdatingId, setStatusUpdatingId] = useState("");

//   // ---------------------------------------------------
//   // LOAD BOOKINGS + LOOKUP DATA
//   // ---------------------------------------------------

//   const loadData = useCallback(
//     async ({ silent = false } = {}) => {
//       if (!organizationId) {
//         setBookings([]);
//         setCustomers([]);
//         setServices([]);
//         setStaffMembers([]);
//         setStats({
//           totalBookings: 0,
//           totalValue: 0,
//           byStatus: [],
//         });
//         setLoading(false);
//         return;
//       }

//       if (silent) {
//         setRefreshing(true);
//       } else {
//         setLoading(true);
//       }

//       setPageError("");

//       try {
//         const [bookingResponse, statsResponse, customerResponse, serviceResponse, staffResponse] =
//           await Promise.all([
//             getBookings({
//               organizationId,
//               search,
//               status: statusFilter,
//               date: dateFilter,
//             }),
//             getBookingStats(organizationId),
//             getCustomers({ organizationId }),
//             getServices({ organizationId }),
//             getStaff({ organizationId }),
//           ]);

//         setBookings(getArray(bookingResponse));

//         const statsData = getObject(statsResponse);
//         setStats({
//           totalBookings: Number(statsData.totalBookings || 0),
//           totalValue: Number(statsData.totalValue || 0),
//           byStatus: Array.isArray(statsData.byStatus)
//             ? statsData.byStatus
//             : [],
//         });

//         setCustomers(getArray(customerResponse));
//         setServices(getArray(serviceResponse));
//         setStaffMembers(getArray(staffResponse));
//       } catch (error) {
//         setPageError(getErrorMessage(error));
//       } finally {
//         setLoading(false);
//         setRefreshing(false);
//       }
//     },
//     [organizationId, search, statusFilter, dateFilter]
//   );

//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       loadData();
//     }, 250);

//     return () => clearTimeout(timeout);
//   }, [loadData]);

//   // ---------------------------------------------------
//   // LOOKUP DATA NORMALIZATION
//   // ---------------------------------------------------

//   const availableCustomers = useMemo(
//     () =>
//       customers.filter(
//         (item) => item.isActive !== false && item.status !== "inactive"
//       ),
//     [customers]
//   );

//   const availableServices = useMemo(
//     () =>
//       services.filter(
//         (item) =>
//           item.isActive !== false &&
//           (!item.status || item.status === "active")
//       ),
//     [services]
//   );

//   const availableStaff = useMemo(
//     () =>
//       staffMembers.filter(
//         (item) =>
//           item.isActive !== false &&
//           (!item.status || item.status === "active")
//       ),
//     [staffMembers]
//   );

//   const canCreateBooking =
//     availableCustomers.length > 0 && availableServices.length > 0;

//   // ---------------------------------------------------
//   // CREATE / UPDATE
//   // ---------------------------------------------------

//   const handleSaveBooking = async (bookingData) => {
//     setSaving(true);
//     setActionError("");

//     try {
//       if (editingBooking) {
//         await updateBooking({
//           organizationId,
//           bookingId: getId(editingBooking),
//           bookingData,
//         });
//       } else {
//         await createBooking({
//           organizationId,
//           bookingData,
//         });
//       }

//       setShowModal(false);
//       setEditingBooking(null);

//       await loadData({ silent: true });
//     } catch (error) {
//       setActionError(getErrorMessage(error));
//       throw error;
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ---------------------------------------------------
//   // STATUS UPDATE
//   // ---------------------------------------------------

//   const handleStatusChange = async (booking, newStatus) => {
//     if (!newStatus || newStatus === booking.status) return;

//     const allowed = ALLOWED_TRANSITIONS[booking.status] || [];

//     if (!allowed.includes(newStatus)) {
//       setActionError(
//         `Changing status from ${booking.status} to ${newStatus} is not allowed.`
//       );
//       return;
//     }

//     setStatusUpdatingId(getId(booking));
//     setActionError("");

//     try {
//       await updateBooking({
//         organizationId,
//         bookingId: getId(booking),
//         bookingData: { status: newStatus },
//       });

//       await loadData({ silent: true });
//     } catch (error) {
//       setActionError(getErrorMessage(error));
//     } finally {
//       setStatusUpdatingId("");
//     }
//   };

//   // ---------------------------------------------------
//   // CANCEL BOOKING
//   // ---------------------------------------------------

//   const handleCancelBooking = async () => {
//     if (!cancelTarget) return;

//     setSaving(true);
//     setActionError("");

//     try {
//       await cancelBooking({
//         organizationId,
//         bookingId: getId(cancelTarget),
//       });

//       setCancelTarget(null);
//       await loadData({ silent: true });
//     } catch (error) {
//       setActionError(getErrorMessage(error));
//     } finally {
//       setSaving(false);
//     }
//   };

//   const resetFilters = () => {
//     setSearch("");
//     setStatusFilter("");
//     setDateFilter("");
//   };

//   const statusCounts = useMemo(() => {
//     const result = {
//       pending: 0,
//       confirmed: 0,
//       in_progress: 0,
//       completed: 0,
//     };

//     for (const item of stats.byStatus) {
//       if (Object.prototype.hasOwnProperty.call(result, item._id)) {
//         result[item._id] = Number(item.count || 0);
//       }
//     }

//     return result;
//   }, [stats.byStatus]);

//   // ---------------------------------------------------
//   // PAGE UI
//   // ---------------------------------------------------

//   return (
//     <DashboardLayout>
//       <div className="min-h-screen space-y-7 bg-transparent pb-10 text-white">
//         {/* HEADER */}
//         <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-violet-950/50 via-[#14111f] to-fuchsia-950/20 p-6 shadow-2xl shadow-black/10 sm:p-8">
//           <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-violet-600/15 blur-[100px]" />
//           <div className="pointer-events-none absolute -bottom-24 left-1/3 h-52 w-52 rounded-full bg-fuchsia-600/10 blur-[90px]" />

//           <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
//             <div>
//               <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-xs font-semibold text-violet-200">
//                 <CalendarClock className="h-3.5 w-3.5" />
//                 OPERATIONS / BOOKINGS
//               </div>

//               <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
//                 Booking{" "}
//                 <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
//                   Management
//                 </span>
//               </h1>

//               <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
//                 Schedule appointments, manage your team, and keep every service
//                 booking organized in one place.
//               </p>

//               {currentOrganization?.name && (
//                 <p className="mt-3 text-xs text-slate-500">
//                   Workspace:{" "}
//                   <span className="font-medium text-slate-300">
//                     {currentOrganization.name}
//                   </span>
//                 </p>
//               )}
//             </div>

//             <div className="flex flex-wrap items-center gap-3">
//               <button
//                 type="button"
//                 onClick={() => loadData({ silent: true })}
//                 disabled={refreshing || loading || !organizationId}
//                 className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.08] disabled:opacity-50"
//               >
//                 <RefreshCw
//                   className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
//                 />
//                 Refresh
//               </button>

//               <button
//                 type="button"
//                 onClick={() => {
//                   setEditingBooking(null);
//                   setActionError("");
//                   setShowModal(true);
//                 }}
//                 disabled={!organizationId || !canCreateBooking}
//                 title={
//                   !canCreateBooking
//                     ? "Create an active customer and service first."
//                     : "Create a booking"
//                 }
//                 className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-950/40 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
//               >
//                 <Plus className="h-4 w-4" />
//                 New booking
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* ORGANIZATION / LOOKUP NOTICE */}
//         {!organizationId && (
//           <div className="flex gap-3 rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] p-4 text-sm text-amber-200">
//             <AlertCircle className="h-5 w-5 shrink-0" />
//             Select a business workspace to view its bookings.
//           </div>
//         )}

//         {organizationId && !loading && (
//           availableCustomers.length === 0 ||
//           availableServices.length === 0
//         ) && (
//           <div className="flex gap-3 rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] p-4 text-sm text-amber-100">
//             <AlertCircle className="h-5 w-5 shrink-0" />
//             <div>
//               <p className="font-semibold">Booking prerequisites</p>
//               <p className="mt-1 leading-6 text-amber-100/70">
//                 You need at least one active customer and one active service
//                 before creating a booking.
//               </p>
//             </div>
//           </div>
//         )}

//         {/* STATISTICS */}
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
//           <StatCard
//             title="Total bookings"
//             value={stats.totalBookings.toLocaleString()}
//             subtitle="Active bookings in this workspace"
//             icon={CalendarCheck}
//             accent="bg-violet-500/20"
//             loading={loading}
//           />

//           <StatCard
//             title="Booking value"
//             value={formatMoney(stats.totalValue)}
//             subtitle="Total value of active bookings"
//             icon={CircleDollarSign}
//             accent="bg-emerald-500/15"
//             loading={loading}
//           />

//           <StatCard
//             title="Confirmed"
//             value={statusCounts.confirmed.toLocaleString()}
//             subtitle="Ready for service"
//             icon={CheckCircle2}
//             accent="bg-cyan-500/15"
//             loading={loading}
//           />

//           <StatCard
//             title="Pending"
//             value={statusCounts.pending.toLocaleString()}
//             subtitle="Awaiting confirmation"
//             icon={Clock3}
//             accent="bg-amber-500/15"
//             loading={loading}
//           />
//         </div>

//         {/* MAIN CONTENT */}
//         <section className="overflow-hidden rounded-3xl border border-white/[0.08] bg-[#100f19]/80 shadow-xl shadow-black/10 backdrop-blur-xl">
//           <div className="border-b border-white/[0.07] p-5 sm:p-6">
//             <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
//               <div>
//                 <h2 className="text-lg font-bold text-white">
//                   All bookings
//                 </h2>
//                 <p className="mt-1 text-sm text-slate-500">
//                   Search, filter and manage appointments.
//                 </p>
//               </div>

//               <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
//                 <div className="relative min-w-0 sm:min-w-64">
//                   <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
//                   <input
//                     type="search"
//                     value={search}
//                     onChange={(event) => setSearch(event.target.value)}
//                     placeholder="Search customer, service..."
//                     className={`${inputClass} pl-10`}
//                   />
//                 </div>

//                 <div className="relative">
//                   <Filter className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
//                   <select
//                     value={statusFilter}
//                     onChange={(event) => setStatusFilter(event.target.value)}
//                     className={`${inputClass} min-w-44 pl-10 pr-8`}
//                   >
//                     <option value="">All statuses</option>
//                     {STATUS_OPTIONS.map((status) => (
//                       <option key={status.value} value={status.value}>
//                         {status.label}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <input
//                   type="date"
//                   value={dateFilter}
//                   onChange={(event) => setDateFilter(event.target.value)}
//                   aria-label="Filter by booking date"
//                   className={`${inputClass} sm:w-44`}
//                 />
//               </div>
//             </div>

//             <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
//               <p className="text-xs text-slate-500">
//                 {loading
//                   ? "Loading bookings..."
//                   : `${bookings.length} booking${bookings.length === 1 ? "" : "s"} shown`}
//               </p>

//               {(search || statusFilter || dateFilter) && (
//                 <button
//                   type="button"
//                   onClick={resetFilters}
//                   className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-300 transition hover:text-violet-200"
//                 >
//                   <RotateCcw className="h-3.5 w-3.5" />
//                   Reset filters
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* FEEDBACK */}
//           <AnimatePresence>
//             {pageError && (
//               <motion.div
//                 initial={{ opacity: 0, height: 0 }}
//                 animate={{ opacity: 1, height: "auto" }}
//                 exit={{ opacity: 0, height: 0 }}
//                 className="px-5 pt-5 sm:px-6"
//               >
//                 <div className="flex items-start gap-3 rounded-xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-200">
//                   <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
//                   <div className="min-w-0 flex-1">
//                     <p>{pageError}</p>
//                     <button
//                       type="button"
//                       onClick={() => loadData()}
//                       className="mt-2 font-semibold underline underline-offset-4"
//                     >
//                       Try again
//                     </button>
//                   </div>
//                 </div>
//               </motion.div>
//             )}

//             {actionError && (
//               <motion.div
//                 initial={{ opacity: 0, y: -5 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0 }}
//                 className="px-5 pt-5 sm:px-6"
//               >
//                 <div className="flex items-start gap-3 rounded-xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-200">
//                   <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
//                   <p className="min-w-0 flex-1">{actionError}</p>
//                   <button
//                     type="button"
//                     onClick={() => setActionError("")}
//                     aria-label="Dismiss error"
//                   >
//                     <X className="h-4 w-4" />
//                   </button>
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           {/* LOADING */}
//           {loading && (
//             <div className="flex flex-col items-center justify-center gap-3 py-20">
//               <div className="rounded-2xl border border-violet-400/20 bg-violet-500/10 p-4">
//                 <LoaderCircle className="h-7 w-7 animate-spin text-violet-300" />
//               </div>
//               <p className="text-sm text-slate-400">
//                 Loading your bookings...
//               </p>
//             </div>
//           )}

//           {/* EMPTY */}
//           {!loading && !pageError && bookings.length === 0 && (
//             <EmptyState
//               title={
//                 search || statusFilter || dateFilter
//                   ? "No matching bookings"
//                   : "No bookings yet"
//               }
//               description={
//                 search || statusFilter || dateFilter
//                   ? "Try another search term or clear your filters."
//                   : "Create your first booking to start organizing appointments and service schedules."
//               }
//               onReset={
//                 search || statusFilter || dateFilter
//                   ? resetFilters
//                   : undefined
//               }
//             />
//           )}

//           {/* BOOKING CARDS */}
//           {!loading && bookings.length > 0 && (
//             <div className="divide-y divide-white/[0.06]">
//               {bookings.map((booking, index) => {
//                 const customer = booking.customer;
//                 const service = booking.service;
//                 const staff = booking.staff;
//                 const transitions =
//                   ALLOWED_TRANSITIONS[booking.status] || [];

//                 return (
//                   <motion.article
//                     key={getId(booking)}
//                     initial={{ opacity: 0, y: 8 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: Math.min(index * 0.025, 0.2) }}
//                     className="group p-5 transition hover:bg-white/[0.025] sm:p-6"
//                   >
//                     <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
//                       <div className="flex min-w-0 flex-1 gap-4">
//                         <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-400/15 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/10 text-sm font-bold text-violet-200">
//                           {getInitials(getDisplayName(customer, "Customer"))}
//                         </div>

//                         <div className="min-w-0 flex-1">
//                           <div className="flex flex-wrap items-center gap-2">
//                             <h3 className="truncate font-semibold text-white">
//                               {getDisplayName(customer, "Customer unavailable")}
//                             </h3>
//                             <StatusBadge status={booking.status} />
//                           </div>

//                           <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-400">
//                             <span className="inline-flex items-center gap-1.5">
//                               <BriefcaseBusiness className="h-3.5 w-3.5 text-violet-300" />
//                               {getDisplayName(service, "Service unavailable")}
//                             </span>

//                             <span className="inline-flex items-center gap-1.5">
//                               <CalendarDays className="h-3.5 w-3.5 text-cyan-300" />
//                               {formatDate(booking.bookingDate)}
//                             </span>

//                             <span className="inline-flex items-center gap-1.5">
//                               <Clock3 className="h-3.5 w-3.5 text-amber-300" />
//                               {booking.startTime || "--:--"} –{" "}
//                               {booking.endTime || "--:--"}
//                             </span>
//                           </div>

//                           <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">
//                             <span className="inline-flex items-center gap-1.5">
//                               <UserRound className="h-3.5 w-3.5" />
//                               {staff
//                                 ? getDisplayName(staff)
//                                 : "No staff assigned"}
//                             </span>

//                             {(booking.location?.address ||
//                               booking.location?.city) && (
//                               <span className="inline-flex items-center gap-1.5">
//                                 <MapPin className="h-3.5 w-3.5" />
//                                 {[
//                                   booking.location.address,
//                                   booking.location.city,
//                                 ]
//                                   .filter(Boolean)
//                                   .join(", ")}
//                               </span>
//                             )}
//                           </div>

//                           {booking.notes && (
//                             <p className="mt-3 line-clamp-2 max-w-2xl text-xs leading-5 text-slate-500">
//                               {booking.notes}
//                             </p>
//                           )}
//                         </div>
//                       </div>

//                       <div className="flex flex-wrap items-center gap-3 xl:justify-end">
//                         <div className="min-w-24 xl:text-right">
//                           <p className="text-xs text-slate-500">
//                             Booking value
//                           </p>
//                           <p className="mt-1 font-bold text-white">
//                             {formatMoney(booking.price)}
//                           </p>
//                         </div>

//                         {transitions.length > 0 && (
//                           <div className="relative min-w-36">
//                             <select
//                               value=""
//                               disabled={
//                                 statusUpdatingId === getId(booking) || saving
//                               }
//                               onChange={(event) =>
//                                 handleStatusChange(booking, event.target.value)
//                               }
//                               aria-label="Change booking status"
//                               className={`${inputClass} py-2.5 pr-8 text-xs`}
//                             >
//                               <option value="" disabled>
//                                 {statusUpdatingId === getId(booking)
//                                   ? "Updating..."
//                                   : "Change status"}
//                               </option>
//                               {transitions.map((status) => (
//                                 <option key={status} value={status}>
//                                   {STATUS_OPTIONS.find(
//                                     (item) => item.value === status
//                                   )?.label || status}
//                                 </option>
//                               ))}
//                             </select>
//                             <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
//                           </div>
//                         )}

//                         {!["completed", "cancelled", "no_show"].includes(
//                           booking.status
//                         ) && (
//                           <>
//                             <button
//                               type="button"
//                               onClick={() => {
//                                 setEditingBooking(booking);
//                                 setActionError("");
//                                 setShowModal(true);
//                               }}
//                               title="Edit booking"
//                               aria-label="Edit booking"
//                               className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5 text-slate-300 transition hover:border-violet-400/30 hover:bg-violet-500/10 hover:text-violet-200"
//                             >
//                               <Pencil className="h-4 w-4" />
//                             </button>

//                             <button
//                               type="button"
//                               onClick={() => setCancelTarget(booking)}
//                               title="Cancel booking"
//                               aria-label="Cancel booking"
//                               className="rounded-xl border border-rose-400/15 bg-rose-500/[0.04] p-2.5 text-rose-300 transition hover:border-rose-400/30 hover:bg-rose-500/10"
//                             >
//                               <XCircle className="h-4 w-4" />
//                             </button>
//                           </>
//                         )}
//                       </div>
//                     </div>
//                   </motion.article>
//                 );
//               })}
//             </div>
//           )}

//           {/* FOOTER */}
//           {!loading && bookings.length > 0 && (
//             <div className="flex flex-col gap-2 border-t border-white/[0.07] px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
//               <span>
//                 Showing {bookings.length} booking
//                 {bookings.length === 1 ? "" : "s"}
//               </span>
//               <span className="inline-flex items-center gap-1.5">
//                 <Users className="h-3.5 w-3.5" />
//                 Workspace-isolated booking data
//               </span>
//             </div>
//           )}
//         </section>
//       </div>

//       {/* CREATE / EDIT MODAL */}
//       <AnimatePresence>
//         {showModal && (
//           <BookingModal
//             booking={editingBooking}
//             customers={availableCustomers}
//             services={availableServices}
//             staffMembers={availableStaff}
//             saving={saving}
//             onClose={() => {
//               if (saving) return;
//               setShowModal(false);
//               setEditingBooking(null);
//             }}
//             onSubmit={handleSaveBooking}
//           />
//         )}
//       </AnimatePresence>

//       {/* CANCEL CONFIRMATION */}
//       <AnimatePresence>
//         {cancelTarget && (
//           <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
//             <motion.div
//               initial={{ opacity: 0, scale: 0.96, y: 10 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.98 }}
//               className="w-full max-w-md rounded-3xl border border-white/10 bg-[#14121f] p-6 shadow-2xl shadow-black/50"
//             >
//               <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-400/20 bg-rose-500/10">
//                 <AlertCircle className="h-6 w-6 text-rose-300" />
//               </div>

//               <h3 className="text-xl font-bold text-white">
//                 Cancel this booking?
//               </h3>

//               <p className="mt-3 text-sm leading-6 text-slate-400">
//                 This will cancel the appointment for{" "}
//                 <span className="font-semibold text-slate-200">
//                   {getDisplayName(cancelTarget.customer, "this customer")}
//                 </span>
//                 . The booking will no longer appear in the active booking list.
//               </p>

//               {actionError && (
//                 <p className="mt-3 rounded-xl border border-rose-400/20 bg-rose-500/10 p-3 text-sm text-rose-200">
//                   {actionError}
//                 </p>
//               )}

//               <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
//                 <button
//                   type="button"
//                   disabled={saving}
//                   onClick={() => {
//                     setCancelTarget(null);
//                     setActionError("");
//                   }}
//                   className="rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-white/[0.05] disabled:opacity-50"
//                 >
//                   Keep booking
//                 </button>

//                 <button
//                   type="button"
//                   disabled={saving}
//                   onClick={handleCancelBooking}
//                   className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-rose-500 disabled:opacity-50"
//                 >
//                   {saving && (
//                     <LoaderCircle className="h-4 w-4 animate-spin" />
//                   )}
//                   Confirm cancellation
//                 </button>
//               </div>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>
//     </DashboardLayout>
//   );
// }


import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  Clock,
  Users,
  Wrench,
  Search,
  Plus,
  RefreshCw,
  X,
  CheckCircle2,
  AlertCircle,
  CalendarCheck,
  DollarSign,
  LoaderCircle,
  UserRound,
  ChevronDown,
  FileText,
  Ban,
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import { useOrganization } from "../context/OrganizationContext";

import {
  getBookings,
  getBookingStats,
  createBooking,
  updateBooking,
  cancelBooking,
} from "../api/bookingApi";

import { getCustomers } from "../api/customerApi";
import { getServices } from "../api/serviceApi";
import { getStaff } from "../api/staffApi";

// ======================================================
// HELPERS
// ======================================================

const getId = (item) =>
  item?._id?.toString?.() || item?.id?.toString?.() || "";

const getErrorMessage = (error) => {
  const data = error?.response?.data;
  const issues = data?.errors || data?.issues || data?.details;

  if (Array.isArray(issues) && issues.length) {
    return issues
      .map((issue) => {
        const path = Array.isArray(issue.path)
          ? issue.path.join(".")
          : issue.path || issue.field || "Field";
        return `${path}: ${issue.message || issue.msg || "Invalid value"}`;
      })
      .join(" | ");
  }

  return data?.message || data?.error || error?.message ||
    "Something went wrong. Please try again.";
};

const getArray = (response, resourceKeys = []) => {
  const keys = [
    ...resourceKeys,
    "data",
    "items",
    "results",
    "records",
    "docs",
  ];

  const queue = [response];
  const visited = new Set();

  while (queue.length > 0) {
    const current = queue.shift();

    if (!current || typeof current !== "object") continue;
    if (visited.has(current)) continue;

    visited.add(current);

    if (Array.isArray(current)) return current;

    for (const key of keys) {
      const value = current[key];

      if (Array.isArray(value)) return value;

      if (value && typeof value === "object") {
        queue.push(value);
      }
    }
  }

  return [];
};

const getObject = (response) => {
  let current = response;

  for (let index = 0; index < 4; index += 1) {
    if (!current || typeof current !== "object" || Array.isArray(current)) {
      return {};
    }

    if (current.totalBookings !== undefined || current.totalValue !== undefined) {
      return current;
    }

    if (current.stats && typeof current.stats === "object") {
      current = current.stats;
      continue;
    }

    if (current.data && typeof current.data === "object") {
      current = current.data;
      continue;
    }

    return current;
  }

  return current || {};
};

const isAvailable = (item) => {
  const status = String(item?.status || "").toLowerCase();

  return (
    item?.isActive !== false &&
    item?.active !== false &&
    !["inactive", "archived", "deleted", "disabled"].includes(status)
  );
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

const formatDateTime = (date) => {
  if (!date) return "Not scheduled";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "Invalid date";

  return parsed.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const toDateTimeLocal = (date, time) => {
  if (!date) return "";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";

  if (typeof time === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {
    const [hours, minutes] = time.split(":").map(Number);
    parsed.setHours(hours, minutes, 0, 0);
  }

  const localDate = new Date(parsed.getTime() - parsed.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
};

const getCustomerName = (customer) => {
  if (!customer) return "Unknown customer";
  if (typeof customer === "string") return customer;

  return (
    customer.name ||
    customer.fullName ||
    [customer.firstName, customer.lastName].filter(Boolean).join(" ") ||
    customer.email ||
    "Unknown customer"
  );
};

const getServiceName = (service) => {
  if (!service) return "Unknown service";
  if (typeof service === "string") return service;

  return service.name || service.title || "Unknown service";
};

const getStaffName = (staff) => {
  if (!staff) return "Unassigned";
  if (typeof staff === "string") return staff;

  return (
    staff.name ||
    staff.fullName ||
    [staff.firstName, staff.lastName].filter(Boolean).join(" ") ||
    staff.email ||
    "Unassigned"
  );
};

const getReferenceId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;

  return getId(value);
};

const normalizeStatus = (value) => {
  const status = String(value || "pending").toLowerCase();
  if (status === "in-progress" || status === "in progress") return "in_progress";
  if (status === "canceled") return "cancelled";
  return status;
};

const getBookingStatus = (booking) => normalizeStatus(booking?.status);

const getBookingAddress = (booking) =>
  typeof booking?.location === "string"
    ? booking.location
    : booking?.location?.address || booking?.address || "";

const statusStyles = {
  pending: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  confirmed: "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",
  scheduled: "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",
  "in-progress": "border-violet-400/20 bg-violet-400/10 text-violet-300",
  in_progress: "border-violet-400/20 bg-violet-400/10 text-violet-300",
  completed: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  cancelled: "border-red-400/20 bg-red-400/10 text-red-300",
  canceled: "border-red-400/20 bg-red-400/10 text-red-300",
  no_show: "border-rose-400/20 bg-rose-400/10 text-rose-300",
};

const inputClass =
  "w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/10";

const labelClass = "mb-2 block text-sm font-medium text-white/70";

const buttonClass =
  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40";

// ======================================================
// STAT CARD
// ======================================================

function StatCard({ title, value, description, icon: Icon, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-5 shadow-xl shadow-black/10 backdrop-blur-xl"
    >
      <div
        className={`absolute -right-8 -top-8 h-28 w-28 rounded-full blur-3xl ${color}`}
      />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-white/50">{title}</p>
          <h3 className="mt-3 text-2xl font-bold tracking-tight text-white">
            {value}
          </h3>
          <p className="mt-2 text-xs text-white/40">{description}</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.06] p-3">
          <Icon size={20} className="text-violet-300" />
        </div>
      </div>
    </motion.div>
  );
}

// ======================================================
// BOOKING MODAL
// ======================================================

function BookingModal({
  open,
  onClose,
  onSubmit,
  customers,
  services,
  staffMembers,
  saving,
  initialBooking,
}) {
  const editing = Boolean(initialBooking);

  const [form, setForm] = useState({
    customer: "",
    service: "",
    staff: "",
    scheduledAt: "",
    duration: "60",
    status: "pending",
    notes: "",
    address: "",
  });

  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!open) return;

    setFormError("");

    if (initialBooking) {
      setForm({
        customer: getReferenceId(initialBooking.customer),
        service: getReferenceId(initialBooking.service),
        staff: getReferenceId(initialBooking.staff),
        scheduledAt: toDateTimeLocal(
          initialBooking.bookingDate ||
            initialBooking.scheduledAt ||
            initialBooking.date,
          initialBooking.startTime
        ),
        duration: String(initialBooking.duration || 60),
        status: getBookingStatus(initialBooking),
        notes: initialBooking.notes || "",
        address: initialBooking.address || "",
      });
    } else {
      setForm({
        customer: "",
        service: "",
        staff: "",
        scheduledAt: "",
        duration: "60",
        status: "pending",
        notes: "",
        address: "",
      });
    }
  }, [open, initialBooking]);

  if (!open) return null;

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    if (!form.customer) {
      setFormError("Please select a customer.");
      return;
    }

    if (!form.service) {
      setFormError("Please select a service.");
      return;
    }

    if (!form.scheduledAt) {
      setFormError("Please select a booking date and time.");
      return;
    }

    const duration = Number(form.duration);

    if (!Number.isFinite(duration) || duration < 1 || duration > 1440) {
      setFormError("Duration must be between 1 and 1440 minutes.");
      return;
    }

    const scheduledDate = new Date(form.scheduledAt);

    if (Number.isNaN(scheduledDate.getTime())) {
      setFormError("Please enter a valid booking date and time.");
      return;
    }

    const startTime = `${String(scheduledDate.getHours()).padStart(2, "0")}:${String(
      scheduledDate.getMinutes()
    ).padStart(2, "0")}`;

    const endDate = new Date(scheduledDate.getTime() + duration * 60 * 1000);
    const endTime = `${String(endDate.getHours()).padStart(2, "0")}:${String(
      endDate.getMinutes()
    ).padStart(2, "0")}`;

    // Match createBookingSchema exactly. It is strict and does not accept
    // scheduledAt, duration, address, or status on CREATE.
    const payload = {
      customer: form.customer,
      service: form.service,
      ...(form.staff ? { staff: form.staff } : {}),
      bookingDate: scheduledDate.toISOString(),
      startTime,
      endTime,
      ...(form.address.trim()
        ? { location: { address: form.address.trim() } }
        : {}),
      ...(form.notes.trim() ? { notes: form.notes.trim() } : {}),
    };

    // The supplied update schema allows status, but the create schema does not.
    if (editing) payload.status = normalizeStatus(form.status);

    try {
      await onSubmit(payload);
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="my-6 w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-[#100d19] shadow-2xl shadow-black/50"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-white">
              {editing ? "Edit booking" : "Create booking"}
            </h2>
            <p className="mt-1 text-sm text-white/45">
              Manage your service appointment
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl border border-white/10 p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
            aria-label="Close booking form"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {formError && (
            <div className="flex items-start gap-2 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-300">
              <AlertCircle size={17} className="mt-0.5 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Customer *</label>
              <div className="relative">
                <select
                  className={`${inputClass} appearance-none pr-10`}
                  value={form.customer}
                  onChange={(event) =>
                    updateField("customer", event.target.value)
                  }
                  required
                >
                  <option value="" className="bg-[#100d19]">
                    Select customer
                  </option>
                  {customers.map((customer) => (
                    <option
                      key={getId(customer)}
                      value={getId(customer)}
                      className="bg-[#100d19]"
                    >
                      {getCustomerName(customer)}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/40"
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Service *</label>
              <div className="relative">
                <select
                  className={`${inputClass} appearance-none pr-10`}
                  value={form.service}
                  onChange={(event) =>
                    updateField("service", event.target.value)
                  }
                  required
                >
                  <option value="" className="bg-[#100d19]">
                    Select service
                  </option>
                  {services.map((service) => (
                    <option
                      key={getId(service)}
                      value={getId(service)}
                      className="bg-[#100d19]"
                    >
                      {getServiceName(service)}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/40"
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Assigned staff</label>
              <div className="relative">
                <select
                  className={`${inputClass} appearance-none pr-10`}
                  value={form.staff}
                  onChange={(event) => updateField("staff", event.target.value)}
                >
                  <option value="" className="bg-[#100d19]">
                    Unassigned
                  </option>
                  {staffMembers.map((member) => (
                    <option
                      key={getId(member)}
                      value={getId(member)}
                      className="bg-[#100d19]"
                    >
                      {getStaffName(member)}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/40"
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Duration (minutes) *</label>
              <input
                type="number"
                min="1"
                max="1440"
                className={inputClass}
                value={form.duration}
                onChange={(event) =>
                  updateField("duration", event.target.value)
                }
                required
              />
            </div>

            <div>
              <label className={labelClass}>Date and time *</label>
              <input
                type="datetime-local"
                className={inputClass}
                value={form.scheduledAt}
                onChange={(event) =>
                  updateField("scheduledAt", event.target.value)
                }
                required
              />
            </div>

            <div>
              <label className={labelClass}>Status</label>
              <select
                className={inputClass}
                value={form.status}
                onChange={(event) => updateField("status", event.target.value)}
              >
                <option value="pending" className="bg-[#100d19]">
                  Pending
                </option>
                <option value="confirmed" className="bg-[#100d19]">
                  Confirmed
                </option>
                <option value="in_progress" className="bg-[#100d19]">
                  In progress
                </option>
                <option value="completed" className="bg-[#100d19]">
                  Completed
                </option>
                <option value="cancelled" className="bg-[#100d19]">
                  Cancelled
                </option>
                <option value="no_show" className="bg-[#100d19]">
                  No show
                </option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Service address</label>
            <input
              type="text"
              className={inputClass}
              value={form.address}
              onChange={(event) => updateField("address", event.target.value)}
              placeholder="Enter service location"
              maxLength={500}
            />
          </div>

          <div>
            <label className={labelClass}>Notes</label>
            <textarea
              className={`${inputClass} min-h-24 resize-y`}
              value={form.notes}
              onChange={(event) => updateField("notes", event.target.value)}
              placeholder="Additional instructions for this booking..."
              maxLength={3000}
            />
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className={`${buttonClass} border border-white/10 text-white/70 hover:bg-white/5`}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className={`${buttonClass} bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-900/20 hover:brightness-110`}
            >
              {saving ? (
                <LoaderCircle size={17} className="animate-spin" />
              ) : (
                <CalendarCheck size={17} />
              )}
              {saving
                ? "Saving..."
                : editing
                  ? "Save changes"
                  : "Create booking"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ======================================================
// BOOKING CARD
// ======================================================

function BookingCard({ booking, onEdit, onCancel, onStatusChange }) {
  const status = getBookingStatus(booking);
  const customer = booking.customer;
  const service = booking.service;
  const staff = booking.staff;

  const scheduledAt =
    booking.bookingDate || booking.scheduledAt || booking.date;

  const isCancelled = ["cancelled", "canceled"].includes(status);
  const isCompleted = status === "completed";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="group rounded-2xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl transition hover:border-violet-400/25 hover:bg-white/[0.055]"
    >
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
                statusStyles[status] ||
                "border-white/10 bg-white/5 text-white/60"
              }`}
            >
              {status.replaceAll("-", " ").replaceAll("_", " ")}
            </span>

            {booking.bookingNumber && (
              <span className="text-xs text-white/35">
                #{booking.bookingNumber}
              </span>
            )}
          </div>

          <h3 className="mt-3 truncate text-lg font-semibold text-white">
            {getServiceName(service)}
          </h3>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-violet-400/10 p-2 text-violet-300">
                <UserRound size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-white/40">Customer</p>
                <p className="mt-1 truncate text-sm text-white/80">
                  {getCustomerName(customer)}
                </p>
                {customer?.email && (
                  <p className="mt-0.5 truncate text-xs text-white/35">
                    {customer.email}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-cyan-400/10 p-2 text-cyan-300">
                <CalendarDays size={16} />
              </div>
              <div>
                <p className="text-xs text-white/40">Scheduled</p>
                <p className="mt-1 text-sm text-white/80">
                  {formatDateTime(scheduledAt)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-fuchsia-400/10 p-2 text-fuchsia-300">
                <Users size={16} />
              </div>
              <div>
                <p className="text-xs text-white/40">Assigned staff</p>
                <p className="mt-1 text-sm text-white/80">
                  {getStaffName(staff)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-emerald-400/10 p-2 text-emerald-300">
                <DollarSign size={16} />
              </div>
              <div>
                <p className="text-xs text-white/40">Booking value</p>
                <p className="mt-1 text-sm font-semibold text-white/90">
                  {formatCurrency(
                    booking.totalAmount ??
                      booking.price ??
                      booking.amount ??
                      service?.price ??
                      0
                  )}
                </p>
              </div>
            </div>
          </div>

          {getBookingAddress(booking) && (
            <p className="mt-4 text-sm text-white/45">
              <span className="text-white/65">Address:</span>{" "}
              {getBookingAddress(booking)}
            </p>
          )}

          {booking.notes && (
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/45">
              {booking.notes}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 xl:justify-end">
          {!isCancelled && !isCompleted && (
            <div className="relative">
              <select
                aria-label="Change booking status"
                value={status}
                onChange={(event) =>
                  onStatusChange(booking, event.target.value)
                }
                className="max-w-40 appearance-none rounded-xl border border-white/10 bg-black/30 py-2.5 pl-3 pr-8 text-xs text-white outline-none focus:border-violet-400/50"
              >
                <option value="pending" className="bg-[#100d19]">
                  Pending
                </option>
                <option value="confirmed" className="bg-[#100d19]">
                  Confirmed
                </option>
                <option value="in_progress" className="bg-[#100d19]">
                  In progress
                </option>
                <option value="completed" className="bg-[#100d19]">
                  Completed
                </option>
                <option value="no_show" className="bg-[#100d19]">
                  No show
                </option>
              </select>
              <ChevronDown
                size={13}
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40"
              />
            </div>
          )}

          <button
            type="button"
            onClick={() => onEdit(booking)}
            className={`${buttonClass} border border-white/10 text-white/70 hover:border-violet-400/30 hover:bg-violet-400/10 hover:text-white`}
          >
            <FileText size={15} />
            Edit
          </button>

          {!isCancelled && !isCompleted && (
            <button
              type="button"
              onClick={() => onCancel(booking)}
              className={`${buttonClass} border border-red-400/20 text-red-300 hover:bg-red-400/10`}
            >
              <Ban size={15} />
              Cancel
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}

// ======================================================
// MAIN BOOKINGS PAGE
// ======================================================

export default function Bookings() {
  const { currentOrganization } = useOrganization();
  const organizationId = getId(currentOrganization);

  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);

  const [stats, setStats] = useState({
    totalBookings: 0,
    totalValue: 0,
    byStatus: [],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [lookupError, setLookupError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  // ------------------------------------------------------
  // AVAILABLE LOOKUP DATA
  // ------------------------------------------------------

  const availableCustomers = useMemo(
    () => customers.filter(isAvailable),
    [customers]
  );

  const availableServices = useMemo(
    () => services.filter(isAvailable),
    [services]
  );

  const availableStaff = useMemo(
    () => staffMembers.filter(isAvailable),
    [staffMembers]
  );

  const canCreateBooking =
    availableCustomers.length > 0 && availableServices.length > 0;

  // ------------------------------------------------------
  // LOAD BOOKINGS AND LOOKUP DATA
  // ------------------------------------------------------

  const loadData = useCallback(
    async ({ silent = false } = {}) => {
      if (!organizationId) {
        setBookings([]);
        setCustomers([]);
        setServices([]);
        setStaffMembers([]);
        setStats({
          totalBookings: 0,
          totalValue: 0,
          byStatus: [],
        });
        setError("");
        setLookupError("");
        setLoading(false);
        return;
      }

      if (!silent) setLoading(true);

      setError("");
      setLookupError("");

      try {
        const results = await Promise.allSettled([
          getBookings({
            organizationId,
            search,
            status: statusFilter,
            date: dateFilter,
          }),
          getBookingStats(organizationId),
          getCustomers({ organizationId }),
          getServices({ organizationId }),
          getStaff({ organizationId }),
        ]);

        const [
          bookingResult,
          statsResult,
          customerResult,
          serviceResult,
          staffResult,
        ] = results;

        const lookupErrors = [];

        if (bookingResult.status === "fulfilled") {
          setBookings(
            getArray(bookingResult.value, ["bookings", "results"])
          );
        } else {
          setBookings([]);
          setError(getErrorMessage(bookingResult.reason));
        }

        if (statsResult.status === "fulfilled") {
          const statsData = getObject(statsResult.value);

          setStats({
            totalBookings: Number(
              statsData.totalBookings ??
                statsData.total ??
                statsData.count ??
                0
            ),
            totalValue: Number(
              statsData.totalValue ??
                statsData.totalAmount ??
                statsData.revenue ??
                0
            ),
            byStatus: Array.isArray(statsData.byStatus)
              ? statsData.byStatus
              : [],
          });
        } else {
          setStats({
            totalBookings: 0,
            totalValue: 0,
            byStatus: [],
          });
        }

        if (customerResult.status === "fulfilled") {
          const data = getArray(customerResult.value, [
            "customers",
            "results",
          ]);

          setCustomers(data);

          if (data.length === 0) {
            console.warn(
              "ServiceOS: No customer array found in API response.",
              customerResult.value
            );
          }
        } else {
          setCustomers([]);
          lookupErrors.push(
            `Customers: ${getErrorMessage(customerResult.reason)}`
          );
        }

        if (serviceResult.status === "fulfilled") {
          const data = getArray(serviceResult.value, [
            "services",
            "results",
          ]);

          setServices(data);

          if (data.length === 0) {
            console.warn(
              "ServiceOS: No service array found in API response.",
              serviceResult.value
            );
          }
        } else {
          setServices([]);
          lookupErrors.push(
            `Services: ${getErrorMessage(serviceResult.reason)}`
          );
        }

        if (staffResult.status === "fulfilled") {
          setStaffMembers(
            getArray(staffResult.value, [
              "staff",
              "staffMembers",
              "members",
              "results",
            ])
          );
        } else {
          setStaffMembers([]);
          lookupErrors.push(
            `Staff: ${getErrorMessage(staffResult.reason)}`
          );
        }

        if (lookupErrors.length > 0) {
          setLookupError(lookupErrors.join(" "));
        }
      } catch (requestError) {
        setError(getErrorMessage(requestError));
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [organizationId, search, statusFilter, dateFilter]
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ------------------------------------------------------
  // CREATE BOOKING
  // IMPORTANT: bookingApi.js expects bookingData
  // ------------------------------------------------------

  const handleCreate = async (payload) => {
    if (!organizationId) {
      throw new Error("Please select a business first.");
    }

    setSaving(true);
    setError("");

    try {
      await createBooking({
        organizationId,
        bookingData: payload,
      });

      setShowModal(false);
      setEditingBooking(null);

      await loadData({ silent: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
      throw requestError;
    } finally {
      setSaving(false);
    }
  };

  // ------------------------------------------------------
  // UPDATE BOOKING
  // IMPORTANT: bookingApi.js expects bookingData
  // ------------------------------------------------------

  const handleUpdate = async (payload) => {
    if (!organizationId || !editingBooking) {
      throw new Error("Booking or organization information is missing.");
    }

    setSaving(true);
    setError("");

    try {
      await updateBooking({
        organizationId,
        bookingId: getId(editingBooking),
        bookingData: payload,
      });

      setShowModal(false);
      setEditingBooking(null);

      await loadData({ silent: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
      throw requestError;
    } finally {
      setSaving(false);
    }
  };

  // ------------------------------------------------------
  // OPEN / CLOSE MODAL
  // ------------------------------------------------------

  const openEditModal = (booking) => {
    setEditingBooking(booking);
    setShowModal(true);
  };

  const openCreateModal = () => {
    setEditingBooking(null);
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingBooking(null);
  };

  // ------------------------------------------------------
  // CHANGE BOOKING STATUS
  // IMPORTANT: status must be inside bookingData
  // ------------------------------------------------------

  const handleStatusChange = async (booking, nextStatus) => {
    if (!organizationId || !getId(booking)) return;

    try {
      setError("");

      await updateBooking({
        organizationId,
        bookingId: getId(booking),
        bookingData: {
          status: normalizeStatus(nextStatus),
        },
      });

      await loadData({ silent: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  };

  // ------------------------------------------------------
  // CANCEL BOOKING
  // ------------------------------------------------------

  const handleCancel = async () => {
    if (!organizationId || !cancelTarget) return;

    setCancelling(true);
    setError("");

    try {
      await cancelBooking({
        organizationId,
        bookingId: getId(cancelTarget),
      });

      setCancelTarget(null);

      await loadData({ silent: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setCancelling(false);
    }
  };

  // ------------------------------------------------------
  // ORGANIZATION EMPTY STATE
  // ------------------------------------------------------

  if (!organizationId) {
    return (
      <DashboardLayout>
        <div className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center p-6">
          <div className="w-full rounded-3xl border border-white/10 bg-white/[0.035] p-10 text-center backdrop-blur-xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/10 text-violet-300">
              <CalendarDays size={28} />
            </div>

            <h1 className="mt-5 text-2xl font-bold text-white">
              Select a business
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/50">
              Select or create an organization before managing bookings.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ------------------------------------------------------
  // MAIN PAGE
  // ------------------------------------------------------

  return (
    <DashboardLayout>
      <div className="min-h-screen space-y-7 pb-12">
        {/* HEADER */}

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-violet-300/80">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_12px_rgba(167,139,250,0.9)]" />
              ServiceOS / Operations
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Bookings<span className="text-violet-400">.</span>
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">
              Schedule appointments, coordinate your team, and manage every
              service booking from one workspace.
            </p>

            <p className="mt-2 text-xs text-white/35">
              Business:{" "}
              <span className="text-white/65">
                {currentOrganization?.name || "Current organization"}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => loadData()}
              disabled={loading}
              className={`${buttonClass} border border-white/10 bg-white/[0.04] text-white/70 hover:bg-white/[0.08]`}
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <button
              type="button"
              onClick={openCreateModal}
              disabled={!canCreateBooking || loading}
              title={
                !canCreateBooking
                  ? "An active customer and service are required."
                  : "Create a new booking"
              }
              className={`${buttonClass} bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-900/20 hover:brightness-110`}
            >
              <Plus size={17} />
              New booking
            </button>
          </div>
        </div>

        {/* GENERAL ERROR */}

        {error && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-400/[0.07] p-4 text-sm text-red-300">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />

            <div className="min-w-0 flex-1">
              <p className="font-semibold">Booking request failed</p>
              <p className="mt-1 break-words text-red-200/70">{error}</p>
            </div>

            <button
              type="button"
              onClick={() => setError("")}
              className="rounded-lg p-1 hover:bg-white/5"
              aria-label="Dismiss error"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* LOOKUP API ERROR */}

        {lookupError && (
          <div className="flex items-start gap-3 rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] p-4 text-sm text-amber-200">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">Some booking data could not load</p>
              <p className="mt-1 break-words text-amber-100/70">
                {lookupError}
              </p>
            </div>
          </div>
        )}

        {/* STATISTICS */}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total bookings"
            value={loading ? "—" : stats.totalBookings}
            description="Bookings in this workspace"
            icon={CalendarDays}
            color="bg-violet-500/15"
          />

          <StatCard
            title="Booking value"
            value={loading ? "—" : formatCurrency(stats.totalValue)}
            description="Reported booking value"
            icon={DollarSign}
            color="bg-emerald-500/15"
          />

          <StatCard
            title="Active customers"
            value={loading ? "—" : availableCustomers.length}
            description="Available for new bookings"
            icon={Users}
            color="bg-cyan-500/15"
          />

          <StatCard
            title="Active services"
            value={loading ? "—" : availableServices.length}
            description="Services available to book"
            icon={Wrench}
            color="bg-fuchsia-500/15"
          />
        </div>

        {/* BOOKING PREREQUISITES */}

        {!loading &&
          (availableCustomers.length === 0 ||
            availableServices.length === 0) && (
            <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] p-5">
              <div className="flex items-start gap-3">
                <AlertCircle
                  size={20}
                  className="mt-0.5 shrink-0 text-amber-300"
                />

                <div className="min-w-0">
                  <h3 className="font-semibold text-amber-200">
                    Booking prerequisites
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-amber-100/65">
                    {availableCustomers.length === 0 &&
                    availableServices.length === 0
                      ? "No active customers or services were found in the current organization."
                      : availableCustomers.length === 0
                        ? "No active customers were found in the current organization."
                        : "No active services were found in the current organization."}
                  </p>

                  <p className="mt-2 text-xs leading-5 text-amber-100/45">
                    Customer records loaded: {customers.length}. Active
                    customers: {availableCustomers.length}. Service records
                    loaded: {services.length}. Active services:{" "}
                    {availableServices.length}.
                  </p>
                </div>
              </div>
            </div>
          )}

        {/* FILTERS */}

        <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 backdrop-blur-xl">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(240px,1fr)_200px_200px]">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search bookings..."
                className={`${inputClass} pl-11`}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className={inputClass}
              aria-label="Filter by booking status"
            >
              <option value="" className="bg-[#100d19]">
                All statuses
              </option>
              <option value="pending" className="bg-[#100d19]">
                Pending
              </option>
              <option value="confirmed" className="bg-[#100d19]">
                Confirmed
              </option>
              <option value="in_progress" className="bg-[#100d19]">
                In progress
              </option>
              <option value="completed" className="bg-[#100d19]">
                Completed
              </option>
              <option value="cancelled" className="bg-[#100d19]">
                Cancelled
              </option>
              <option value="no_show" className="bg-[#100d19]">
                No show
              </option>
            </select>

            <input
              type="date"
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value)}
              className={inputClass}
              aria-label="Filter by booking date"
            />
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-white/40">
              {loading
                ? "Loading bookings..."
                : `${bookings.length} booking${bookings.length === 1 ? "" : "s"} loaded`}
            </p>

            {(search || statusFilter || dateFilter) && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("");
                  setDateFilter("");
                }}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-300 transition hover:text-violet-200"
              >
                <X size={13} />
                Clear filters
              </button>
            )}
          </div>
        </section>

        {/* BOOKING LIST */}

        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Booking schedule
              </h2>
              <p className="mt-1 text-sm text-white/40">
                Appointments for your selected business
              </p>
            </div>

            <div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white/45 sm:flex">
              <Clock size={14} />
              Live workspace data
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.025]">
              <LoaderCircle
                size={30}
                className="animate-spin text-violet-300"
              />
              <p className="mt-4 text-sm text-white/50">
                Loading your bookings...
              </p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/[0.08] text-violet-300">
                <CalendarCheck size={28} />
              </div>

              <h3 className="mt-5 text-xl font-semibold text-white">
                No bookings found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/45">
                {search || statusFilter || dateFilter
                  ? "Try changing your search or filters to find bookings."
                  : "Create your first booking to start managing appointments for this business."}
              </p>

              {!search && !statusFilter && !dateFilter && (
                <button
                  type="button"
                  onClick={openCreateModal}
                  disabled={!canCreateBooking || loading}
                  className={`${buttonClass} mt-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:brightness-110`}
                >
                  <Plus size={16} />
                  Create first booking
                </button>
              )}
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <BookingCard
                    key={getId(booking)}
                    booking={booking}
                    onEdit={openEditModal}
                    onCancel={setCancelTarget}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            </AnimatePresence>
          )}
        </section>

        {/* TROUBLESHOOTING */}

        {!loading && (customers.length === 0 || services.length === 0) && (
          <details className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
            <summary className="cursor-pointer text-sm font-medium text-white/60">
              Troubleshooting: customer and service data
            </summary>

            <div className="mt-3 space-y-2 break-words text-xs leading-5 text-white/45">
              <p>
                Customer records loaded:{" "}
                <span className="text-white/80">{customers.length}</span>
              </p>
              <p>
                Active customer records:{" "}
                <span className="text-white/80">
                  {availableCustomers.length}
                </span>
              </p>
              <p>
                Service records loaded:{" "}
                <span className="text-white/80">{services.length}</span>
              </p>
              <p>
                Active service records:{" "}
                <span className="text-white/80">
                  {availableServices.length}
                </span>
              </p>
              <p>
                Current organization ID:{" "}
                <span className="text-white/80">{organizationId}</span>
              </p>
              <p>
                Open the browser console to inspect the full customer or
                service API response if either record count is zero.
              </p>
            </div>
          </details>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}

      <BookingModal
        open={showModal}
        onClose={closeModal}
        onSubmit={editingBooking ? handleUpdate : handleCreate}
        customers={availableCustomers}
        services={availableServices}
        staffMembers={availableStaff}
        saving={saving}
        initialBooking={editingBooking}
      />

      {/* CANCEL CONFIRMATION */}

      {cancelTarget && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="w-full max-w-md rounded-3xl border border-white/10 bg-[#100d19] p-6 shadow-2xl shadow-black/50"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-400/20 bg-red-400/10 text-red-300">
              <AlertCircle size={23} />
            </div>

            <h3 className="mt-5 text-xl font-bold text-white">
              Cancel this booking?
            </h3>

            <p className="mt-2 text-sm leading-6 text-white/50">
              This will cancel the booking for{" "}
              <span className="font-medium text-white/80">
                {getCustomerName(cancelTarget.customer)}
              </span>
              . Make sure this is the correct appointment before continuing.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={cancelling}
                onClick={() => setCancelTarget(null)}
                className={`${buttonClass} border border-white/10 text-white/70 hover:bg-white/5`}
              >
                Keep booking
              </button>

              <button
                type="button"
                disabled={cancelling}
                onClick={handleCancel}
                className={`${buttonClass} bg-red-500/90 text-white hover:bg-red-500`}
              >
                {cancelling ? (
                  <LoaderCircle size={16} className="animate-spin" />
                ) : (
                  <Ban size={16} />
                )}
                {cancelling ? "Cancelling..." : "Yes, cancel booking"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
}
