
// This file helps with import consistency across the app
export const authContextPath = "../context/auth/AuthContext";

// Add helper function to get the correct relative path based on component location
export const getAuthContextImport = (level = 1) => {
  if (level === 1) return "../context/auth/AuthContext";
  if (level === 2) return "../../context/auth/AuthContext";
  return "../".repeat(level) + "context/auth/AuthContext";
};
