import React, { useState, useEffect } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
} from "@mui/material";
import axios from "../../../utils/axios";
import {
  fetchTypeEntries,
  createTypeEntry,
  updateTypeEntry,
} from "../../../api/establishmentService";

interface TypeEntryProps {
  tableName: string;
}

interface TypeData {
  ID: number;
  RECORD_WORD: string;
  IS_DELETED: boolean;
  CREATED_BY?: string;
  CREATED_BY_NAME?: string;
  CREATED_AT?: string;
  UPDATED_BY?: string;
  UPDATED_BY_NAME?: string;
  UPDATED_AT?: string;
}

const TypeEntry: React.FC<TypeEntryProps> = ({ tableName }) => {
  const [types, setTypes] = useState<TypeData[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingEntry, setEditingEntry] = useState<TypeData | null>(null);
  const [newEntry, setNewEntry] = useState({
    RECORD_WORD: "",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetchTypeEntries();
      console.log("Fetched types data:", response.data); // Debug log
      setTypes(response.data);
    } catch (err) {
      console.error("Error fetching types:", err);
      setError("Failed to fetch types");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = async (type: TypeData) => {
    try {
      setEditingEntry(type);
      setNewEntry({ RECORD_WORD: type.RECORD_WORD });
      setOpen(true);
      console.log("Editing entry:", type); // Debug log
    } catch (err) {
      console.error("Error in handleEdit:", err);
      setError("Failed to load entry for editing");
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");
      console.log(
        "Submitting entry:",
        editingEntry ? "update" : "create",
        newEntry
      ); // Debug log

      if (editingEntry) {
        // Debug the update call
        console.log("Updating entry ID:", editingEntry.ID);
        const response = await updateTypeEntry(editingEntry.ID, newEntry);
        console.log("Update response:", response); // Debug log
      } else {
        await createTypeEntry(newEntry);
      }

      await fetchData();
      setOpen(false);
      setNewEntry({ RECORD_WORD: "" });
      setEditingEntry(null);
    } catch (err: any) {
      console.error("Error saving type:", err);
      console.error("Error details:", err.response?.data); // Debug log
      setError(err.response?.data?.message || "Failed to save type");
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setOpen(false);
    setNewEntry({ RECORD_WORD: "" });
    setEditingEntry(null); // Reset editing entry
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between mb-4">
        <h3>Type Master Entry</h3>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Add New Type
        </Button>
      </div>

      {error && (
        <Alert severity="error" className="mb-3">
          {error}
        </Alert>
      )}

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Record Word</TableCell>
                <TableCell>Created By</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Updated By</TableCell>
                <TableCell>Updated At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {types.map((type) => (
                <TableRow key={type.ID}>
                  <TableCell>{type.ID}</TableCell>
                  <TableCell>{type.RECORD_WORD}</TableCell>
                  <TableCell>{type.CREATED_BY_NAME}</TableCell>
                  <TableCell>
                    {type.CREATED_AT
                      ? new Date(type.CREATED_AT).toLocaleString()
                      : ""}
                  </TableCell>
                  <TableCell>{type.UPDATED_BY_NAME}</TableCell>
                  <TableCell>
                    {type.UPDATED_AT
                      ? new Date(type.UPDATED_AT).toLocaleString()
                      : ""}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => handleEdit(type)}
                    >
                      Edit
                    </Button>
                    <Button size="small" color="error">
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={open} onClose={handleDialogClose}>
        <DialogTitle>{editingEntry ? "Edit Type" : "Add New Type"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Record Word"
            fullWidth
            required
            value={newEntry.RECORD_WORD}
            onChange={(e) =>
              setNewEntry({ ...newEntry, RECORD_WORD: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingEntry ? "Update" : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TypeEntry;
