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
  const [languages, setLanguages] = useState<LanguageFormData[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/master/languages/");
      setLanguages(response.data);
    } catch (err) {
      console.error("Error fetching languages:", err);
      setError("Failed to fetch languages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
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
      fetchData();
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

  const handleDeleteClick = (item: any) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;

    try {
      setLoading(true);
      await axiosInstance.delete(
        `/api/master/languages/${selectedItem.LANGUAGE_ID}/`
      );

      setLanguages((prevLanguages) =>
        prevLanguages.filter(
          (language) => language.LANGUAGE_ID !== selectedItem.LANGUAGE_ID
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
              {languages.map((language) => (
                <TableRow key={language.LANGUAGE_ID}>
                  <TableCell>{language.NAME}</TableCell>
                  <TableCell>{language.CODE}</TableCell>
                  <TableCell>
                    {language.IS_ACTIVE ? "Active" : "Inactive"}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(language)}
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

export default LanguageEntry;
