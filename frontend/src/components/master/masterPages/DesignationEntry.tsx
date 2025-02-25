import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import axiosInstance from "../../../api/axios";
import { useNavigate } from "react-router-dom";
import { Paper } from "@mui/material";

// Define module types
type ModuleType = "master" | "student" | "staff";
type PermissionType = {
  view: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
};

interface DesignationFormData {
  DESIGNATION_ID?: number;
  NAME: string;
  CODE: string;
  DESCRIPTION: string;
  PERMISSIONS: Record<ModuleType, PermissionType>;
  IS_ACTIVE: boolean;
  CREATED_BY?: string;
  UPDATED_BY?: string;
}

const defaultPermissions: Record<ModuleType, PermissionType> = {
  master: {
    view: false,
    create: false,
    update: false,
    delete: false,
  },
  student: {
    view: false,
    create: false,
    update: false,
    delete: false,
  },
  staff: {
    view: false,
    create: false,
    update: false,
    delete: false,
  },
};

const DesignationEntry: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<DesignationFormData>({
    NAME: "",
    CODE: "",
    DESCRIPTION: "",
    PERMISSIONS: defaultPermissions,
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

  const handlePermissionChange = (
    module: ModuleType,
    action: keyof PermissionType,
    checked: boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      PERMISSIONS: {
        ...prev.PERMISSIONS,
        [module]: {
          ...prev.PERMISSIONS[module],
          [action]: checked,
        },
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      await axiosInstance.post(
        "/api/master/designations/",
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
        DESCRIPTION: "",
        PERMISSIONS: defaultPermissions,
        IS_ACTIVE: true,
      });
      alert("Designation created successfully!");
    } catch (err: any) {
      console.error("Error:", err);
      setError(err.response?.data?.message || "Failed to create designation");
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
        <h4 className="mb-4">Create New Designation</h4>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Designation Name</Form.Label>
                <Form.Control
                  type="text"
                  name="NAME"
                  value={formData.NAME}
                  onChange={handleChange}
                  required
                  maxLength={50}
                  placeholder="Enter designation name"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Designation Code</Form.Label>
                <Form.Control
                  type="text"
                  name="CODE"
                  value={formData.CODE}
                  onChange={handleChange}
                  required
                  maxLength={20}
                  placeholder="Enter designation code"
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
                  maxLength={500}
                  placeholder="Enter description"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={12}>
              <h5>Permissions</h5>
              {(Object.keys(defaultPermissions) as ModuleType[]).map(
                (module) => (
                  <div key={module} className="mb-3">
                    <h6 className="text-capitalize">{module}</h6>
                    <div className="d-flex gap-3">
                      {(
                        Object.keys(
                          defaultPermissions[module]
                        ) as (keyof PermissionType)[]
                      ).map((action) => (
                        <Form.Check
                          key={`${module}-${action}`}
                          type="checkbox"
                          label={action}
                          checked={formData.PERMISSIONS[module][action]}
                          onChange={(e) =>
                            handlePermissionChange(
                              module,
                              action,
                              e.target.checked
                            )
                          }
                          className="text-capitalize"
                        />
                      ))}
                    </div>
                  </div>
                )
              )}
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
              {loading ? "Creating..." : "Create Designation"}
            </Button>
          </div>
        </Form>
      </div>
    </Paper>
  );
};

export default DesignationEntry;
