import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import axiosInstance from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { Paper } from "@mui/material";

interface UniversityFormData {
  UNIVERSITY_ID?: number;
  NAME: string;
  CODE: string;
  ADDRESS: string;
  CONTACT_NUMBER: string;
  EMAIL: string;
  WEBSITE?: string;
  ESTD_YEAR: number;
  IS_ACTIVE: boolean;
}

const UniversityMaster: React.FC = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const [formData, setFormData] = useState<UniversityFormData>({
    NAME: "",
    CODE: "",
    ADDRESS: "",
    CONTACT_NUMBER: "",
    EMAIL: "",
    WEBSITE: "",
    ESTD_YEAR: currentYear,
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
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      if (!token || !user?.user_id) {
        setError("Authentication required");
        navigate("/login");
        return;
      }

      const response = await axiosInstance.post(
        "/api/master/universities/",
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
          NAME: "",
          CODE: "",
          ADDRESS: "",
          CONTACT_NUMBER: "",
          EMAIL: "",
          WEBSITE: "",
          ESTD_YEAR: currentYear,
          IS_ACTIVE: true,
        });
        alert("University created successfully!");
      }
    } catch (err: any) {
      console.error("Error:", err);
      setError(err.response?.data?.message || "Failed to create university");
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const years = Array.from({ length: 200 }, (_, i) => currentYear - i);

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
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container my-5 p-4 shadow rounded form-container"
        style={{ maxHeight: "calc(100vh - 48px)", overflow: "hidden" }}
      >
        <h2 className="text-center mb-4">University Registration Form</h2>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <Form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-4">
              <motion.div whileHover={{ scale: 1.02 }}>
                <Form.Group>
                  <Form.Label className="form-label fw-semibold text-secondary">
                    University Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="NAME"
                    value={formData.NAME}
                    onChange={handleChange}
                    required
                    maxLength={255}
                    placeholder="Enter university name"
                    className="form-control input-focus"
                  />
                </Form.Group>
              </motion.div>
            </div>

            <div className="col-md-4">
              <motion.div whileHover={{ scale: 1.02 }}>
                <Form.Group>
                  <Form.Label className="form-label fw-semibold text-secondary">
                    University Code
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="CODE"
                    value={formData.CODE}
                    onChange={handleChange}
                    required
                    maxLength={50}
                    placeholder="Enter university code"
                    className="form-control input-focus"
                  />
                </Form.Group>
              </motion.div>
            </div>

            <div className="col-md-4">
              <motion.div whileHover={{ scale: 1.02 }}>
                <Form.Group>
                  <Form.Label className="form-label fw-semibold text-secondary">
                    Contact Number
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="CONTACT_NUMBER"
                    value={formData.CONTACT_NUMBER}
                    onChange={handleChange}
                    required
                    maxLength={15}
                    placeholder="Enter contact number"
                    className="form-control"
                  />
                </Form.Group>
              </motion.div>
            </div>

            <div className="col-md-4">
              <motion.div whileHover={{ scale: 1.02 }}>
                <Form.Group>
                  <Form.Label className="form-label fw-semibold text-secondary">
                    Address
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    name="ADDRESS"
                    value={formData.ADDRESS}
                    onChange={handleChange}
                    required
                    rows={3}
                    placeholder="Enter complete address"
                    className="form-control"
                  />
                </Form.Group>
              </motion.div>
            </div>

            <div className="col-md-4">
              <motion.div whileHover={{ scale: 1.02 }}>
                <Form.Group>
                  <Form.Label className="form-label fw-semibold text-secondary">
                    Email
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="EMAIL"
                    value={formData.EMAIL}
                    onChange={handleChange}
                    required
                    placeholder="Enter email address"
                    className="form-control"
                  />
                </Form.Group>
              </motion.div>
            </div>

            <div className="col-md-4">
              <motion.div whileHover={{ scale: 1.02 }}>
                <Form.Group>
                  <Form.Label className="form-label fw-semibold text-secondary">
                    Website
                  </Form.Label>
                  <Form.Control
                    type="url"
                    name="WEBSITE"
                    value={formData.WEBSITE}
                    onChange={handleChange}
                    placeholder="Enter website URL (optional)"
                    className="form-control"
                  />
                </Form.Group>
              </motion.div>
            </div>

            <div className="col-md-4">
              <motion.div whileHover={{ scale: 1.02 }}>
                <Form.Group>
                  <Form.Label className="form-label fw-semibold text-secondary">
                    Established Year
                  </Form.Label>
                  <Form.Select
                    name="ESTD_YEAR"
                    value={formData.ESTD_YEAR}
                    onChange={handleChange}
                    required
                    className="form-select"
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </motion.div>
            </div>

            <div className="col-md-4">
              <motion.div whileHover={{ scale: 1.02 }}>
                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    name="IS_ACTIVE"
                    checked={formData.IS_ACTIVE}
                    onChange={handleChange}
                    label="Is Active"
                    className="fw-semibold text-secondary"
                  />
                </Form.Group>
              </motion.div>
            </div>
          </div>

          <div className="col-12 text-center mt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create University"}
            </motion.button>
          </div>
        </Form>
      </motion.div>
    </Paper>
  );
};

export default UniversityMaster;
