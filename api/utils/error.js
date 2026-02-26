// utils/error.js
// Used in all controllers: createError(404, "Not found")

export const createError = (status, message) => {
  const err = new Error(message);
  err.status = status;
  err.message = message;
  return err;
};