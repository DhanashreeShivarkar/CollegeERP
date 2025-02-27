import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import {
  Paper,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axiosInstance from "../../../api/axios";
import { useNavigate } from "react-router-dom";
import DeleteConfirmDialog from "../../common/DeleteConfirmDialog";

interface CountryFormData {
  COUNTRY_ID?: number;
  NAME: string;
  CODE: string;
  PHONE_CODE: string;
  IS_ACTIVE: boolean;
  CREATED_BY?: string;
  UPDATED_BY?: string;
}

const CountryEntry: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CountryFormData>({
    NAME: "",
    CODE: "",
    PHONE_CODE: "",
    IS_ACTIVE: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [countries, setCountries] = useState<CountryFormData[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/settings/countries/");
      setCountries(response.data);
    } catch (err) {
      console.error("Error fetching countries:", err);
      setError("Failed to fetch countries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check authentication when component mounts
    const token = localStorage.getItem("token"); // Changed from 'accessToken' to 'token'
    if (!token) {
      navigate("/login");
    }
    fetchData();
  }, [navigate]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
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
        "/api/master/countries/",
        {
          ...formData,
          CODE: formData.CODE.toUpperCase(),
          PHONE_CODE: formData.PHONE_CODE.startsWith("+")
            ? formData.PHONE_CODE
            : `+${formData.PHONE_CODE}`,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setFormData({
          NAME: "",
          CODE: "",
          PHONE_CODE: "",
          IS_ACTIVE: true,
        });
        alert("Country created successfully!");
        fetchData();
      }
    } catch (err: any) {
      console.error("Error:", err);
      setError(err.response?.data?.message || "Failed to create country");
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
        `/api/master/countries/${selectedItem.COUNTRY_ID}/`
      );

      // Update local state instead of fetching again
      setCountries((prevCountries) =>
        prevCountries.filter(
          (country) => country.COUNTRY_ID !== selectedItem.COUNTRY_ID
        )
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
        <h4 className="mb-4">Create New Country</h4>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Country Name</Form.Label>
                <Form.Control
                  type="text"
                  name="NAME"
                  value={formData.NAME}
                  onChange={handleChange}
                  required
                  maxLength={100}
                  placeholder="Enter country name"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Country Code</Form.Label>
                <Form.Control
                  type="text"
                  name="CODE"
                  value={formData.CODE}
                  onChange={handleChange}
                  required
                  maxLength={3}
                  placeholder="Enter country code (3 characters)"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Phone Code</Form.Label>
                <Form.Control
                  type="text"
                  name="PHONE_CODE"
                  value={formData.PHONE_CODE}
                  onChange={handleChange}
                  required
                  maxLength={5}
                  placeholder="Enter phone code (e.g., +91)"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
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
              {loading ? "Creating..." : "Create Country"}
            </Button>
          </div>
        </Form>
      </div>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Phone Code</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {countries.map((country) => (
              <TableRow key={country.COUNTRY_ID}>
                <TableCell>{country.NAME}</TableCell>
                <TableCell>{country.CODE}</TableCell>
                <TableCell>{country.PHONE_CODE}</TableCell>
                <TableCell>
                  {country.IS_ACTIVE ? "Active" : "Inactive"}
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(country)}
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
    </Paper>
  );
};

export default CountryEntry;
