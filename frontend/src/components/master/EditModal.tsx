import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useSettings } from "../../context/SettingsContext";
import { Paper } from "@mui/material";

interface EditModalProps {
  show: boolean;
  onHide: () => void;
  onSave: (data: any) => void;
  data: any;
  tableName: string;
  relatedData?: any[];
}

const EditModal: React.FC<EditModalProps> = ({
  show,
  onHide,
  onSave,
  data,
  tableName,
  relatedData,
}) => {
  const { darkMode } = useSettings();
  const [formData, setFormData] = useState<any>(data);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const renderFormField = (key: string, value: any) => {
    // Skip these fields in the form
    if (
      ["CREATED_BY", "UPDATED_BY", "CREATED_AT", "UPDATED_AT"].includes(key)
    ) {
      return null;
    }

    // Handle special cases based on field name and table
    if (key === "IS_ACTIVE") {
      return (
        <Form.Group key={key}>
          <Form.Check
            type="checkbox"
            label="Is Active"
            name={key}
            checked={value}
            onChange={handleChange}
          />
        </Form.Group>
      );
    }

    // Handle foreign key relationships
    if (key === "COUNTRY" && tableName === "state") {
      return (
        <Form.Group key={key}>
          <Form.Label>Country</Form.Label>
          <Form.Select
            name={key}
            value={value}
            onChange={handleChange}
            required
          >
            <option value="">Select Country</option>
            {relatedData?.map((country: any) => (
              <option key={country.COUNTRY_ID} value={country.COUNTRY_ID}>
                {country.NAME}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      );
    }

    if (key === "STATE" && tableName === "city") {
      return (
        <Form.Group key={key}>
          <Form.Label>State</Form.Label>
          <Form.Select
            name={key}
            value={value}
            onChange={handleChange}
            required
          >
            <option value="">Select State</option>
            {relatedData?.map((state: any) => (
              <option key={state.STATE_ID} value={state.STATE_ID}>
                {state.NAME}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      );
    }

    // Handle number inputs
    if (key === "RESERVATION_PERCENTAGE") {
      return (
        <Form.Group key={key}>
          <Form.Label>{key.replace(/_/g, " ")}</Form.Label>
          <Form.Control
            type="number"
            name={key}
            value={value}
            onChange={handleChange}
            min="0"
            max="100"
            step="0.01"
            required
          />
        </Form.Group>
      );
    }

    // Default text input
    return (
      <Form.Group key={key}>
        <Form.Label>{key.replace(/_/g, " ")}</Form.Label>
        <Form.Control
          type="text"
          name={key}
          value={value || ""}
          onChange={handleChange}
          required={key !== "DESCRIPTION"}
        />
      </Form.Group>
    );
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      contentClassName={darkMode ? "bg-dark text-light" : ""}
    >
      <Paper
        elevation={3}
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "#1a1a1a" : "#ffffff",
          color: (theme) => theme.palette.text.primary,
        }}
      >
        <Modal.Header
          closeButton
          className={darkMode ? "border-secondary bg-dark" : ""}
          closeVariant={darkMode ? "white" : undefined}
        >
          <Modal.Title>
            Edit {tableName.charAt(0).toUpperCase() + tableName.slice(1)}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className={darkMode ? "bg-dark" : ""}>
            <Row>
              {Object.entries(formData).map(([key, value]) => (
                <Col md={6} key={key} className="mb-3">
                  {renderFormField(key, value)}
                </Col>
              ))}
            </Row>
          </Modal.Body>
          <Modal.Footer className={darkMode ? "border-secondary bg-dark" : ""}>
            <Button variant="secondary" onClick={onHide}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Paper>
    </Modal>
  );
};

export default EditModal;
