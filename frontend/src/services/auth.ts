import axios from "axios";

// Define base URL without '/api' suffix since it's included in the routes
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

// Create axios instance with base configuration
const authApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const login = async (user_id: string, password: string) => {
  try {
    const response = await authApi.post("/api/auth/login/", {
      user_id,
      password,
    });

    console.log("Login response:", response.data);

    if (response.data) {
      // Store the complete user data
      localStorage.setItem("user", JSON.stringify(response.data));
      console.log("Stored user data:", response.data);
    }
    return response.data;
  } catch (error: any) {
    console.error("Login request error:", {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    });

    if (error.response?.status === 404) {
      throw new Error(
        "Login endpoint not found. Please verify the API URL and server status."
      );
    }
    throw error;
  }
};

export const verifyOTP = async (userId: string, otp: string) => {
  try {
    const response = await authApi.post("/api/auth/verify-otp/", {
      user_id: userId,
      otp: otp,
    });
    return response.data;
  } catch (error: any) {
    console.error("OTP verification error:", {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    });
    throw error;
  }
};
