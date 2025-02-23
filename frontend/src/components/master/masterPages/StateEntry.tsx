import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import axiosInstance from "../../../api/axios";
import { useNavigate } from "react-router-dom";

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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchCountries();
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

  return (
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
    </div>
  );
};

export default StateEntry;
