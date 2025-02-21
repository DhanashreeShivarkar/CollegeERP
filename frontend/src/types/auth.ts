export interface Designation {
  id: number;
  name: string;
  code: string;
  permissions: Record<string, any>;
}

export interface User {
  user_id: string;
  username: string;
  email: string;
  designation: {
    code: string;
    name: string;
  };
  first_name: string;
  last_name: string;
  is_superuser: boolean;
  permissions: string[];
}

export interface LoginResponse {
  status: "success" | "error";
  message: string;
  user_id?: string;
  email?: string;
  attempts?: number;
  last_attempt?: string;
  locked?: boolean;
  reason?: string;
}

export interface OtpVerifyResponse {
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
