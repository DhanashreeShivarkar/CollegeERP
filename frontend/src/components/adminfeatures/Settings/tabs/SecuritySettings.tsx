import React from "react";
import {
  Box,
  Grid,
  Typography,
  FormControlLabel,
  Switch,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

const SecuritySettings = () => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Security Settings
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Password Policy</InputLabel>
            <Select defaultValue="strong">
              <MenuItem value="basic">Basic</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="strong">Strong</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Session Timeout (minutes)"
            type="number"
            defaultValue={30}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Enable 2FA"
          />
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Force Password Change"
          />
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="IP Restriction"
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary">
            Update Security Settings
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SecuritySettings;
