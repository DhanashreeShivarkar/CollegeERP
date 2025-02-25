import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import axiosInstance from "../../../api/axios";
import { useNavigate } from "react-router-dom";
import { Paper } from "@mui/material";

interface LanguageFormData {
  LANGUAGE_ID?: number;
  NAME: string;
  CODE: string;
  IS_ACTIVE: boolean;
  CREATED_BY?: string;
  UPDATED_BY?: string;
}

const LanguageEntry: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LanguageFormData>({
    NAME: "",
    CODE: "",
    IS_ACTIVE: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
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

      await axiosInstance.post(
        "/api/master/languages/",
        {
          ...formData,
          CODE: formData.CODE.toUpperCase(),
          CREATED_BY: user.username,
          UPDATED_BY: user.username,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFormData({
        NAME: "",
        CODE: "",
        IS_ACTIVE: true,
      });
      alert("Language created successfully!");
    } catch (err: any) {
      console.error("Error:", err);
      setError(err.response?.data?.message || "Failed to create language");
      if (err.response?.status === 401) {
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
        <h4 className="mb-4">Create New Language</h4>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Language Name</Form.Label>
                <Form.Control
                  type="text"
                  name="NAME"
                  value={formData.NAME}
                  onChange={handleChange}
                  required
                  maxLength={50}
                  placeholder="Enter language name"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Language Code</Form.Label>
                <Form.Control
                  type="text"
                  name="CODE"
                  value={formData.CODE}
                  onChange={handleChange}
                  required
                  maxLength={5}
                  placeholder="Enter language code (e.g., EN)"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group className="mt-2">
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
              {loading ? "Creating..." : "Create Language"}
            </Button>
          </div>
        </Form>
      </div>
    </Paper>
  );
};

export default LanguageEntry;
