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
  CircularProgress,
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { employeeService } from '../../api/MasterEmployeeService';

interface EmployeeDetails {
  EMPLOYEE_ID: string;
  EMP_NAME: string;
  DESIGNATION_NAME: string; // Changed from nested object
  DEPARTMENT_NAME: string;  // Changed from nested object
}

interface QualificationForm {
  RECORD_ID?: string;  // Add this field as optional
  ORDER_TYPE: number;
  EMPLOYEE_TYPE: string;
  JOINING_DATE_COLLEGE: string;
  JOINING_DATE_SANSTHA: string;
  DEGREE: string;
  UNIVERSITY_BOARD: string;
  COLLEGE_NAME: string;
  REGISTRATION_NUMBER: string;
  REGISTRATION_DATE: string;
  VALID_UPTO_DATE: string;
  COUNCIL_NAME: string;
  PASSING_DATE: string;
  SPECIALIZATION: string;
  PASSING_MONTH: string;
  PASSING_YEAR: string;
  TOTAL_MARKS: string;
  OBTAINED_MARKS: string;
  PERCENTAGE: string;
  DIVISION: string;
}

const ORDER_TYPE_OPTIONS = [
  { value: "ADHOC", label: "ADHOC" }
];

const DEGREE_OPTIONS = [
  { value: "10TH", label: "10th Standard" },
  { value: "12TH", label: "12th Standard" },
  { value: "DIPLOMA", label: "Diploma" },
  { value: "UG", label: "Under Graduate" },
  { value: "PG", label: "Post Graduate" },
  { value: "PHD", label: "Ph.D" },
  { value: "OTHER", label: "Other" }
];

const DIVISION_OPTIONS = [
  { value: "FIRST", label: "First Class" },
  { value: "SECOND", label: "Second Class" },
  { value: "THIRD", label: "Third Class" },
  { value: "PASS", label: "Pass Class" }
];

const AcademicQualification: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const employeeId = searchParams.get('empId');
  const [loading, setLoading] = useState(true);
  const [employeeDetails, setEmployeeDetails] = useState<EmployeeDetails | null>(null);
  const [saveLoading, setSaveLoading] = useState(false); // Add this state
  const [existingQualification, setExistingQualification] = useState<QualificationForm | null>(null);

  useEffect(() => {
    if (!employeeId) {
      navigate('/dashboard/establishment/employeedetails');
      return;
    }
    
    const fetchData = async () => {
      try {
        setLoading(true);
        const [employeeResponse, qualificationsResponse] = await Promise.all([
          employeeService.getEmployee(employeeId),
          employeeService.getQualifications(employeeId)
        ]);

        setEmployeeDetails(employeeResponse.data);
        
        // Format dates from qualification data
        if (qualificationsResponse.data && qualificationsResponse.data.length > 0) {
          const qualification = qualificationsResponse.data[0];
          
          // Format dates to YYYY-MM-DD format for form inputs
          const formattedQualification = {
            ...qualification,
            JOINING_DATE_COLLEGE: qualification.JOINING_DATE_COLLEGE ? qualification.JOINING_DATE_COLLEGE.split('T')[0] : '',
            JOINING_DATE_SANSTHA: qualification.JOINING_DATE_SANSTHA ? qualification.JOINING_DATE_SANSTHA.split('T')[0] : '',
            REGISTRATION_DATE: qualification.REGISTRATION_DATE ? qualification.REGISTRATION_DATE.split('T')[0] : '',
            VALID_UPTO_DATE: qualification.VALID_UPTO_DATE ? qualification.VALID_UPTO_DATE.split('T')[0] : '',
            PASSING_DATE: qualification.PASSING_DATE ? qualification.PASSING_DATE.split('T')[0] : '',
          };

          setExistingQualification(formattedQualification);
          setFormData(formattedQualification); // Pre-fill form with existing data
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Error loading employee qualification data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [employeeId, navigate]);

  const [formData, setFormData] = useState<QualificationForm>({
    ORDER_TYPE: 1,
    EMPLOYEE_TYPE: '',
    JOINING_DATE_COLLEGE: '',
    JOINING_DATE_SANSTHA: '',
    DEGREE: '',
    UNIVERSITY_BOARD: '',
    COLLEGE_NAME: '',
    REGISTRATION_NUMBER: '',
    REGISTRATION_DATE: '',
    VALID_UPTO_DATE: '',
    COUNCIL_NAME: '',
    PASSING_DATE: '',
    SPECIALIZATION: '',
    PASSING_MONTH: '',
    PASSING_YEAR: '',
    TOTAL_MARKS: '',
    OBTAINED_MARKS: '',
    PERCENTAGE: '',
    DIVISION: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };

      // Calculate percentage when total marks or obtained marks change
      if (name === 'TOTAL_MARKS' || name === 'OBTAINED_MARKS') {
        const totalMarks = parseFloat(name === 'TOTAL_MARKS' ? value : prev.TOTAL_MARKS);
        const obtainedMarks = parseFloat(name === 'OBTAINED_MARKS' ? value : prev.OBTAINED_MARKS);
        
        if (!isNaN(totalMarks) && !isNaN(obtainedMarks) && totalMarks > 0) {
          const percentage = ((obtainedMarks / totalMarks) * 100).toFixed(2);
          newData.PERCENTAGE = percentage;
        }
      }

      return newData;
    });
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!employeeId) {
        console.error('No employee ID found');
        return;
      }

      setSaveLoading(true);

      // Extract month and year from passing date
      const passingDate = formData.PASSING_DATE ? new Date(formData.PASSING_DATE) : null;
      
      // Format the data
      const qualificationData = {
        ...formData,
        ORDER_TYPE: formData.ORDER_TYPE.toString(),
        TOTAL_MARKS: parseFloat(formData.TOTAL_MARKS),
        OBTAINED_MARKS: parseFloat(formData.OBTAINED_MARKS),
        PERCENTAGE: parseFloat(formData.PERCENTAGE),
        // Set month and year from passing date
        PASSING_MONTH: passingDate ? passingDate.toLocaleString('default', { month: 'short' }).toUpperCase() : null,
        PASSING_YEAR: passingDate ? passingDate.getFullYear().toString() : null
      };

      console.log('Sending qualification data:', qualificationData);

      let response;
      if (existingQualification?.RECORD_ID) {
        // Update existing qualification
        response = await employeeService.updateQualification(
          employeeId,
          existingQualification.RECORD_ID,
          qualificationData
        );
        alert('Academic qualification updated successfully!');
      } else {
        // Create new qualification only if none exists
        response = await employeeService.createQualification(
          employeeId,
          qualificationData
        );
        alert('Academic qualification saved successfully!');
      }

    } catch (error: any) {
      console.error('Error saving qualification:', error);
      alert(error.response?.data?.error || error.response?.data?.details || 'Error saving qualification. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSaveAndNext = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!employeeId) {
        console.error('No employee ID found');
        return;
      }

      // Show loading state
      setLoading(true);

      const response = await employeeService.createQualification(employeeId, formData);
      
      if (response.status === 201) {
        alert('Academic qualification saved successfully!');
        // Navigate to next step
        navigate('/dashboard/establishment/employeedetails/experience?empId=' + employeeId);
      }
    } catch (error) {
      console.error('Error saving qualification:', error);
      alert('Error saving qualification. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      ORDER_TYPE: 1,
      EMPLOYEE_TYPE: '',
      JOINING_DATE_COLLEGE: '',
      JOINING_DATE_SANSTHA: '',
      DEGREE: '',
      UNIVERSITY_BOARD: '',
      COLLEGE_NAME: '',
      REGISTRATION_NUMBER: '',
      REGISTRATION_DATE: '',
      VALID_UPTO_DATE: '',
      COUNCIL_NAME: '',
      PASSING_DATE: '',
      SPECIALIZATION: '',
      PASSING_MONTH: '',
      PASSING_YEAR: '',
      TOTAL_MARKS: '',
      OBTAINED_MARKS: '',
      PERCENTAGE: '',
      DIVISION: ''
    });
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Paper elevation={3} sx={{ p: 2, m: 2 }}>
      <form onSubmit={handleSave}>
        <Stack spacing={2}>
          <Typography variant="h6" gutterBottom>
            Academic Qualification Details
          </Typography>

          {/* Employee Details Section */}
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <TextField
                fullWidth
                size="small"
                label="Employee ID"
                value={employeeDetails?.EMPLOYEE_ID || ''}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth
                size="small"
                label="Employee Name"
                value={employeeDetails?.EMP_NAME || ''}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth
                size="small"
                label="Designation"
                value={employeeDetails?.DESIGNATION_NAME || ''}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth
                size="small"
                label="Department"
                value={employeeDetails?.DEPARTMENT_NAME || ''}
                InputProps={{ readOnly: true }}
              />
            </Grid>
          </Grid>

          {/* Qualification Form Fields */}
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Order Type</InputLabel>
                <Select
                  name="ORDER_TYPE"
                  value={formData.ORDER_TYPE}
                  onChange={handleSelectChange}
                  label="Order Type"
                >
                  {ORDER_TYPE_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Employee Type</InputLabel>
                <Select
                  name="EMPLOYEE_TYPE"
                  value={formData.EMPLOYEE_TYPE}
                  onChange={handleSelectChange}
                  label="Employee Type"
                >
                  <MenuItem value="TEACHING">Teaching</MenuItem>
                  <MenuItem value="NON_TEACHING">Non Teaching</MenuItem>
                  <MenuItem value="VISITING">Visiting</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={4}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="Joining Date (College)"
                name="JOINING_DATE_COLLEGE"
                value={formData.JOINING_DATE_COLLEGE}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="Joining Date (Sanstha)"
                name="JOINING_DATE_SANSTHA"
                value={formData.JOINING_DATE_SANSTHA}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Degree</InputLabel>
                <Select
                  name="DEGREE"
                  value={formData.DEGREE}
                  onChange={handleSelectChange}
                  label="Degree"
                >
                  {DEGREE_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={4}>
              <TextField
                fullWidth
                size="small"
                label="Specialization"
                name="SPECIALIZATION"
                value={formData.SPECIALIZATION}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                fullWidth
                size="small"
                label="University/Board"
                name="UNIVERSITY_BOARD"
                value={formData.UNIVERSITY_BOARD}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                fullWidth
                size="small"
                label="College Name"
                name="COLLEGE_NAME"
                value={formData.COLLEGE_NAME}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                fullWidth
                size="small"
                label="Registration Number"
                name="REGISTRATION_NUMBER"
                value={formData.REGISTRATION_NUMBER}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="Registration Date"
                name="REGISTRATION_DATE"
                value={formData.REGISTRATION_DATE}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="Valid Upto"
                name="VALID_UPTO_DATE"
                value={formData.VALID_UPTO_DATE}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                fullWidth
                size="small"
                label="Council Name"
                name="COUNCIL_NAME"
                value={formData.COUNCIL_NAME}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="Passing Date"
                name="PASSING_DATE"
                value={formData.PASSING_DATE}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                fullWidth
                size="small"
                label="Total Marks"
                name="TOTAL_MARKS"
                type="number"
                value={formData.TOTAL_MARKS}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                fullWidth
                size="small"
                label="Obtained Marks"
                name="OBTAINED_MARKS"
                type="number"
                value={formData.OBTAINED_MARKS}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                fullWidth
                size="small"
                label="Percentage"
                name="PERCENTAGE"
                type="number"
                value={formData.PERCENTAGE}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Division</InputLabel>
                <Select
                  name="DIVISION"
                  value={formData.DIVISION}
                  onChange={handleSelectChange}
                  label="Division"
                >
                  {DIVISION_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
                disabled={saveLoading}
              >
                {saveLoading ? <CircularProgress size={24} /> : 'Save'}
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
//ACADEMICQUALIFICATION