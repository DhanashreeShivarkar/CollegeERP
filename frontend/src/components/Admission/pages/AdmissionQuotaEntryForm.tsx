import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import axiosInstance from "../../../api/axios";
import { Paper, Button, Snackbar, Alert, TextField } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";

interface AdmissionQuotaFormData {
  quotaName: string;
}

const AdmissionQuotaForm = () => {
  const { register, handleSubmit, reset } = useForm<AdmissionQuotaFormData>();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const onSubmit = async (data: AdmissionQuotaFormData) => {
    try {
      const payload = { NAME: data.quotaName }; // Ensure correct API field
      await axiosInstance.post("api/master/admission/", payload);
      setSnackbarMessage("Admission quota added successfully!");
      setSnackbarSeverity("success");
      reset();
    } catch (error) {
      console.error("Error submitting data:", error);
      setSnackbarMessage("Error submitting data! Please try again.");
      setSnackbarSeverity("error");
    }
    setOpenSnackbar(true);
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
              variant="outlined"  style={{ width: "200px" }}

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

      {/* Snackbar for Notifications */}
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default AdmissionQuotaForm;
