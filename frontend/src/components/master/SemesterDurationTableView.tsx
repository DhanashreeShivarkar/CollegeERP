import React, { useState, useEffect } from "react";
import { Table, Button, Card } from "react-bootstrap";
import axiosInstance from "../../api/axios";
import SemesterDurationForm from "./SemesterDuration";

interface SemesterDuration {
    SEMESTER_DURATION_ID: number;
    SEMESTER: string;
    START_DATE: string;
    END_DATE: string;
    IS_ACTIVE: boolean;
  }
const SemesterDurationTableView = () => {
    const [semesterDurations, setSemesterDurations] = useState<SemesterDuration[]>([]);
    const [viewMode, setViewMode] = useState("form");

    useEffect(() => {
        if (viewMode === "table") {
            fetchSemesterDurations();
        }
    }, [viewMode]);

    const fetchSemesterDurations = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
            
            const response = await axiosInstance.get("/api/master/semester-duration/", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 200) {
                setSemesterDurations(response.data);
            }
        } catch (error) {
            console.error("Error fetching semester durations:", error);
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-center mb-3">
                <Button variant="primary" className="me-3" onClick={() => setViewMode("form")}>Add Semester Duration</Button>
                <Button variant="secondary" onClick={() => setViewMode("table")}>View Semester Durations</Button>
            </div>

            {viewMode === "form" ? (
                <SemesterDurationForm />
            ) : (
                <Card className="p-4 shadow-lg rounded-3 bg-white">
                    <Card.Body>
                        <h3 className="text-center mb-4">Semester Duration List</h3>
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Semester</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {semesterDurations.length > 0 ? (
                                    semesterDurations.map((duration, index) => (
                                        <tr key={index}>
                                            <td>{duration.SEMESTER}</td>
                                            <td>{duration.START_DATE}</td>
                                            <td>{duration.END_DATE}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="text-center">No records found</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            )}
        </div>
    );
};

export default SemesterDurationTableView;
