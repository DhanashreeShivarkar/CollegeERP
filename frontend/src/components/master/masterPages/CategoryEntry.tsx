import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import axiosInstance from "../../../api/axios";
import { useNavigate } from "react-router-dom";

interface CategoryFormData {
  CATEGORY_ID?: number;
  NAME: string;
  CODE: string;
  DESCRIPTION: string;
  RESERVATION_PERCENTAGE: number;
  IS_ACTIVE: boolean;
  CREATED_BY?: string;
  UPDATED_BY?: string;
}

const CategoryEntry: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CategoryFormData>({
    NAME: "",
    CODE: "",
    DESCRIPTION: "",
    RESERVATION_PERCENTAGE: 0,
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
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : name === "RESERVATION_PERCENTAGE"
          ? parseFloat(value)
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

      if (!token || !user?.username) {
        setError("Authentication required");
        navigate("/login");
        return;
      }

      const response = await axiosInstance.post(
        "/api/master/categories/",
        {
          ...formData,
          CODE: formData.CODE.toUpperCase(),
          CREATED_BY: user.username,
          UPDATED_BY: user.username,
          RESERVATION_PERCENTAGE: parseFloat(
            formData.RESERVATION_PERCENTAGE.toString()
          ),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        setFormData({
          NAME: "",
          CODE: "",
          DESCRIPTION: "",
          RESERVATION_PERCENTAGE: 0,
          IS_ACTIVE: true,
        });
        alert(response.data.message || "Category created successfully!");
      }
    } catch (err: any) {
      console.error("Error:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Failed to create category";

      // If there's a specific field error, add it to the message
      const fieldError = err.response?.data?.field;
      setError(fieldError ? `${errorMessage} (${fieldError})` : errorMessage);

      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h4 className="mb-4">Create New Category</h4>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                type="text"
                name="NAME"
                value={formData.NAME}
                onChange={handleChange}
                required
                maxLength={50}
                placeholder="Enter category name"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Category Code</Form.Label>
              <Form.Control
                type="text"
                name="CODE"
                value={formData.CODE}
                onChange={handleChange}
                required
                maxLength={10}
                placeholder="Enter category code"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={12}>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="DESCRIPTION"
                value={formData.DESCRIPTION}
                onChange={handleChange}
                placeholder="Enter description"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Reservation Percentage</Form.Label>
              <Form.Control
                type="number"
                name="RESERVATION_PERCENTAGE"
                value={formData.RESERVATION_PERCENTAGE}
                onChange={handleChange}
                required
                min="0"
                max="100"
                step="0.01"
                placeholder="Enter reservation percentage"
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
            {loading ? "Creating..." : "Create Category"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CategoryEntry;
