import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { motion } from "framer-motion";
import axiosInstance from "../../../api/axios";
import { Paper, Button } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";

interface SemesterEntryFormInputs {
  SEMESTER_ID?: number;
  UNIVERSITY: number;
  INSTITUTE: number;
  PROGRAM: number;
  BRANCH: number;
  YEAR: number;
  SEMESTER: string; // Changed to string
  IS_ACTIVE: boolean;
  CREATED_BY: number;
  UPDATED_BY: number;
}

const SemesterEntryForm = () => {
  const { register, handleSubmit, reset } = useForm<SemesterEntryFormInputs>();
  const [universities, setUniversities] = useState<any[]>([]);
  const [institutes, setInstitutes] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [years, setYears] = useState<any[]>([]);

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      const response = await axiosInstance.get("/api/master/universities/");
      if (response.status === 200) setUniversities(response.data);
    } catch (error) {
      console.error("Error fetching universities:", error);
    }
  };

  const fetchInstitutes = async (universityId: number) => {
    setInstitutes([]);
    setPrograms([]);
    setBranches([]);
    setYears([]);
    try {
      const response = await axiosInstance.get(`/api/master/institutes/?university_id=${universityId}`);
      if (response.status === 200) setInstitutes(response.data);
    } catch (error) {
      console.error("Error fetching institutes:", error);
    }
  };

  const fetchPrograms = async (instituteId: number) => {
    setPrograms([]);
    setBranches([]);
    setYears([]);
    try {
      const response = await axiosInstance.get(`/api/master/program/?institute_id=${instituteId}`);
      if (response.status === 200) setPrograms(response.data);
    } catch (error) {
      console.error("Error fetching programs:", error);
    }
  };

  const fetchBranches = async (programId: number) => {
    setBranches([]);
    setYears([]);
    try {
      const response = await axiosInstance.get(`/api/master/branch/?program_id=${programId}`);
      if (response.status === 200) setBranches(response.data);
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };

  const fetchYears = async (branchId: number) => {
    console.log("Fetching years for branch:", branchId); // Debug log
    setYears([]); 
  
    try {
      const response = await axiosInstance.get(`/api/master/year/?branch=${branchId}`);
      console.log("API Response:", response.data); // Debug log
  
      if (response.status === 200) setYears(response.data);
    } catch (error) {
      console.error("Error fetching years:", error);
    }
  };
  

  const onSubmit: SubmitHandler<SemesterEntryFormInputs> = async (data) => {
    try {
      await axiosInstance.post("/api/master/semester/", { ...data, CREATED_BY: 1, UPDATED_BY: 1 });
      alert("Semester saved successfully!");
      reset();
    } catch (error) {
      console.error("Error saving semester:", error);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">University</label>
              <select {...register("UNIVERSITY", { required: true })} className="form-control" onChange={(e) => fetchInstitutes(Number(e.target.value))}>
                <option value="">Select University</option>
                {universities.map(u => <option key={u.UNIVERSITY_ID} value={u.UNIVERSITY_ID}>{u.NAME}</option>)}
              </select>
            </div>
            
            <div className="col-md-6">
              <label className="form-label">Institute</label>
              <select {...register("INSTITUTE", { required: true })} className="form-control" onChange={(e) => fetchPrograms(Number(e.target.value))}>
                <option value="">Select Institute</option>
                {institutes.map(i => <option key={i.INSTITUTE_ID} value={i.INSTITUTE_ID}>{i.NAME}</option>)}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Program</label>
              <select {...register("PROGRAM", { required: true })} className="form-control" onChange={(e) => fetchBranches(Number(e.target.value))}>
                <option value="">Select Program</option>
                {programs.map(p => <option key={p.PROGRAM_ID} value={p.PROGRAM_ID}>{p.NAME}</option>)}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Branch</label>
              <select {...register("BRANCH", { required: true })} className="form-control" onChange={(e) => fetchYears(Number(e.target.value))}>
                <option value="">Select Branch</option>
                {branches.map(b => <option key={b.BRANCH_ID} value={b.BRANCH_ID}>{b.NAME}</option>)}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Year</label>
              <select {...register("YEAR", { required: true, valueAsNumber: true })} className="form-control">
                <option value="">Select Year</option>
                {years.map(y => <option key={y.YEAR_ID} value={y.YEAR_ID}>{y.YEAR}</option>)}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Semester</label>
              <input
                type="text"
                {...register("SEMESTER", { required: true })}
                className="form-control"
                placeholder="Enter Semester (e.g., 1, 2, 3, ...)"
              />
            </div>
          </div>

          <div className="mt-3">
            <Button type="submit" variant="contained" color="primary">Submit</Button>
          </div>
        </form>
      </motion.div>
    </Paper>
  );
};

export default SemesterEntryForm;

