import React from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const EmailSettings = () => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Email Settings
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="SMTP Server"
            defaultValue="smtp.gmail.com"
            margin="normal"
          />
          <TextField
            fullWidth
            label="SMTP Port"
            defaultValue="587"
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email Username"
            defaultValue="noreply@collegeerp.com"
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email Password"
            type="password"
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Email Template Language</InputLabel>
            <Select defaultValue="en">
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="es">Spanish</MenuItem>
              <MenuItem value="fr">French</MenuItem>
            </Select>
          </FormControl>
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Enable Email Notifications"
          />
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Send Welcome Email"
          />
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Include System Updates"
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" sx={{ mr: 2 }}>
            Save Settings
          </Button>
          <Button variant="outlined">Test Email Connection</Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EmailSettings;
