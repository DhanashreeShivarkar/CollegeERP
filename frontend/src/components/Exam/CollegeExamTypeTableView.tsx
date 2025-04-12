import React, { useState, useEffect } from "react";
import { Table, Button, Card } from "react-bootstrap";
import axiosInstance from "../../api/axios";
import CollegeExamTypeForm from "./CollegeExamType";
import ReusableEditModal from "./ReusableEditModal";

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

const CollegeExamTypeTableView = () => {
    const [collegeExamTypes, setCollegeExamTypes] = useState<CollegeExamType[]>([]);
    const [programsList, setProgramsList] = useState<Program[]>([]);
    const [viewMode, setViewMode] = useState("form");

    // ✅ Added modal-related state
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<"edit" | "delete">("edit");
    const [selectedRecord, setSelectedRecord] = useState<CollegeExamType | null>(null);

    useEffect(() => {
        if (viewMode === "table") {
            Promise.all([fetchCollegeExamTypes(), fetchPrograms()])
                .then(() => console.log("✅ All data fetched successfully"))
                .catch((err) => console.error("❌ Error fetching data:", err));
        }
    }, [viewMode]);

    const fetchCollegeExamTypes = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const response = await axiosInstance.get("/api/exam/college-exam-type/", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 200) {
                console.log("Fetched College Exam Types:", response.data);
                setCollegeExamTypes(response.data);
            }
        } catch (error) {
            console.error("Error fetching college exam types:", error);
        }
    };

    const fetchPrograms = async () => {
        try {
            const response = await axiosInstance.get(`/api/master/program/`);
            if (response.status === 200 && Array.isArray(response.data)) {
                setProgramsList(response.data);
            } else {
                console.warn("Unexpected response format:", response.data);
                setProgramsList([]);
            }
        } catch (error) {
            console.error("Error fetching programs:", error);
            setProgramsList([]);
        }
    };

    const getProgramName = (programId: number) => {
        if (!programId || !programsList.length) return "Loading...";
        const program = programsList.find((p) => p.PROGRAM_ID === programId);
        return program ? program.NAME : "Not Found";
    };

    // ✅ Handle Edit
    const handleEdit = (record: CollegeExamType) => {
        setSelectedRecord(record);
        setModalType("edit");
        setShowModal(true);
    };

    // ✅ Handle Delete
    const handleDelete = async (record: CollegeExamType) => {
        if (!record) return;
    
        const confirmDelete = window.confirm(`Are you sure you want to delete the record for ${record.ACADEMIC_YEAR}?`);
        if (!confirmDelete) return;
    
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No authentication token found.");
                return;
            }
    
            // 🔥 Send DELETE request to backend
            const response = await axiosInstance.delete(`/api/exam/college-exam-type/${record.RECORD_ID}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            console.log("Response from DELETE request:", response);
    
            if (response.status === 204) {  // 204 means successful deletion
                console.log(`Deleted record for Academic Year: ${record.ACADEMIC_YEAR}`);
                setCollegeExamTypes((prev) => prev.filter((rec) => rec.RECORD_ID !== record.RECORD_ID));
            } else {
                console.error("Unexpected response while deleting:", response);
            }
        } catch (error) {
            console.error("Error deleting record:", error);
        }
    };

    // ✅ Update Record after editing
    const updateRecords = (updatedRecord: CollegeExamType) => {
        setCollegeExamTypes((prev) =>
            prev.map((rec) => (rec.RECORD_ID === updatedRecord.RECORD_ID ? updatedRecord : rec))
        );
    };

    // ✅ Remove Record after deletion
    const removeRecord = (id: number) => {
        setCollegeExamTypes((prev) => prev.filter((rec) => rec.RECORD_ID !== id));
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-center mb-3">
                <Button variant="primary" className="me-3" onClick={() => setViewMode("form")}>Add College Exam Type</Button>
                <Button variant="secondary" onClick={() => setViewMode("table")}>View College Exam Types</Button>
            </div>

            {viewMode === "form" ? (
                <CollegeExamTypeForm />
            ) : (
                <Card className="p-4 shadow-lg rounded-3 bg-white">
                    <Card.Body>
                        <h3 className="text-center mb-4">College Exam Type List</h3>
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Academic Year</th>
                                    <th>Exam Type</th>
                                    <th>Program</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {collegeExamTypes.length > 0 ? (
                                    collegeExamTypes.map((examType, index) => (
                                        <tr key={index}>
                                            <td>{examType.ACADEMIC_YEAR}</td>
                                            <td>{examType.EXAM_TYPE}</td>
                                            <td>{getProgramName(examType.PROGRAM_ID)}</td>
                                            <td>
                                                <Button
                                                    variant="warning"
                                                    size="sm"
                                                    className="me-2"
                                                    onClick={() => handleEdit(examType)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => handleDelete(examType)}
                                                >
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="text-center">No records found</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            )}

            {/* ✅ Reusable Modal with Props */}
            <ReusableEditModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                type={modalType}
                selectedRecord={selectedRecord}
                updateRecords={updateRecords}
                removeRecord={removeRecord}
                programsList={programsList}
            />
        </div>
    );
};

export default CollegeExamTypeTableView;
