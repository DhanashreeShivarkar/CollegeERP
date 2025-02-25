import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import axiosInstance from "../../../api/axios"; // Update import
import { useNavigate } from "react-router-dom";
import { Paper } from "@mui/material";

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

  useEffect(() => {
    // Check authentication when component mounts
    const token = localStorage.getItem("token"); // Changed from 'accessToken' to 'token'
    if (!token) {
      navigate("/login");
    }
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
    </Paper>
  );
};

export default CountryEntry;
