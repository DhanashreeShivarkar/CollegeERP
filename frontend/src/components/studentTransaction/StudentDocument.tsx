import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../../api/axios";
import {
  Paper,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Grid,
} from "@mui/material";

interface StudentDocumentFormInputs {
  studentId: string;
  instituteId: string;
  branch: string;
  category: string;
  yearSem: string;
  quota: string;
  name: string;
  documentSubmitted: boolean;
  documentNotSubmitted: boolean;
}

const StudentDocumentForm = () => {
  const { register, handleSubmit, reset, watch, setValue } = useForm<StudentDocumentFormInputs>();
  const [error, setError] = useState("");

  // Fetch student details when Student ID is entered
  const handleStudentChange = async (studentId: string) => {
    if (!studentId.trim()) return;

    setError("");

    try {
      const response = await axiosInstance.get(`/api/students/${studentId}/`);
      const data = response.data;

      setValue("name", data.name);
      setValue("instituteId", data.instituteId);
      setValue("branch", data.branch);
      setValue("category", data.category);
      setValue("yearSem", data.yearSem);
      setValue("quota", data.quota);
    } catch (error) {
      console.error("Error fetching student details:", error);
      setError("Student ID not found!");
      reset();
    }
  };

  // Submit Form Data
  const onSubmit = async (data: StudentDocumentFormInputs) => {
    try {
      const payload = {
        STUDENT_ID: data.studentId,
        INSTITUTE_ID: data.instituteId,
        BRANCH: data.branch,
        CATEGORY: data.category,
        YEAR_SEM: data.yearSem,
        QUOTA: data.quota,
        NAME: data.name,
        DOCUMENT_SUBMITTED: data.documentSubmitted,
        DOCUMENT_NOT_SUBMITTED: data.documentNotSubmitted,
      };

      console.log("Submitting Payload:", payload);

      await axiosInstance.post("/api/student/documents/", payload);
      alert("Student Document Details Submitted Successfully!");
      reset();
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Error submitting document details! Please try again.");
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 2, maxWidth: "800px", margin: "auto", mt: 5 }}>
      <h3 style={{ textAlign: "center", marginBottom: "15px" }}>Student Document Form</h3>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          {/* Student ID */}
          <Grid item xs={12}>
            <TextField
              label="Student ID"
              {...register("studentId", { required: true })}
              fullWidth
              size="medium"
              onBlur={(e) => handleStudentChange(e.target.value)}
            />
            {error && <p style={{ color: "red", fontSize: "12px" }}>{error}</p>}
          </Grid>

          {/* Auto-filled Fields */}
          <Grid item xs={12} sm={6}>
            <TextField label="Name" {...register("name")} fullWidth size="medium" disabled />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Institute ID" {...register("instituteId")} fullWidth size="medium" disabled />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Branch" {...register("branch")} fullWidth size="medium" disabled />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Category" {...register("category")} fullWidth size="medium" disabled />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Year/Sem" {...register("yearSem")} fullWidth size="medium" disabled />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Quota" {...register("quota")} fullWidth size="medium" disabled />
          </Grid>

          {/* Document Submission Status */}
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <FormControlLabel
              control={<Checkbox {...register("documentSubmitted")} />}
              label="Document Submitted"
            />
            <FormControlLabel
              control={<Checkbox {...register("documentNotSubmitted")} />}
              label="Document Not Submitted"
              sx={{ marginLeft: "15px" }}
            />
          </Grid>

          {/* Buttons */}
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", gap: "15px" }}>
            <Button type="submit" variant="contained" color="primary" size="medium">
              Save
            </Button>
            <Button
              variant="contained"
              color="error"
              size="medium"
              onClick={() => reset()}
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default StudentDocumentForm;
