import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

interface AcademicYearData {
  ID?: number;
  // UNIVERSITY: number;
  // INSTITUTE: string;
  ACADEMIC_YEAR: string;
  START_DATE: string;
  END_DATE: string;
}

interface EditModalProps {
  show: boolean;
  item: Partial<AcademicYearData> | null;
  onSave: (updatedData: AcademicYearData) => void;
  onClose: () => void;
}

const EditAcademicYearModal: React.FC<EditModalProps> = ({ show, item, onSave, onClose }) => {
  const [formData, setFormData] = useState<AcademicYearData>({
    ID: undefined,
    // UNIVERSITY: 0,
    // INSTITUTE: "",
    ACADEMIC_YEAR: "",
    START_DATE: "",
    END_DATE: "",
  });

  useEffect(() => {
    if (item) {
      setFormData(item as AcademicYearData);
    }
  }, [item]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
};

  const handleSubmit = () => {
    if (item) {
      onSave({ ...formData, ID: item.ID }); // Include ID for updating
  }
    // if (formData) {
    //   onSave(formData);
    // }
  };

  return (
    <Modal show={show} onHide={onClose} backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Academic Year</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* <Form.Group controlId="formAcademicYearID">
            <Form.Label>ID</Form.Label>
            <Form.Control
              type="text"
              name="ID"
              value={formData.ID || ""}
              readOnly
            />
          </Form.Group>

          <Form.Group controlId="formUniversity">
            <Form.Label>University</Form.Label>
            <Form.Control
              type="number"
              name="UNIVERSITY"
              value={formData.UNIVERSITY}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formInstitute">
            <Form.Label>Institute</Form.Label>
            <Form.Control
              type="text"
              name="INSTITUTE"
              value={formData.INSTITUTE}
              onChange={handleChange}
              required
            />
          </Form.Group> */}

          <Form.Group controlId="formAcademicYear">
            <Form.Label>Academic Year</Form.Label>
            <Form.Control
              type="text"
              name="ACADEMIC_YEAR"
              value={formData.ACADEMIC_YEAR}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formStartDate">
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="date"
              name="START_DATE"
              value={formData.START_DATE}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formEndDate">
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="date"
              name="END_DATE"
              value={formData.END_DATE}
              onChange={handleChange}
              required
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

export default EditAcademicYearModal;
