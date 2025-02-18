import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../api/auth";
import type { LoginResponse } from "../../types/auth";
import api from "../../api/axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import OTPModal from "./OTPModal";
import { getDashboardRoute } from "../../utils/roles";
import Captcha from "./Captcha";
import ForgotPasswordModal from "./ForgotPasswordModal";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onLoginSuccess: (data: any) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
  open,
  onClose,
  onLoginSuccess,
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCaptchaValid) {
      setError("Please complete the captcha");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const response: LoginResponse = await authService.login({
        user_id: userId.trim().toUpperCase(),
        password: password.trim(),
      });

      if (response.status === "success") {
        setUserData(response);
        setShowOTP(true);
      } else {
        let errorMessage = response.message;
        if (response.attempts !== undefined) {
          const lastAttempt = response.last_attempt
            ? new Date(response.last_attempt).toLocaleString()
            : "Unknown";
          errorMessage += `\nLast attempt: ${lastAttempt}`;

          if (response.locked) {
            errorMessage += `\nReason: ${response.reason || "Account locked"}`;
          }
        }
        setError(errorMessage);
        setPassword("");
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSuccess = (userData: any) => {
    console.log("=== Navigation Debug ===");
    console.log("Full user data:", userData);

    // Store user data in localStorage first
    localStorage.setItem("user", JSON.stringify(userData));

    // Update app state
    onLoginSuccess(userData);

    // Close modals
    setShowOTP(false);
    onClose();

    // Get the correct route based on designation
    const designationCode = userData.designation?.code;
    const dashboardRoute = getDashboardRoute(designationCode);

    // Navigate to dashboard
    navigate(dashboardRoute, { replace: true });
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          style: {
            backdropFilter: "blur(5px)",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
          },
        }}
        BackdropProps={{
          style: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
          },
        }}
      >
        <DialogTitle sx={{ textAlign: "center", pb: 1 }}>
          Welcome Back
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ mb: 3 }}
            >
              Please login to continue
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              id="userId"
              name="userId"
              label="User ID"
              type="text"
              fullWidth
              required
              autoComplete="username"
              value={userId}
              onChange={(e) => setUserId(e.target.value.toUpperCase())}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              id="password"
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Link
              component="button"
              type="button"
              variant="body2"
              onClick={() => setShowForgotPassword(true)}
              sx={{
                display: "block",
                textAlign: "right",
                mt: 1,
                mb: 2,
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Forgot Password?
            </Link>
            <Captcha onValidate={setIsCaptchaValid} />
            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={onClose}
              sx={{
                minWidth: "100px",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading || !userId || !password || !isCaptchaValid}
              sx={{
                minWidth: "100px",
                boxShadow: "none",
                "&:hover": {
                  boxShadow: "none",
                },
              }}
            >
              {loading ? <CircularProgress size={24} /> : "Login"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      {showForgotPassword && (
        <ForgotPasswordModal
          open={showForgotPassword}
          onClose={() => setShowForgotPassword(false)}
        />
      )}
      {showOTP && userData && (
        <OTPModal
          open={showOTP}
          onClose={() => {
            setShowOTP(false);
            setUserData(null);
          }}
          userId={userData.user_id}
          maskedEmail={userData.email}
          onVerificationSuccess={handleOTPSuccess}
        />
      )}
    </>
  );
};

export default LoginModal;
