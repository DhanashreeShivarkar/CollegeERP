import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import axiosInstance from "../../../api/axios";
import { Paper, Button, TextField } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";

interface AdmissionQuotaFormData {
  quotaName: string;
}

const AdmissionQuotaForm = () => {
  const { register, handleSubmit, reset } = useForm<AdmissionQuotaFormData>();

  const onSubmit = async (data: AdmissionQuotaFormData) => {
    try {
      const payload = { NAME: data.quotaName };
      await axiosInstance.post("api/master/admission/", payload);
      alert("✅ Admission quota added successfully!");
      reset();
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("❌ Error submitting data! Please try again.");
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <TextField
              label="Admission Quota Name"
              {...register("quotaName", { required: true })}
              fullWidth
              variant="outlined"
              style={{ width: "200px" }}
            />
          </div>
          <div className="d-flex gap-2">
            <Button type="submit" variant="contained" color="primary">Save</Button>
            <Button 
              variant="contained" 
              color="error" 
              onClick={() => reset()} 
              sx={{ textTransform: "none", borderRadius: 2, fontWeight: "bold" }}
            >
              Clear
            </Button>
          </div>
        </form>
      </motion.div>
    </Paper>
  );
};

export default AdmissionQuotaForm;
