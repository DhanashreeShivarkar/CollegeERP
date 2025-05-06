import React, { useEffect, useState } from "react";
import { Form } from 'react-bootstrap';
import axios from "axios";
import axiosInstance from '../../api/axios';
import { getStudents, getStudentById, updateStudent, } from "../../api/studentService";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Grid, 
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const StudentInfoAll: React.FC = () => {
  const [studentIds, setStudentIds] = useState<string[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [studentData, setStudentData] = useState<any>({
    academicYear: "",
  university: "",
  institute: "",
  program: "",
  branch: "",
  year: "",
  admissionCategory: "",
  admissionQuota: "",
  batch: "",
  formNo: "",
  name: "",
  fatherName: "",
  surname: "",
  gender: "",
  dob: "",
  phone: "",
  email: "",
  address: ""
  });

  const navigate = useNavigate();

  // Fetch student IDs on component mount
  useEffect(() => {
    const fetchStudentIds = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axiosInstance.get('/api/student/student-ids/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          setStudentIds(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching student IDs:', error);
      }
    };
  
    fetchStudentIds();
  }, []);
  
  

  // Fetch data of selected student
  const handleStudentSelect = async (event: any) => {
    const selectedId = event.target.value;
    setSelectedStudentId(selectedId);
  
    try {
      setLoading(true);
      const data = await getStudentById(selectedId);
  
      // Map API fields to frontend form state fields
      const mappedData = {
        academicYear: data.ACADEMIC_YEAR,
      institute: data.INSTITUTE,
      batch: data.BATCH,
      admissionCategory: data.ADMISSION_CATEGORY,
      admissionQuota: data.ADMN_QUOTA_ID,
      formNo: data.FORM_NO,
      name: data.NAME,
      surname: data.SURNAME,
      fatherName: data.FATHER_NAME,
      gender: data.GENDER,
      dob: data.DOB,
      phone: data.MOB_NO,
      email: data.EMAIL_ID,
      address: data.PER_ADDRESS,
      branch: data.BRANCH_ID,       // if nested, adjust: data.BRANCH_ID.BRANCH_ID
      year: data.YEAR_SEM_ID
      };
  
      setStudentData(mappedData);
      setLoading(false);
  
    } catch (error) {
      console.error("Error fetching student data:", error);
      setLoading(false);
    }
  };
  

  // Update student info fields
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setStudentData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save & Next button
  const handleSaveAndNext = async () => {
    try {
      await updateStudent(selectedStudentId, studentData);
      navigate("/student-info");
    } catch (error) {
      console.error("Error updating student data:", error);
    }
  };

  // Next button without save
  const handleNext = () => {
    navigate("/student-info");
  };

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: "auto" }}>
    <Typography variant="h5" gutterBottom>
      Basic Student Info
    </Typography>

    <Grid container spacing={2}>

      {/* Student ID Dropdown */}
      <Grid item xs={3}>
        <FormControl fullWidth>
          <InputLabel>Select Student ID</InputLabel>
          <Select
            value={selectedStudentId}
            onChange={handleStudentSelect}
            label="Select Student ID"
          >
            <MenuItem value="">
              <em>Select Student ID</em>
            </MenuItem>
            {studentIds.map((id) => (
              <MenuItem key={id} value={id}>
                {id}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      {/* Now fields in rows of 4 */}
      <Grid item xs={3}>
        <TextField label="Academic Year *" name="academicYear" value={studentData.academicYear || ""} onChange={handleInputChange} fullWidth />
      </Grid>

      <Grid item xs={3}>
        <TextField label="University *" name="university" value={studentData.university || ""} onChange={handleInputChange} fullWidth />
      </Grid>

      <Grid item xs={3}>
        <TextField label="Institute *" name="institute" value={studentData.institute || ""} onChange={handleInputChange} fullWidth />
      </Grid>

      <Grid item xs={3}>
        <TextField label="Program *" name="program" value={studentData.program || ""} onChange={handleInputChange} fullWidth />
      </Grid>

      <Grid item xs={3}>
        <TextField label="Branch *" name="branch" value={studentData.branch || ""} onChange={handleInputChange} fullWidth />
      </Grid>

      <Grid item xs={3}>
        <TextField label="Year" name="year" value={studentData.year || ""} onChange={handleInputChange} fullWidth />
      </Grid>

      <Grid item xs={3}>
        <TextField label="Admission Category *" name="admissionCategory" value={studentData.admissionCategory || ""} onChange={handleInputChange} fullWidth />
      </Grid>

      <Grid item xs={3}>
        <TextField label="Admission Quota" name="admissionQuota" value={studentData.admissionQuota || ""} onChange={handleInputChange} fullWidth />
      </Grid>

      <Grid item xs={3}>
        <TextField label="Batch *" name="batch" value={studentData.batch || ""} onChange={handleInputChange} fullWidth />
      </Grid>

      <Grid item xs={3}>
        <TextField label="Form No *" name="formNo" value={studentData.formNo || ""} onChange={handleInputChange} fullWidth />
      </Grid>

      <Grid item xs={3}>
        <TextField label="Name *" name="name" value={studentData.name} onChange={handleInputChange} fullWidth />
      </Grid>

      <Grid item xs={3}>
        <TextField label="Father's Name *" name="fatherName" value={studentData.fatherName || ""} onChange={handleInputChange} fullWidth />
      </Grid>

      <Grid item xs={3}>
        <TextField label="Surname *" name="surname" value={studentData.surname || ""} onChange={handleInputChange} fullWidth />
      </Grid>

      <Grid item xs={3}>
        <FormControl fullWidth>
          <InputLabel>Gender *</InputLabel>
          <Select
            value={studentData.gender || ""}
            onChange={(e) => setStudentData({ ...studentData, gender: e.target.value })}
            label="Gender *"
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={3}>
        <TextField label="Date of Birth *" name="dob" type="date" InputLabelProps={{ shrink: true }} value={studentData.dob || ""} onChange={handleInputChange} fullWidth />
      </Grid>

      <Grid item xs={3}>
        <TextField label="Mobile No *" name="phone" value={studentData.phone} onChange={handleInputChange} fullWidth />
      </Grid>

      <Grid item xs={3}>
        <TextField label="Email ID *" name="email" value={studentData.email} onChange={handleInputChange} fullWidth />
      </Grid>

      <Grid item xs={12}>
        <TextField label="Permanent Address *" name="address" value={studentData.address} onChange={handleInputChange} multiline rows={3} fullWidth />
      </Grid>

    </Grid>

    {/* Save & Next | Next */}
    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
      <Button variant="contained" color="primary" onClick={handleSaveAndNext}>
        Save & Next
      </Button>
      <Button variant="outlined" onClick={handleNext}>
        Next
      </Button>
    </Box>
  </Box>

  );
};

export default StudentInfoAll;
