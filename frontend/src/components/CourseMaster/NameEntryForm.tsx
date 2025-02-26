import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { motion } from "framer-motion";
import axiosInstance from "../../api/axios";
import { Paper } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";

interface ProgramEntryFormInputs {
  UNIVERSITY: number;
  INSTITUTE: number;
  INSTITUTE_CODE : string;
  NAME: string;
  CODE: string;
  DURATION_YEARS: number;
  LEVEL: string;
  TYPE: string;
  DESCRIPTION: string;
  IS_ACTIVE: boolean;
  CREATED_BY: number;
  UPDATED_BY: number;
}

interface University {
  UNIVERSITY_ID: number;
  NAME: string;
  CODE: string;
}

interface Institute {
  INSTITUTE_ID: number;
  CODE:string;
  NAME: string;
}

const NameEntryForm = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<ProgramEntryFormInputs>();
  const [universities, setUniversities] = useState<University[]>([]);
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [selectedForm, setSelectedForm] = useState<string>("");

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const response = await axiosInstance.get("/api/master/universities/", { headers: { Authorization: `Bearer ${token}` } });
        if (response.status === 200) setUniversities(response.data);
      } catch (error) {
        console.error("Error fetching universities:", error);
      }
    };
    fetchUniversities();
  }, []);

  const fetchInstitutes = async (universityId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await axiosInstance.get(`/api/master/institutes/?university_id=${universityId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status === 200) setInstitutes(response.data);
    } catch (error) {
      console.error("Error fetching institutes:", error);
    }
  };

  const onSubmit: SubmitHandler<ProgramEntryFormInputs> = async (data) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await axiosInstance.post("/api/master/course/", data, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
      });
      if (response.status === 201) alert("Program entry saved successfully!");
    } catch (error: any) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-center mb-4">Master Entry Form</h2>
        
        <select onChange={(e) => setSelectedForm(e.target.value)} className="form-control mb-3">
          <option value="">Select Entry Type</option>
          <option value="program">Program</option>
          <option value="branch">Branch</option>
          <option value="year">Year</option>
          <option value="semester">Semester</option>
          <option value="course">Course</option>
        </select>

        {selectedForm === "program" && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">University</label>
                <select {...register("UNIVERSITY", { required: true, valueAsNumber: true })} className="form-control" onChange={(e) => fetchInstitutes(Number(e.target.value))}>
                  <option value="">Select University</option>
                  {universities.map((university) => (
                    <option key={university.UNIVERSITY_ID} value={university.UNIVERSITY_ID}>{university.NAME} ({university.CODE})</option>
                  ))}
                </select>
                {errors.UNIVERSITY && <p className="text-danger">Please select a university</p>}
              </div>

              <div className="col-md-6">
                <label className="form-label">Institute</label>
                <select {...register("INSTITUTE", { required: true, valueAsNumber: true })} className="form-control">
                  <option value="">Select Institute</option>
                  {institutes.map((institute) => (
                    <option key={institute.INSTITUTE_ID} value={institute.INSTITUTE_ID}>{institute.CODE}</option>
                  ))}
                </select>
                {errors.INSTITUTE && <p className="text-danger">Please select an institute</p>}
              </div>

              <div className="col-md-6">
                <label className="form-label">Program Name</label>
                <input type="text" {...register("NAME", { required: true })} className="form-control" placeholder="Enter Program Name" />
                {errors.NAME && <p className="text-danger">This field is required</p>}
              </div>

              <div className="col-md-6">
                <label className="form-label">Code</label>
                <input type="text" {...register("CODE", { required: true })} className="form-control" placeholder="Enter Code" />
                {errors.CODE && <p className="text-danger">This field is required</p>}
              </div>

              <div className="col-md-6">
                <label className="form-label">Duration (Years)</label>
                <input type="number" {...register("DURATION_YEARS", { required: true, min: 1 })} className="form-control" placeholder="Enter Duration" />
                {errors.DURATION_YEARS && <p className="text-danger">Please enter a valid duration</p>}
              </div>

              <div className="col-md-6">
                <label className="form-label">Level</label>
                <select {...register("LEVEL", { required: true })} className="form-control">
                  <option value="">Select Level</option>
                  <option value="UG">Undergraduate</option>
                  <option value="PG">Postgraduate</option>
                  <option value="DIP">Diploma</option>
                </select>
                {errors.LEVEL && <p className="text-danger">Please select a level</p>}
              </div>

              <div className="col-md-6">
                <label className="form-label">Type</label>
                <select {...register("TYPE", { required: true })} className="form-control">
                  <option value="">Select Type</option>
                  <option value="FT">Full Time</option>
                  <option value="PT">Part Time</option>
                </select>
                {errors.TYPE && <p className="text-danger">Please select a type</p>}
              </div>

              <div className="col-md-6">
                <label className="form-label">Is Active</label>
                <input type="checkbox" {...register("IS_ACTIVE")} className="form-check-input" />
              </div>

             
             
            </div>

            <div className="col-12 text-center mt-4">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" className="btn btn-primary">
                Submit
              </motion.button>
            </div>
          </form>
        )}
      </motion.div>
    </Paper>
  );
};

export default NameEntryForm;
