import axiosInstance from "./axios";
import type { User } from "../types/auth";

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
  token?: string; // Add this for access token
  refresh?: string; // Add this for refresh token
}

export interface OtpSendResponse {
  status: "success" | "error";
  message: string;
  user_id?: string;
  email?: string;
  locked?: boolean;
  lockTime?: string;
}

export interface PasswordResetResponse {
  status: "success" | "error";
  message: string;
  email?: string;
}

export interface ResetOtpVerifyResponse {
  status: "success" | "error";
  message: string;
  verified: boolean;
}

export interface PasswordResetConfirmResponse {
  status: "success" | "error";
  message: string;
}

const API_ENDPOINTS = {
  login: "/api/auth/login/",
  verifyOtp: "/api/auth/verify-otp/",
  sendOtp: "/api/auth/send-otp/",
  requestPasswordReset: "/api/auth/request-password-reset/",
  verifyResetOtp: "/api/auth/verify-reset-otp/",
  resetPassword: "/api/auth/reset-password/",
};

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post(API_ENDPOINTS.login, {
      user_id: credentials.user_id.toUpperCase(),
      password: credentials.password,
    });
    return response.data;
  },

  verifyOtp: async (
    userId: string,
    otp: string
  ): Promise<VerifyOTPResponse> => {
    const response = await axiosInstance.post(API_ENDPOINTS.verifyOtp, {
      user_id: userId.toUpperCase(),
      otp: otp,
    });
    return response.data;
  },

  sendOtp: async (userId: string): Promise<OtpSendResponse> => {
    const response = await axiosInstance.post(API_ENDPOINTS.sendOtp, {
      user_id: userId.toUpperCase(),
    });
    return response.data;
  },

  requestPasswordReset: async (
    userId: string
  ): Promise<PasswordResetResponse> => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.requestPasswordReset,
      {
        user_id: userId.toUpperCase(),
      }
    );
    return response.data;
  },

  verifyResetOtp: async (
    userId: string,
    otp: string
  ): Promise<ResetOtpVerifyResponse> => {
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
  ): Promise<PasswordResetConfirmResponse> => {
    const response = await axiosInstance.post(API_ENDPOINTS.resetPassword, {
      user_id: userId.toUpperCase(),
      otp: otp,
      new_password: newPassword,
    });
    return response.data;
  },
};

export default authService;
