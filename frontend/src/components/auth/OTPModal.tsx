import React, { useState, useEffect } from "react";
import { authService } from "../../api/auth";
import type { OtpVerifyResponse, User } from "../../types/auth";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";

interface OTPModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  maskedEmail: string;
  onVerificationSuccess: (userData: User) => void;
}

const OTPModal: React.FC<OTPModalProps> = ({
  open,
  onClose,
  userId,
  maskedEmail,
  onVerificationSuccess,
}) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(180);
  const [resendDisabled, setResendDisabled] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (open && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setResendDisabled(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [open, timer]);

  const handleOTPInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length <= 6) {
      setOtp(value);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await authService.sendOtp(userId);
      if (response.status === "success") {
        setTimer(180);
        setResendDisabled(true);
        setOtp("");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Please enter a 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Use authService instead of direct axios call
      const response = await authService.verifyOtp(userId, otp);

      if (response.status === "success") {
        // Store tokens and user data
        if (response.token) {
          localStorage.setItem("token", response.token);
        }
        if (response.refresh) {
          localStorage.setItem("refreshToken", response.refresh);
        }
        if (response.user) {
          localStorage.setItem("user", JSON.stringify(response.user));
          onVerificationSuccess(response.user);
        }
      } else {
        setError(response.message || "Verification failed");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to verify OTP");
      setOtp(""); // Clear OTP on error
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle sx={{ textAlign: "center", pb: 1 }}>Verify OTP</DialogTitle>
      <form onSubmit={handleVerifyOTP}>
        <DialogContent>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3, textAlign: "center" }}
          >
            Please enter the 6-digit code sent to
            <br />
            <Box component="span" sx={{ fontWeight: "medium" }}>
              {maskedEmail}
            </Box>
          </Typography>
          <TextField
            autoFocus
            fullWidth
            value={otp}
            onChange={handleOTPInput}
            placeholder="Enter OTP"
            inputProps={{
              maxLength: 6,
              inputMode: "numeric",
              pattern: "[0-9]*",
              style: {
                textAlign: "center",
                letterSpacing: "0.5em",
                fontSize: "1.5rem",
              },
            }}
            sx={{ mb: 2 }}
          />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: "center" }}
          >
            Time remaining: {formatTime(timer)}
          </Typography>
          {error && (
            <Typography
              color="error"
              variant="body2"
              sx={{ mt: 2, textAlign: "center" }}
            >
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, justifyContent: "center" }}>
          <Button
            onClick={handleResendOTP}
            disabled={resendDisabled || loading}
            sx={{ mr: 1 }}
          >
            Resend OTP
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || otp.length !== 6}
          >
            {loading ? <CircularProgress size={24} /> : "Verify"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default OTPModal;
