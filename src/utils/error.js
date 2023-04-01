export const generateErrorMessage = (message, statusCode, errorDetails) => {
  const error = new Error(message);
  error.statusCode = statusCode || 500;
  error.data = errorDetails;
  return error;
};
