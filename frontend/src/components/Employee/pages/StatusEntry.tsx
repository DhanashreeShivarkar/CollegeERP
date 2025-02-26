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
import {
  fetchStatusEntries,
  createStatusEntry,
  updateStatusEntry,
} from "../../../api/establishmentService";

interface StatusData {
  ID: number;
  RECORD_WORD: string;
  IS_DELETED: boolean;
  CREATED_BY?: string;
  CREATED_AT?: string;
  UPDATED_BY?: string;
  UPDATED_AT?: string;
}

interface StatusEntryProps {
  tableName: string;
}

const StatusEntry: React.FC<StatusEntryProps> = ({ tableName }) => {
  const [statuses, setStatuses] = useState<StatusData[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingEntry, setEditingEntry] = useState<StatusData | null>(null);
  const [newEntry, setNewEntry] = useState({
    RECORD_WORD: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetchStatusEntries();
        setStatuses(response.data);
      } catch (err) {
        console.error("Error fetching statuses:", err);
        setError("Failed to fetch statuses");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (status: StatusData) => {
    setEditingEntry(status);
    setNewEntry({ RECORD_WORD: status.RECORD_WORD });
    setOpen(true);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      if (editingEntry) {
        await updateStatusEntry(editingEntry.ID, newEntry);
      } else {
        await createStatusEntry(newEntry);
      }

      const response = await fetchStatusEntries();
      setStatuses(response.data);
      setOpen(false);
      setNewEntry({ RECORD_WORD: "" });
      setEditingEntry(null);
    } catch (err: any) {
      console.error("Error saving status:", err);
      setError(err.response?.data?.message || "Failed to save status");
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setOpen(false);
    setNewEntry({ RECORD_WORD: "" });
    setEditingEntry(null);
  };

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Status Master Entry</h2>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
        >
          Add New Status
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
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {statuses.map((status) => (
                <TableRow key={status.ID}>
                  <TableCell>{status.ID}</TableCell>
                  <TableCell>{status.RECORD_WORD}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => handleEdit(status)}
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
        <DialogTitle>
          {editingEntry ? "Edit Status" : "Add New Status"}
        </DialogTitle>
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

export default StatusEntry;
