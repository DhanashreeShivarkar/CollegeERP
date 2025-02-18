export const getStoredUser = () => {
  try {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error parsing stored user data:", error);
    return null;
  }
};

export const clearStoredUser = () => {
  localStorage.removeItem("user");
};

export const storeUser = (userData: any) => {
  localStorage.setItem("user", JSON.stringify(userData));
};

export const isSessionValid = () => {
  const user = getStoredUser();
  return !!user && !!user.designation;
};
