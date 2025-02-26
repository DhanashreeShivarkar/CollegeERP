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
  fetchShiftEntries,
  createShiftEntry,
  updateShiftEntry,
} from "../../../api/establishmentService";

interface ShiftData {
  ID: number;
  SHIFT_NAME: string;
  FROM_TIME: string;
  TO_TIME: string;
  LATE_COMING_TIME?: string;
  EARLY_GOING_TIME?: string;
  IS_DELETED: boolean;
  CREATED_BY?: string;
  CREATED_AT?: string;
  UPDATED_BY?: string;
  UPDATED_AT?: string;
}

interface ShiftEntryProps {
  tableName: string;
}

const ShiftEntry: React.FC<ShiftEntryProps> = ({ tableName }) => {
  const [shifts, setShifts] = useState<ShiftData[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newEntry, setNewEntry] = useState({
    SHIFT_NAME: "",
    FROM_TIME: "",
    TO_TIME: "",
    LATE_COMING_TIME: "",
    EARLY_GOING_TIME: "",
  });
  const [editingEntry, setEditingEntry] = useState<ShiftData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetchShiftEntries();
        setShifts(response.data);
      } catch (err) {
        console.error("Error fetching shifts:", err);
        setError("Failed to fetch shifts");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (shift: ShiftData) => {
    setEditingEntry(shift);
    setNewEntry({
      SHIFT_NAME: shift.SHIFT_NAME,
      FROM_TIME: shift.FROM_TIME,
      TO_TIME: shift.TO_TIME,
      LATE_COMING_TIME: shift.LATE_COMING_TIME || "",
      EARLY_GOING_TIME: shift.EARLY_GOING_TIME || "",
    });
    setOpen(true);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      if (editingEntry) {
        await updateShiftEntry(editingEntry.ID, newEntry);
      } else {
        await createShiftEntry(newEntry);
      }

      const response = await fetchShiftEntries();
      setShifts(response.data);
      setOpen(false);
      setNewEntry({
        SHIFT_NAME: "",
        FROM_TIME: "",
        TO_TIME: "",
        LATE_COMING_TIME: "",
        EARLY_GOING_TIME: "",
      });
      setEditingEntry(null);
    } catch (err: any) {
      console.error("Error saving shift:", err);
      setError(err.response?.data?.message || "Failed to save shift");
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setOpen(false);
    setNewEntry({
      SHIFT_NAME: "",
      FROM_TIME: "",
      TO_TIME: "",
      LATE_COMING_TIME: "",
      EARLY_GOING_TIME: "",
    });
    setEditingEntry(null);
  };

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Shift Master Entry</h3>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
        >
          Add New Shift
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
                <TableCell>Shift Name</TableCell>
                <TableCell>From Time</TableCell>
                <TableCell>To Time</TableCell>
                <TableCell>Late Coming Time</TableCell>
                <TableCell>Early Going Time</TableCell>
                <TableCell>Created By</TableCell>
                <TableCell>Updated At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {shifts.map((row) => (
                <TableRow key={row.ID}>
                  <TableCell>{row.ID}</TableCell>
                  <TableCell>{row.SHIFT_NAME}</TableCell>
                  <TableCell>{row.FROM_TIME}</TableCell>
                  <TableCell>{row.TO_TIME}</TableCell>
                  <TableCell>{row.LATE_COMING_TIME}</TableCell>
                  <TableCell>{row.EARLY_GOING_TIME}</TableCell>
                  <TableCell>{row.CREATED_BY}</TableCell>
                  <TableCell>{row.UPDATED_AT}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => handleEdit(row)}
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
          {editingEntry ? "Edit Shift" : "Add New Shift"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Shift Name"
            fullWidth
            value={newEntry.SHIFT_NAME}
            onChange={(e) =>
              setNewEntry({ ...newEntry, SHIFT_NAME: e.target.value })
            }
          />
          <TextField
            type="time"
            margin="dense"
            label="From Time"
            fullWidth
            value={newEntry.FROM_TIME}
            onChange={(e) =>
              setNewEntry({ ...newEntry, FROM_TIME: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            type="time"
            margin="dense"
            label="To Time"
            fullWidth
            value={newEntry.TO_TIME}
            onChange={(e) =>
              setNewEntry({ ...newEntry, TO_TIME: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            type="time"
            margin="dense"
            label="Late Coming Time"
            fullWidth
            value={newEntry.LATE_COMING_TIME}
            onChange={(e) =>
              setNewEntry({ ...newEntry, LATE_COMING_TIME: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            type="time"
            margin="dense"
            label="Early Going Time"
            fullWidth
            value={newEntry.EARLY_GOING_TIME}
            onChange={(e) =>
              setNewEntry({ ...newEntry, EARLY_GOING_TIME: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
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

export default ShiftEntry;
