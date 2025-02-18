import React, { useEffect, useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { Refresh } from "@mui/icons-material";

interface CaptchaProps {
  onValidate: (isValid: boolean) => void;
}

const Captcha: React.FC<CaptchaProps> = ({ onValidate }) => {
  const [captchaText, setCaptchaText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [error, setError] = useState(false);

  const generateCaptcha = () => {
    const charset = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setCaptchaText(result);
    setUserInput("");
    setError(false);
    onValidate(false);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserInput(value);
    setError(false);

    if (value.length === captchaText.length) {
      const isValid = value === captchaText;
      setError(!isValid);
      onValidate(isValid);
    } else {
      onValidate(false);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 1,
        }}
      >
        <Box
          sx={{
            p: 2,
            bgcolor: "#f0f0f0",
            borderRadius: 1,
            position: "relative",
            overflow: "hidden",
            fontFamily: "monospace",
            letterSpacing: "3px",
            fontWeight: "bold",
            fontSize: "20px",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(45deg, transparent 45%, #e0e0e0 50%, transparent 55%)",
              backgroundSize: "8px 8px",
            },
            "&::after": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)",
            },
          }}
        >
          <Typography
            sx={{
              color: "#444",
              textShadow: "2px 2px 3px rgba(0,0,0,0.2)",
              transform: "skew(-15deg)",
              position: "relative",
              zIndex: 1,
              userSelect: "none",
            }}
          >
            {captchaText}
          </Typography>
        </Box>
        <Button
          onClick={generateCaptcha}
          size="small"
          sx={{ minWidth: "auto" }}
        >
          <Refresh />
        </Button>
      </Box>
      <TextField
        fullWidth
        size="small"
        placeholder="Enter the code above"
        value={userInput}
        onChange={handleInputChange}
        error={error}
        helperText={error ? "Invalid captcha" : ""}
        sx={{ mt: 1 }}
      />
    </Box>
  );
};

export default Captcha;
