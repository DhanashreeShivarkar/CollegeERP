import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000", // adjust this to match your Django server
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    try {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      console.log("User data found:", userData);

      // Add username in Authorization header
      if (userData.username) {
        config.headers["Authorization"] = `Username ${userData.username}`;
        console.log("Added auth header:", config.headers["Authorization"]);
      }
    } catch (error) {
      console.error("Error in request interceptor:", error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for debugging
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
      url: error.config?.url,
    });
    return Promise.reject(error);
  }
);

export default axiosInstance;
