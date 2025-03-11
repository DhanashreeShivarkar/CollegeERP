import React, { useState, useEffect } from 'react';
import {
  Paper,
  Grid,
  TextField,
  Button,
  Typography,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface QualificationForm {
  degree: string;
  specialization: string;
  university: string;
  yearOfPassing: string;
  percentage: string;
  grade: string;
}

const AcademicQualification: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const employeeId = searchParams.get('empId');

  useEffect(() => {
    if (!employeeId) {
      navigate('/dashboard/establishment/employeedetails');
      return;
    }
    // Load academic qualifications for this employee
  }, [employeeId, navigate]);

  const [formData, setFormData] = useState<QualificationForm>({
    degree: '',
    specialization: '',
    university: '',
    yearOfPassing: '',
    percentage: '',
    grade: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (e: any) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handlePrevious = () => {
    // Navigate back without clearing the form data
    navigate('/dashboard/establishment/employeedetails');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your save logic here
    console.log('Saving:', formData);
  };

  const handleSaveAndNext = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Save logic here
      // After successful save to final step:
      localStorage.removeItem('currentEmployeeData');
      localStorage.removeItem('currentEmployeeId');
      // Navigate to next page
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  const handleClear = () => {
    setFormData({
      degree: '',
      specialization: '',
      university: '',
      yearOfPassing: '',
      percentage: '',
      grade: ''
    });
  };

  return (
    <Paper elevation={3} sx={{ p: 2, m: 2 }}>
      <form onSubmit={handleSave}>
        <Stack spacing={2}>
          <Typography variant="h6" gutterBottom>
            Academic Qualification Details
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Degree</InputLabel>
                <Select
                  name="degree"
                  value={formData.degree}
                  onChange={handleSelectChange}
                  label="Degree"
                >
                  <MenuItem value="BE">B.E.</MenuItem>
                  <MenuItem value="BTECH">B.Tech</MenuItem>
                  <MenuItem value="ME">M.E.</MenuItem>
                  <MenuItem value="MTECH">M.Tech</MenuItem>
                  <MenuItem value="PHD">Ph.D</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={4}>
              <TextField
                fullWidth
                size="small"
                label="Specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                fullWidth
                size="small"
                label="University"
                name="university"
                value={formData.university}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                fullWidth
                size="small"
                label="Year of Passing"
                name="yearOfPassing"
                type="number"
                value={formData.yearOfPassing}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                fullWidth
                size="small"
                label="Percentage"
                name="percentage"
                type="number"
                value={formData.percentage}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                fullWidth
                size="small"
                label="Grade"
                name="grade"
                value={formData.grade}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>

          {/* Buttons */}
          <Grid container spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
            <Grid item>
              <Button
                variant="outlined"
                color="primary"
                onClick={handlePrevious}
              >
                Previous
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleClear}
              >
                Clear
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                type="submit"
              >
                Save
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveAndNext}
              >
                Save & Next
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
              >
                Next
              </Button>
            </Grid>
          </Grid>
        </Stack>
      </form>
    </Paper>
  );
};

export default AcademicQualification;