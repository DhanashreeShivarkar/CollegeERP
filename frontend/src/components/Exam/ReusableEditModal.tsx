import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axiosInstance from "../../api/axios";

interface CollegeExamType {
    RECORD_ID: number;
    ACADEMIC_YEAR: string;
    EXAM_TYPE: string;
    PROGRAM_ID: number;
}

interface Program {
    PROGRAM_ID: number;
    NAME: string;
    CODE: string;
}

interface ReusableEditModalProps {
    show: boolean;
    handleClose: () => void;
    type: "edit" | "delete";
    selectedRecord: CollegeExamType | null;
    updateRecords: (updatedRecord: CollegeExamType) => void;
    removeRecord: (id: number) => void;
    programsList: Program[];
}

const ReusableEditModal: React.FC<ReusableEditModalProps> = ({
    show,
    handleClose,
    type,
    selectedRecord,
    updateRecords,
    removeRecord,
    programsList
}) => {
    const [formData, setFormData] = useState<CollegeExamType | null>(selectedRecord);

    useEffect(() => {
        if (selectedRecord) {
            setFormData(selectedRecord);
        }
    }, [selectedRecord]);

    // Handle Input Change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        if (formData) {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    // Handle Save Edit
    const handleSave = async () => {
        if (!formData) return;
        try {
            const response = await axiosInstance.put(
                `/api/exam/college-exam-type/${formData.RECORD_ID}/`,
                formData
            );
            if (response.status === 200) {
                updateRecords(response.data);
                handleClose();
            }
        } catch (error) {
            console.error("Error updating record:", error);
        }
    };

    // Handle Delete (Frontend Only)
    const handleDelete = () => {
        if (selectedRecord) {
            removeRecord(selectedRecord.RECORD_ID);
        }
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose} backdrop="static" centered>
            <Modal.Header closeButton>
                <Modal.Title>{type === "edit" ? "Edit Record" : "Confirm Delete"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {type === "edit" && formData ? (
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Academic Year</Form.Label>
                            <Form.Control
                                type="text"
                                name="ACADEMIC_YEAR"
                                value={formData.ACADEMIC_YEAR}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Exam Type</Form.Label>
                            <Form.Control
                                type="text"
                                name="EXAM_TYPE"
                                value={formData.EXAM_TYPE}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Program</Form.Label>
                            <Form.Select
                                name="PROGRAM_ID"
                                value={formData.PROGRAM_ID}
                                onChange={handleChange}
                            >
                                {programsList.map((program) => (
                                    <option key={program.PROGRAM_ID} value={program.PROGRAM_ID}>
                                        {program.NAME}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Form>
                ) : (
                    <p>Are you sure you want to delete this record?</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                {type === "edit" ? (
                    <Button variant="success" onClick={handleSave}>
                        Save
                    </Button>
                ) : (
                    <Button variant="danger" onClick={handleDelete}>
                        Yes, Delete
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
};

export default ReusableEditModal;
