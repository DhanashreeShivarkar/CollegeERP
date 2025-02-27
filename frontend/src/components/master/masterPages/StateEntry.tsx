import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import axiosInstance from "../../../api/axios";
import { useNavigate } from "react-router-dom";
import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteConfirmDialog from "../../common/DeleteConfirmDialog";

interface CountryData {
  COUNTRY_ID: number;
  NAME: string;
}

interface StateFormData {
  STATE_ID?: number;
  COUNTRY: number; // Changed from COUNTRY_ID to COUNTRY
  NAME: string;
  CODE: string;
  IS_ACTIVE: boolean;
  CREATED_BY?: string;
  UPDATED_BY?: string;
}

const StateEntry: React.FC = () => {
  const navigate = useNavigate();
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [formData, setFormData] = useState<StateFormData>({
    COUNTRY: 0, // Changed from COUNTRY_ID to COUNTRY
    NAME: "",
    CODE: "",
    IS_ACTIVE: true,
  });

  const [states, setStates] = useState<StateFormData[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchCountries();
    fetchData();
  }, [navigate]);

  const fetchCountries = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get("/api/master/countries/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCountries(response.data);
    } catch (err) {
      console.error("Error fetching countries:", err);
      setError("Failed to fetch countries");
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/master/states/");
      setStates(response.data);
    } catch (err) {
      console.error("Error fetching states:", err);
      setError("Failed to fetch states");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : name === "COUNTRY"
          ? parseInt(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      if (!token || !user?.user_id) {
        setError("Authentication required");
        navigate("/login");
        return;
      }

      const response = await axiosInstance.post(
        "/api/master/states/",
        {
          ...formData,
          CODE: formData.CODE.toUpperCase(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setFormData({
          COUNTRY: 0, // Changed from COUNTRY_ID to COUNTRY
          NAME: "",
          CODE: "",
          IS_ACTIVE: true,
        });
        alert("State created successfully!");
      }
    } catch (err: any) {
      console.error("Error:", err);
      setError(err.response?.data?.message || "Failed to create state");
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (item: any) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;

    try {
      setLoading(true);
      await axiosInstance.delete(
        `/api/master/states/${selectedItem.STATE_ID}/`
      );

      // Update local state instead of fetching again
      setStates((prevStates) =>
        prevStates.filter((state) => state.STATE_ID !== selectedItem.STATE_ID)
      );

      setDeleteDialogOpen(false);
      setSelectedItem(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        backgroundColor: (theme) =>
          theme.palette.mode === "dark" ? "#1a1a1a" : "#ffffff",
        color: (theme) => theme.palette.text.primary,
        "& .container": {
          backgroundColor: "transparent !important",
        },
        borderRadius: 2,
        boxShadow: (theme) =>
          theme.palette.mode === "dark"
            ? "0 4px 6px rgba(0, 0, 0, 0.3)"
            : "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="p-4">
        <h4 className="mb-4">Create New State</h4>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Country</Form.Label>
                <Form.Select
                  name="COUNTRY" // Changed from COUNTRY_ID to COUNTRY
                  value={formData.COUNTRY} // Changed from COUNTRY_ID to COUNTRY
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country.COUNTRY_ID} value={country.COUNTRY_ID}>
                      {country.NAME}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>State Name</Form.Label>
                <Form.Control
                  type="text"
                  name="NAME"
                  value={formData.NAME}
                  onChange={handleChange}
                  required
                  maxLength={100}
                  placeholder="Enter state name"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>State Code</Form.Label>
                <Form.Control
                  type="text"
                  name="CODE"
                  value={formData.CODE}
                  onChange={handleChange}
                  required
                  maxLength={2}
                  placeholder="Enter state code (e.g., MH)"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mt-4">
                <Form.Check
                  type="checkbox"
                  name="IS_ACTIVE"
                  checked={formData.IS_ACTIVE}
                  onChange={handleChange}
                  label="Is Active"
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="mt-4">
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Creating..." : "Create State"}
            </Button>
          </div>
        </Form>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {states.map((state) => (
                <TableRow key={state.STATE_ID}>
                  <TableCell>{state.NAME}</TableCell>
                  <TableCell>{state.CODE}</TableCell>
                  <TableCell>
                    {state.IS_ACTIVE ? "Active" : "Inactive"}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(state)}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <DeleteConfirmDialog
          open={deleteDialogOpen}
          title={selectedItem?.NAME || ""}
          onClose={() => {
            setDeleteDialogOpen(false);
            setSelectedItem(null);
          }}
          onConfirm={handleDeleteConfirm}
        />
      </div>
    </Paper>
  );
};

export default StateEntry;
