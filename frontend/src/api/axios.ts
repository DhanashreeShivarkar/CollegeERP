import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  // Clean up URL by removing extra spaces
  if (config.url) {
    config.url = config.url.trim();
  }

  const fullUrl = `${config.baseURL}/${config.url}`;
  console.log("Making request to:", fullUrl);
  return config;
});

export default axiosInstance;
