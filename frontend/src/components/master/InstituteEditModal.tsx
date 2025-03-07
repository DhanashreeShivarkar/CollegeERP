import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

interface InstituteData {
  INSTITUTE_ID: string;
  NAME: string;
  CODE: string;
  ADDRESS: string;
  CONTACT_NUMBER: string;
  EMAIL: string;
  WEBSITE: string;
  ESTD_YEAR: string;
}

interface EditModalProps {
  show: boolean;
  item: Partial<InstituteData> | null;
  onSave: (updatedData: InstituteData) => void;
  onClose: () => void;
}

const EditModal: React.FC<EditModalProps> = ({ show, item, onSave, onClose }) => {
  
  const [formData, setFormData] = useState<InstituteData>({
    INSTITUTE_ID: "",
    NAME: "",
    CODE: "",
    ADDRESS: "",
    CONTACT_NUMBER: "",
    EMAIL: "",
    WEBSITE: "",
    ESTD_YEAR: "",
  });

  useEffect(() => {
    if (item) {
      setFormData(item as InstituteData);
    }
  }, [item]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (formData) {
      onSave(formData);
    }
  };

  return (
    <Modal show={show} onHide={onClose} backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Institute</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formInstituteID">
            <Form.Label>Institute ID</Form.Label>
            <Form.Control
              type="text"
              name="INSTITUTE_ID"
              value={formData.INSTITUTE_ID}
              readOnly
            />
          </Form.Group>

          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="NAME"
              value={formData.NAME}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formCode">
            <Form.Label>Code</Form.Label>
            <Form.Control
              type="text"
              name="CODE"
              value={formData.CODE}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formAddress">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              name="ADDRESS"
              value={formData.ADDRESS}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="formContactNumber">
            <Form.Label>Contact Number</Form.Label>
            <Form.Control
              type="text"
              name="CONTACT_NUMBER"
              value={formData.CONTACT_NUMBER}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="EMAIL"
              value={formData.EMAIL}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="formWebsite">
            <Form.Label>Website</Form.Label>
            <Form.Control
              type="text"
              name="WEBSITE"
              value={formData.WEBSITE}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="formEstdYear">
            <Form.Label>Established Year</Form.Label>
            <Form.Control
              type="text"
              name="ESTD_YEAR"
              value={formData.ESTD_YEAR}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditModal;
