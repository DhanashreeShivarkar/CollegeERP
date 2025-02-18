export const handleLogout = () => {
  // Clear all auth-related data
  localStorage.removeItem("user");
  sessionStorage.clear();

  // Redirect to home page
  window.location.href = "/";
};
