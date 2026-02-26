// src/utils/bookingHelpers.js

// Number of nights between two date strings
export const getNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const diff = new Date(checkOut) - new Date(checkIn);
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

// All dates between checkIn and checkOut (inclusive)
export const getDatesBetween = (checkIn, checkOut) => {
  const dates = [];
  let current = new Date(checkIn);
  const end   = new Date(checkOut);
  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

// Check if a date is in the unavailable list
export const isDateUnavailable = (date, unavailableDates = []) => {
  return unavailableDates.some(
    (d) => new Date(d).toDateString() === new Date(date).toDateString()
  );
};

// Rating label
export const getRatingLabel = (rating) => {
  if (!rating) return "";
  if (rating >= 4.8) return "Exceptional";
  if (rating >= 4.5) return "Superb";
  if (rating >= 4.0) return "Excellent";
  if (rating >= 3.5) return "Very Good";
  if (rating >= 3.0) return "Good";
  return "Satisfactory";
};

// Format date string nicely: "2025-03-15" → "15 Mar 2025"
export const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};