import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axios";
import { Modal, Box, TextField, Button } from "@mui/material";

interface EditModalProps {
  open: boolean;
  onClose: () => void;
  masterType: string;
  id: number;
  initialData: { NAME: string };
  refreshData: () => void;
}

const EditModal: React.FC<EditModalProps> = ({ open, onClose, masterType, id, initialData, refreshData }) => {
  const [name, setName] = useState(initialData.NAME);

  // Ensure the name state updates when initialData changes
  useEffect(() => {
    if (initialData) {
      setName(initialData.NAME);
    }
  }, [initialData]);

  const handleSave = async () => {
    try {
      await axiosInstance.put(`api/master/${masterType}/${id}/`, { NAME: name });
      alert("Data updated successfully!"); // Window alert for success
      refreshData();
      onClose();
    } catch (error) {
      console.error("Error updating data:", error);
      alert("Error updating data!"); // Window alert for error
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "white",
          p: 3,
          borderRadius: 2,
          boxShadow: 24,
        }}
      >
        <h3>Edit {masterType.charAt(0).toUpperCase() + masterType.slice(1)}</h3>
        <TextField
          label="Name"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ my: 2 }}
        />
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
          <Button variant="outlined" color="secondary" onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditModal;

// commit