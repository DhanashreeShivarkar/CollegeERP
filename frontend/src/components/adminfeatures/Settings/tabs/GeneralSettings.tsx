import React from "react";
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Switch,
  FormControlLabel,
} from "@mui/material";

const GeneralSettings = () => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        General Settings
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Institution Name"
            defaultValue="College ERP"
            margin="normal"
          />
          <TextField
            fullWidth
            label="Website URL"
            defaultValue="https://collegeerp.com"
            margin="normal"
          />
          <TextField
            fullWidth
            label="Contact Email"
            defaultValue="contact@collegeerp.com"
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Enable Notifications"
          />
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Allow Public Registration"
          />
          <FormControlLabel control={<Switch />} label="Maintenance Mode" />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary">
            Save Changes
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default GeneralSettings;
