import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { motion } from "framer-motion";
import axiosInstance from "../../../api/axios";
import { Paper, Button } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";

// TypeScript Interfaces
interface YearEntryFormInputs {
  YEAR_ID?: number;
  UNIVERSITY: number;
  INSTITUTE: number;
  PROGRAM: number;
  BRANCH: number;
  YEAR: string;
}

interface University {
  UNIVERSITY_ID: number;
  NAME: string;
}

interface Institute {
  INSTITUTE_ID: number;
  NAME: string;
}

interface Program {
  PROGRAM_ID: number;
  NAME: string;
}

interface Branch {
  BRANCH_ID: number;
  NAME: string;
}

const YearEntryForm = () => {
  const { register, handleSubmit, reset } = useForm<YearEntryFormInputs>();
  const [universities, setUniversities] = useState<University[]>([]);
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      const response = await axiosInstance.get("/api/master/universities/");
      setUniversities(response.data);
    } catch (error) {
      console.error("Error fetching universities:", error);
    }
  };

  const fetchInstitutes = async (universityId: number) => {
    setInstitutes([]);
    setPrograms([]);
    setBranches([]);
    try {
      const response = await axiosInstance.get(`/api/master/institutes/?university_id=${universityId}`);
      setInstitutes(response.data);
    } catch (error) {
      console.error("Error fetching institutes:", error);
    }
  };

  const fetchPrograms = async (instituteId: number) => {
    setPrograms([]);
    setBranches([]);
    try {
      const response = await axiosInstance.get(`/api/master/program/?institute_id=${instituteId}`);
      setPrograms(response.data);
    } catch (error) {
      console.error("Error fetching programs:", error);
    }
  };

  const fetchBranches = async (programId: number) => {
    setBranches([]);
    try {
      const response = await axiosInstance.get(`/api/master/branch/?program_id=${programId}`);
      setBranches(response.data);
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };

  const onSubmit: SubmitHandler<YearEntryFormInputs> = async (data) => {
    const payload = {
      UNIVERSITY: data.UNIVERSITY,
      INSTITUTE: data.INSTITUTE,
      PROGRAM: data.PROGRAM,
      BRANCH: data.BRANCH,
      YEAR: data.YEAR,
    };
    try {
      await axiosInstance.post("/api/master/year/", payload);
      alert("Year saved successfully!");
      reset();
    } catch (error) {
      console.error("Error saving year:", error);
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
                {universities.map((u) => (
                  <option key={u.UNIVERSITY_ID} value={u.UNIVERSITY_ID}>{u.NAME}</option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Institute</label>
              <select {...register("INSTITUTE", { required: true })} className="form-control" onChange={(e) => fetchPrograms(Number(e.target.value))}>
                <option value="">Select Institute</option>
                {institutes.map((i) => (
                  <option key={i.INSTITUTE_ID} value={i.INSTITUTE_ID}>{i.NAME}</option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Program</label>
              <select {...register("PROGRAM", { required: true })} className="form-control" onChange={(e) => fetchBranches(Number(e.target.value))}>
                <option value="">Select Program</option>
                {programs.map((p) => (
                  <option key={p.PROGRAM_ID} value={p.PROGRAM_ID}>{p.NAME}</option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Branch</label>
              <select {...register("BRANCH", { required: true })} className="form-control">
                <option value="">Select Branch</option>
                {branches.map((b) => (
                  <option key={b.BRANCH_ID} value={b.BRANCH_ID}>{b.NAME}</option>
                ))}
              </select>
            </div>

            {/* <div className="col-md-6">
              <label className="form-label">Year</label>
              <input type="number" {...register("YEAR", { required: true })} className="form-control" />
            </div>
          </div> */}

      <div className="col-md-6">
         <label className="form-label">Year</label>
            <input type="text" {...register("YEAR", { required: true })} className="form-control" 
            placeholder="Enter Year (e.g., First Year, Second Year, Third...)" />

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

export default YearEntryForm;