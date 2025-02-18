import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  LinearProgress,
  Box,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { checkPasswordStrength } from "../../utils/passwordStrength";
import { authService } from "../../api/auth";
import type {
  PasswordResetResponse,
  ResetOtpVerifyResponse,
  PasswordResetConfirmResponse,
} from "../../types/auth";
import type { PasswordStrength } from "../../utils/passwordStrength";

interface ForgotPasswordModalProps {
  open: boolean;
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  open,
  onClose,
}) => {
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    suggestions: [],
    isStrong: false,
  });
  const [verifiedOtp, setVerifiedOtp] = useState(""); // Add this state

  // Reset all state when modal closes
  useEffect(() => {
    if (!open) {
      setStep(1);
      setUserId("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
      setError("");
      setSuccess("");
      setVerifiedOtp("");
      setPasswordStrength({ score: 0, suggestions: [], isStrong: false });
    }
  }, [open]);

  const handleRequestOTP = async () => {
    if (!userId.trim()) {
      setError("Please enter your User ID");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response: PasswordResetResponse =
        await authService.requestPasswordReset(userId);
      if (response.status === "success") {
        setStep(2);
        setSuccess(response.message || "OTP sent to your registered email");
      } else {
        setError(response.message || "Failed to send OTP");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Failed to send OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      setError("Please enter the OTP");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response: ResetOtpVerifyResponse = await authService.verifyResetOtp(
        userId,
        otp
      );
      if (response.status === "success" && response.verified) {
        setVerifiedOtp(otp); // Store the verified OTP
        setStep(3);
        setSuccess("OTP verified successfully");
      } else {
        setError(response.message || "Invalid OTP");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setNewPassword(password);
    setPasswordStrength(checkPasswordStrength(password));
  };

  const handleResetPassword = async () => {
    if (!verifiedOtp) {
      setError("OTP verification required");
      setStep(2);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!passwordStrength.isStrong) {
      setError("Please use a stronger password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response: PasswordResetConfirmResponse =
        await authService.resetPassword(
          userId,
          verifiedOtp, // Use the stored verified OTP
          newPassword
        );

      if (response.status === "success") {
        setSuccess("Password reset successful");
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        if (response.message.includes("Cannot reuse")) {
          setError(
            "You cannot reuse any of your last 5 passwords. Please choose a different password."
          );
          setNewPassword("");
          setConfirmPassword("");
        } else {
          setError(response.message);
          // Only reset OTP verification if it's an OTP-related error
          if (response.message.includes("OTP")) {
            setStep(2);
            setVerifiedOtp("");
          }
        }
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message;

      if (errorMessage.includes("Cannot reuse")) {
        setError(
          "You cannot reuse any of your last 5 passwords. Please choose a different password."
        );
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setError(errorMessage);
        // Only reset OTP verification if it's an OTP-related error
        if (errorMessage.includes("OTP")) {
          setStep(2);
          setVerifiedOtp("");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        {step === 3
          ? "Set New Password"
          : "Reset Password - Step " + step + "/3"}
      </DialogTitle>
      <DialogContent>
        {loading && <LinearProgress sx={{ mb: 2 }} />}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {step === 1 && (
          <TextField
            fullWidth
            label="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value.toUpperCase())}
            margin="normal"
            disabled={loading}
            autoFocus
          />
        )}

        {step === 2 && (
          <TextField
            fullWidth
            label="Enter OTP"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            margin="normal"
            disabled={loading}
            autoFocus
            inputProps={{
              maxLength: 6,
              inputMode: "numeric",
              pattern: "[0-9]*",
            }}
          />
        )}

        {step === 3 && (
          <>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Please choose a new password that you haven't used in your last
                5 password changes.
              </Typography>
            </Box>
            <TextField
              fullWidth
              label="New Password"
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={handlePasswordChange}
              margin="normal"
              disabled={loading}
              autoFocus
              error={!!error && error.includes("Cannot reuse")}
              helperText={error && error.includes("Cannot reuse") ? error : ""}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {newPassword && (
              <Box sx={{ mt: 1, mb: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={(passwordStrength.score / 4) * 100}
                  color={passwordStrength.isStrong ? "success" : "warning"}
                />
                {passwordStrength.suggestions.map((suggestion, index) => (
                  <Typography
                    key={index}
                    variant="caption"
                    display="block"
                    color="text.secondary"
                  >
                    • {suggestion}
                  </Typography>
                ))}
              </Box>
            )}
            <TextField
              fullWidth
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              margin="normal"
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        {step === 1 && (
          <Button
            onClick={handleRequestOTP}
            disabled={loading || !userId.trim()}
            variant="contained"
          >
            Send OTP
          </Button>
        )}
        {step === 2 && (
          <Button
            onClick={handleVerifyOTP}
            disabled={loading || !otp || otp.length !== 6}
            variant="contained"
          >
            Verify OTP
          </Button>
        )}
        {step === 3 && (
          <Button
            onClick={handleResetPassword}
            disabled={
              loading ||
              !newPassword ||
              !confirmPassword ||
              !passwordStrength.isStrong
            }
            variant="contained"
          >
            Reset Password
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ForgotPasswordModal;
