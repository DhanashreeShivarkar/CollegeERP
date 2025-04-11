import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import axiosInstance from "../../../api/axios";
import { Paper, Button } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";

// Define the form data interface
interface QuotaFormData {
  quotaName: string;
}

const QuotaEntryForm = () => {
  // React Hook Form setup
  const { register, handleSubmit, reset } = useForm<QuotaFormData>();

  // Form submission handler
  const onSubmit = async (data: QuotaFormData) => {
    try {
      const payload = { NAME: data.quotaName }; // Ensure correct field name
      console.log("Submitting Data:", payload);

      const response = await axiosInstance.post("api/master/quota/", payload);

      console.log("API Response:", response.data);
      alert("Quota added successfully!"); // Window alert for success
      reset(); // Clear form after successful submission

    } catch (error: any) {
      console.error("Error submitting quota:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Error saving quota!"); // Window alert for error
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="form-label">Quota Name:</label>
            <input
              type="text"
              {...register("quotaName", { required: "Quota Name is required" })}
              className="form-control"
              style={{ width: "200px" }}
            />
          </div>
          <div className="d-flex gap-2">
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
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

export default QuotaEntryForm;

// commit