import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import axiosInstance from "../../../api/axios";
import { Paper, Button } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";

interface CasteFormData {
  casteName: string;
}

const CasteEntryForm = () => {
  const { register, handleSubmit, reset } = useForm<CasteFormData>();

  const onSubmit = async (data: CasteFormData) => {
    console.log("Submitting data:", data); // Debugging

    try {
      const payload = { NAME: data.casteName }; // Ensure correct field name
      const response = await axiosInstance.post("api/master/caste/", payload);

      console.log("API Response:", response.data);
      window.alert("Caste added successfully!"); // Browser alert for success
      reset();
    } catch (error) {
      console.error("Error submitting data:", error);
      window.alert("Error submitting data! Please try again."); // Browser alert for error
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="form-label">Caste Name:</label>
            <input
              type="text"
              {...register("casteName", { required: "Caste Name is required" })}
              className="form-control"
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

export default CasteEntryForm;
