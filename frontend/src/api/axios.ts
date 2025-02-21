import axios, { InternalAxiosRequestConfig } from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for CSRF
});

// Function to get CSRF token from cookies
function getCsrfToken() {
  const name = "csrftoken";
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// Request interceptor
axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // Add CSRF token to headers
  const csrfToken = getCsrfToken();
  if (csrfToken) {
    config.headers["X-CSRFToken"] = csrfToken;
  }

  // Log request for debugging
  console.log("Request:", {
    method: config.method?.toUpperCase(),
    url: `${config.baseURL}${config.url}`,
    data: config.data,
    headers: config.headers,
  });

  return config;
});

// Response interceptor for better error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
    });
    return Promise.reject(error);
  }
);

export default axiosInstance;
