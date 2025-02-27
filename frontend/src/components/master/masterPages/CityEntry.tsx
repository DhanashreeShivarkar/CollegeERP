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

interface StateData {
  STATE_ID: number;
  NAME: string;
}

interface CityFormData {
  CITY_ID?: number;
  STATE: number;
  NAME: string;
  CODE: string;
  IS_ACTIVE: boolean;
  CREATED_BY?: string;
  UPDATED_BY?: string;
}

const CityEntry: React.FC = () => {
  const navigate = useNavigate();
  const [states, setStates] = useState<StateData[]>([]);
  const [formData, setFormData] = useState<CityFormData>({
    STATE: 0,
    NAME: "",
    CODE: "",
    IS_ACTIVE: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cities, setCities] = useState<CityFormData[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    // Call fetchStates only if we have a token
    fetchStates(token);
    fetchData();
  }, [navigate]);

  const fetchStates = async (token: string) => {
    try {
      const response = await axiosInstance.get("/api/master/states/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setStates(response.data);
    } catch (err: any) {
      console.error("Error fetching states:", err);
      if (err.response?.status === 401) {
        // If token is invalid/expired, redirect to login
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError("Failed to fetch states");
      }
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/master/cities/");
      setCities(response.data);
    } catch (err) {
      console.error("Error fetching cities:", err);
      setError("Failed to fetch cities");
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
          : name === "STATE"
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
      if (!token) {
        navigate("/login");
        return;
      }

      const user = JSON.parse(localStorage.getItem("user") || "{}");

      await axiosInstance.post(
        "/api/master/cities/",
        {
          ...formData,
          CODE: formData.CODE.toUpperCase(),
          CREATED_BY: user.username,
          UPDATED_BY: user.username,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setFormData({
        STATE: 0,
        NAME: "",
        CODE: "",
        IS_ACTIVE: true,
      });
      alert("City created successfully!");
    } catch (err: any) {
      console.error("Error:", err);
      setError(err.response?.data?.message || "Failed to create city");
      if (err.response?.status === 401) {
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
        `/api/settings/cities/${selectedItem.CITY_ID}/`
      ); // Changed from master to settings

      // Update local state instead of fetching again
      setCities((prevCities) =>
        prevCities.filter((city) => city.CITY_ID !== selectedItem.CITY_ID)
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
        <h4 className="mb-4">Create New City</h4>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>State</Form.Label>
                <Form.Select
                  name="STATE"
                  value={formData.STATE}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state.STATE_ID} value={state.STATE_ID}>
                      {state.NAME}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>City Name</Form.Label>
                <Form.Control
                  type="text"
                  name="NAME"
                  value={formData.NAME}
                  onChange={handleChange}
                  required
                  maxLength={100}
                  placeholder="Enter city name"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>City Code</Form.Label>
                <Form.Control
                  type="text"
                  name="CODE"
                  value={formData.CODE}
                  onChange={handleChange}
                  required
                  maxLength={5}
                  placeholder="Enter city code"
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
              {loading ? "Creating..." : "Create City"}
            </Button>
          </div>
        </Form>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>City Name</TableCell>
                <TableCell>Code</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cities.map((city) => (
                <TableRow key={city.CITY_ID}>
                  <TableCell>{city.NAME}</TableCell>
                  <TableCell>{city.CODE}</TableCell>
                  <TableCell>{city.STATE}</TableCell>
                  <TableCell>
                    {city.IS_ACTIVE ? "Active" : "Inactive"}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(city)}
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

export default CityEntry;
