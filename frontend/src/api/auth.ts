import axiosInstance from "./axios";
import type { User, Designation } from "../types/auth";

export interface LoginRequest {
  user_id: string;
  password: string;
}

export interface LoginResponse {
  status: "success" | "error";
  message: string;
  user_id?: string;
  email?: string;
}

export interface VerifyOTPResponse {
  status: "success" | "error";
  message: string;
  user?: User;
}

export interface OtpSendResponse {
  status: "success" | "error";
  message: string;
  user_id?: string;
  email?: string;
}

const DEBUG = true; // Enable debug logging

const API_ENDPOINTS = {
  login: "api/auth/login/",
  verifyOtp: "api/auth/verify-otp/",
  sendOtp: "api/auth/send-otp/",
  requestPasswordReset: "api/auth/request-password-reset/",
  verifyResetOtp: "api/auth/verify-reset-otp/",
  resetPassword: "api/auth/reset-password/",
};

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    if (DEBUG) {
      console.group("Auth Service - Login");
      console.log("Request:", {
        url: API_ENDPOINTS.login,
        data: {
          user_id: credentials.user_id.toUpperCase(),
          password: "********",
        },
      });
    }

    try {
      const response = await axiosInstance.post(API_ENDPOINTS.login.trim(), {
        user_id: credentials.user_id.trim().toUpperCase(),
        password: credentials.password.trim(),
      });

      if (DEBUG) {
        console.log("Response:", response.data);
        console.groupEnd();
      }

      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        (error.response?.status === 401
          ? "Invalid User ID or Password"
          : "Login failed");
      if (DEBUG) {
        console.error("Login request failed:", {
          url: API_ENDPOINTS.login,
          error: errorMessage,
        });
        console.groupEnd();
      }
      throw new Error(errorMessage);
    }
  },

  verifyOtp: async (
    userId: string,
    otp: string
  ): Promise<VerifyOTPResponse> => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.verifyOtp, {
        user_id: userId.toUpperCase(),
        otp: otp.trim(),
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Invalid OTP");
    }
  },

  sendOtp: async (userId: string): Promise<OtpSendResponse> => {
    if (DEBUG) {
      console.group("Auth Service - Send OTP");
      console.log("Request:", {
        url: API_ENDPOINTS.sendOtp,
        data: { user_id: userId.toUpperCase() },
      });
    }

    try {
      const response = await axiosInstance.post(API_ENDPOINTS.sendOtp, {
        user_id: userId.toUpperCase().trim(),
      });

      // Ensure email is masked in the response
      if (response.data.email) {
        const [username, domain] = response.data.email.split("@");
        response.data.email = `${username[0]}${"*".repeat(
          username.length - 2
        )}${username.slice(-1)}@${domain}`;
      }

      if (DEBUG) {
        console.log("Response:", response.data);
        console.groupEnd();
      }

      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to send OTP";
      if (DEBUG) {
        console.error("Send OTP failed:", errorMessage);
        console.groupEnd();
      }
      throw new Error(errorMessage);
    }
  },

  requestPasswordReset: async (userId: string): Promise<any> => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.requestPasswordReset,
      {
        user_id: userId.toUpperCase(),
      }
    );
    return response.data;
  },

  verifyResetOtp: async (userId: string, otp: string): Promise<any> => {
    const response = await axiosInstance.post(API_ENDPOINTS.verifyResetOtp, {
      user_id: userId.toUpperCase(),
      otp: otp,
    });
    return response.data;
  },

  resetPassword: async (
    userId: string,
    otp: string,
    newPassword: string
  ): Promise<any> => {
    const response = await axiosInstance.post(API_ENDPOINTS.resetPassword, {
      user_id: userId.toUpperCase(),
      otp: otp,
      new_password: newPassword,
    });
    return response.data;
  },
};
