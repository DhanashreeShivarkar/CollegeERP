import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { Paper } from "@mui/material";
import axiosInstance from "../../../api/axios";
import { useNavigate } from "react-router-dom";

interface CurrencyFormData {
  CURRENCY_ID?: number;
  NAME: string;
  CODE: string;
  SYMBOL: string;
  IS_ACTIVE: boolean;
  CREATED_BY?: string;
  UPDATED_BY?: string;
}

const CurrencyEntry: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CurrencyFormData>({
    NAME: "",
    CODE: "",
    SYMBOL: "",
    IS_ACTIVE: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
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
      await axiosInstance.post(
        "/api/master/currencies/",
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

      setFormData({
        NAME: "",
        CODE: "",
        SYMBOL: "",
        IS_ACTIVE: true,
      });
      alert("Currency created successfully!");
    } catch (err: any) {
      console.error("Error:", err);
      setError(err.response?.data?.message || "Failed to create currency");
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
        <h4 className="mb-4">Create New Currency</h4>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Currency Name</Form.Label>
                <Form.Control
                  type="text"
                  name="NAME"
                  value={formData.NAME}
                  onChange={handleChange}
                  required
                  maxLength={50}
                  placeholder="Enter currency name"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Currency Code</Form.Label>
                <Form.Control
                  type="text"
                  name="CODE"
                  value={formData.CODE}
                  onChange={handleChange}
                  required
                  maxLength={3}
                  placeholder="Enter currency code (e.g., USD)"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Currency Symbol</Form.Label>
                <Form.Control
                  type="text"
                  name="SYMBOL"
                  value={formData.SYMBOL}
                  onChange={handleChange}
                  required
                  maxLength={5}
                  placeholder="Enter currency symbol (e.g., $)"
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
              {loading ? "Creating..." : "Create Currency"}
            </Button>
          </div>
        </Form>
      </div>
    </Paper>
  );
};

export default CurrencyEntry;
