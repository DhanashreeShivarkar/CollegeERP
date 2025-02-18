import React from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
} from "@mui/material";

const AcademicSettings = () => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Academic Settings
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Current Academic Year</InputLabel>
            <Select defaultValue="2023-24">
              <MenuItem value="2023-24">2023-24</MenuItem>
              <MenuItem value="2024-25">2024-25</MenuItem>
              <MenuItem value="2025-26">2025-26</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Grading System</InputLabel>
            <Select defaultValue="percentage">
              <MenuItem value="percentage">Percentage</MenuItem>
              <MenuItem value="gpa">GPA</MenuItem>
              <MenuItem value="cgpa">CGPA</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Minimum Attendance Required (%)"
            type="number"
            defaultValue={75}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Enable Online Assignments"
          />
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Allow Course Registration"
          />
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Enable Result Publishing"
          />
          <FormControlLabel
            control={<Switch />}
            label="Lock Academic Records"
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" sx={{ mr: 2 }}>
            Save Academic Settings
          </Button>
          <Button variant="outlined">Reset to Defaults</Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AcademicSettings;
