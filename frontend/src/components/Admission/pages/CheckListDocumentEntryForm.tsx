import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import axiosInstance from "../../../api/axios";
import {
  Paper,
  Button,
  Snackbar,
  Alert,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";

interface ChecklistFormInputs {
  name: string;
  isMandatory: boolean; // ✅ Updated to match backend field name
}

const ChecklistDocument = () => {
  const { register, handleSubmit, reset, watch, setValue } = useForm<ChecklistFormInputs>();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  // ✅ Submit Form Data
  const onSubmit = async (data: ChecklistFormInputs) => {
    try {
      const payload = { 
        NAME: data.name, 
        IS_MANDATORY: data.isMandatory ? true : false // ✅ Ensuring Boolean Value
      };

      console.log("Submitting Payload:", payload); // Debugging log

      await axiosInstance.post("/api/master/checklist/", payload);

      setSnackbarMessage("Checklist document added successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      reset(); // ✅ Clear form after successful submission
    } catch (error) {
      console.error("Error submitting data:", error);
      setSnackbarMessage("Error submitting data! Please try again.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2>Checklist Documents</h2>

        {/* ✅ Snackbar for Notifications */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
        >
          <Alert severity={snackbarSeverity}>{snackbarMessage}</Alert>
        </Snackbar>

        {/* ✅ Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* ✅ Document Name Input */}
          <div className="mb-3">
            <TextField
              label="Checklist Document Name"
              {...register("name", { required: true })}
              fullWidth
              variant="outlined"
              style={{ width: "200px" }}
            />
          </div>

          {/* ✅ Mandatory Checkbox (Now Works Properly) */}
          <div className="mb-3">
            <FormControlLabel
              control={
                <Checkbox
                  checked={watch("isMandatory") || false} // ✅ Always a Boolean Value
                  onChange={(e) => setValue("isMandatory", e.target.checked)} // ✅ Ensuring it updates properly
                />
              }
              label="Mandatory"
            />
          </div>

          {/* ✅ Submit & Clear Buttons */}
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

export default ChecklistDocument;
