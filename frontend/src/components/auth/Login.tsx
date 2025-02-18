import React, { useState } from "react";
import { authService } from "../../api/auth";
import OTPModal from "./OTPModal";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  CircularProgress,
} from "@mui/material";

interface LoginProps {
  onLoginSuccess: (userData: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [loginData, setLoginData] = useState<{
    userId: string;
    email: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    console.group("Login Form Submission");
    console.log("Form Data:", formData);

    try {
      const response = await authService.login({
        user_id: formData.userId,
        password: formData.password,
      });

      console.log("Login Response:", response);

      if (response.status === "success") {
        setLoginData({
          userId: response.user_id!,
          email: response.email!,
        });
        setShowOTPModal(true);
      }
    } catch (err: any) {
      console.error("Login Error:", {
        response: err.response?.data,
        status: err.response?.status,
        message: err.message,
      });
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
      console.groupEnd();
    }
  };

  const handleOTPSuccess = (userData: any) => {
    onLoginSuccess(userData);
  };

  return (
    <>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
            <Typography component="h1" variant="h5" align="center" gutterBottom>
              Login
            </Typography>

            <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="userId"
                label="User ID"
                name="userId"
                autoComplete="off"
                autoFocus
                value={formData.userId}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Login"}
              </Button>
            </Box>

            {error && (
              <Typography color="error" align="center" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
          </Paper>
        </Box>
      </Container>
      {showOTPModal && loginData && (
        <OTPModal
          open={showOTPModal}
          onClose={() => setShowOTPModal(false)}
          userId={loginData.userId}
          maskedEmail={loginData.email}
          onVerificationSuccess={handleOTPSuccess}
        />
      )}
    </>
  );
};

export default Login;
