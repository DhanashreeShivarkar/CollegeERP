import axios, { InternalAxiosRequestConfig } from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  console.log(
    `${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
    config.data
  );
  return config;
});

export default axiosInstance;
