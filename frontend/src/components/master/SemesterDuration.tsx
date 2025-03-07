import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { Row, Col } from "react-bootstrap";
import axiosInstance from '../../api/axios';
import { motion } from 'framer-motion';
import { Card } from "react-bootstrap";
import axios from "axios";
import { useForm } from "react-hook-form";

interface OptionType {
    UNIVERSITY?: number;
    INSTITUTE?: number;
    PROGRAM?: number;
    BRANCH?: number;
    YEAR?: number;
    SEMESTER?: number;
    START_DATE: string;
    END_DATE: string;
    id: string;
    name: string;
    value: number;
    label: string;
}
interface University {
    UNIVERSITY_ID: number;
    NAME: string;
    CODE: string;
  }
  
  interface Institute {
    INSTITUTE_ID: number;
    CODE: string;
  }

  interface Program {
    PROGRAM_ID: number;
    NAME: string;
  }

  interface Branch {
    BRANCH_ID: number;
    NAME: string;
  }
  interface Year {
    YEAR_ID: number;
    YEAR: string;
  }
  interface Semester {
    SEMESTER_ID: number;
    SEMESTER: string;
}

const SemesterDurationForm = () => {
    // Explicitly define the types of state variables
    const { register, reset, setValue, formState: { errors } } = useForm<OptionType>();
    const [universities, setUniversities] = useState<University[]>([]);
    const [institutes, setInstitutes] = useState<Institute[]>([]);
    const [programs, setPrograms] = useState<Program[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [years, setYears] = useState<Year[]>([]);
    const [semesters, setSemesters] = useState<Semester[]>([]);
    const [error, setError] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);

    const [selectedUniversity, setSelectedUniversity] = useState<string>("");
    const [selectedInstitute, setSelectedInstitute] = useState<string>("");
    const [selectedProgram, setSelectedProgram] = useState<string>("");
    const [selectedBranch, setSelectedBranch] = useState<string>("");
    const [selectedYear, setSelectedYear] = useState<string>("");
    const [selectedSemester, setSelectedSemester] = useState<string>("");
    const [selectedSemesterText, setSelectedSemesterText] = useState<string>("");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    useEffect(() => {
        console.log("Selected Year:", selectedYear);
        console.log("Semesters:", semesters);
    }, [selectedYear, semesters]);

    // Fetch Universities
    useEffect(() => {
        console.log("Current editing ID:", editingId);
        const fetchUniversities = async () => {
          try {
            const token = localStorage.getItem('token');
            if (!token) return;
    
            const response = await axiosInstance.get('/api/master/universities/', {
              headers: { Authorization: `Bearer ${token}` },
            });
    
            if (response.status === 200) {
              setUniversities(response.data);
            }
          } catch (error) {
            console.error('Error fetching universities:', error);
            setError('Failed to load universities');
          }
        };
        fetchUniversities();
      }, []);
    
      const fetchInstitutes = async (universityId: number) => {
        try {
          const token = localStorage.getItem('token');
          if (!token) return;
    
          const response = await axiosInstance.get(`/api/master/institutes/?university_id=${universityId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
    
          if (response.status === 200) {
            setInstitutes(response.data);
          }
        } catch (error) {
          console.error('Error fetching institutes:', error);
          setError('Failed to load institutes');
        }
      };

      const handleUniversityChange = (e: React.ChangeEvent<unknown>) => {
        const target = e.target as HTMLSelectElement; // Cast to HTMLSelectElement explicitly
        const universityId = parseInt(target.value, 10);
        
        setSelectedUniversity(universityId.toString());
        setInstitutes([]);
    
        if (universityId) {
            fetchInstitutes(universityId);
        }
    };
    
    const handleInstituteChange = (e: React.ChangeEvent<HTMLElement>) => {
        const target = e.target as HTMLSelectElement; // Explicitly cast
        const instituteId = parseInt(target.value, 10);
        setSelectedInstitute(instituteId.toString());
    
        if (instituteId) {
            fetchPrograms(instituteId);
        }
    };
        
    const fetchPrograms = async (instituteId: number) => {
        setPrograms([]);
        setBranches([]);
        setYears([]);
        setSemesters([]); 
        try {
          const response = await axiosInstance.get(`/api/master/program/?institute_id=${instituteId}`);
          if (response.status === 200) setPrograms(response.data);
        } catch (error) {
          console.error("Error fetching programs:", error);
        }
      };
    
      const fetchBranches = async (programId: number) => {
        setBranches([]);
        setYears([]);
        setSemesters([]); 
        try {
          const response = await axiosInstance.get(`/api/master/branch/?program_id=${programId}`);
          if (response.status === 200) setBranches(response.data);
        } catch (error) {
          console.error("Error fetching branches:", error);
        }
      };
      
      const handleProgramChange = (e: React.ChangeEvent<unknown>) => {
        const target = e.target as HTMLSelectElement; // Explicitly cast to HTMLSelectElement
        const programId = parseInt(target.value, 10);
        setSelectedProgram(programId.toString());
    
        if (programId) {
            fetchBranches(programId); // Fetch branches based on selected program
        }
     };

     const handleBranchChange = (e: React.ChangeEvent<any>) => {
        const target = e.target as HTMLSelectElement; // Explicit cast
        const branchId = parseInt(target.value, 10);
        console.log("Selected Branch ID:", branchId);  // Debug log
        setSelectedBranch(branchId.toString());
    
        if (branchId) {
            fetchYears(branchId);
        }
    };
        
    const fetchYears = async (branchId: number) => {
        console.log("Fetching years for branch:", branchId);
        setYears([]); 
        setSemesters([]);  
    
        try {
            const response = await axiosInstance.get(`/api/master/year/?branch_id=${branchId}`);
            console.log("API Response:", response.data);
    
            if (response.status === 200 && Array.isArray(response.data)) {
                setYears(response.data);
            } else {
                console.error("Invalid data format:", response.data);
            }
        } catch (error) {
            console.error("Error fetching years:", error);
        }
    };
    
    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const yearId = parseInt(e.target.value, 10);
        setSelectedYear(yearId.toString());
        fetchSemesters(yearId);
        setSelectedSemester(""); // Reset selected semester
        if (!isNaN(yearId) && yearId > 0) {
            fetchSemesters(yearId);
        } else {
            console.error("Invalid year ID:", yearId);
        }
      };
       
    
      const fetchSemesters = async (yearId: number) => {
        setSemesters([]);
        try {
            const response = await axiosInstance.get(`/api/master/semester/?year_id=${yearId}`);
            console.log("Fetched semesters:", response.data);
            if (Array.isArray(response.data)) {
                setSemesters(response.data);
            } else {
                console.error("Invalid semester data format:", response.data);
            }
        } catch (error) {
            console.error("Error fetching semesters:", error);
        }
    };    
      

    const handleSemesterChange = (e: React.ChangeEvent<any>) => {
        const target = e.target as HTMLSelectElement;
        const semesterId = parseInt(target.value, 10); // Ensure it's a number
        const semesterText = semesters.find(s => s.SEMESTER_ID === semesterId)?.SEMESTER || "";
        console.log("Selected Semester ID:", semesterId);
        console.log("Selected Semester Text:", semesterText);
        setSelectedSemester(semesterId.toString()); // Convert to string if necessary
        setSelectedSemesterText(semesterText);
    };
      
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        const formData = {
            SEMESTER: selectedSemesterText,
            START_DATE: startDate,
            END_DATE: endDate
        };
    
        console.log("Submitting Form Data:", formData);  // Debug before sending
    
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Authentication token is missing.");
                return;
            }
    
            const response = await axiosInstance.post("/api/master/semester-duration/", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
    
            if (response.status === 201) {
                alert("Semester duration saved successfully!");
                setSelectedSemester("");
                setSelectedSemesterText("");
                setStartDate("");
                setEndDate("");
                setError("");
            } else {
                setError("Failed to save data. Please try again.");
            }
        } catch (error: any) {
            console.error("Error submitting form:", error);
            if (axios.isAxiosError(error) && error.response) {
                console.log("Error Response Data:", error.response.data);  // Debug API error
                setError(JSON.stringify(error.response.data));
            } else {
                setError("Something went wrong. Please try again.");
            }
        }
    };
        

    return (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="p-4 shadow-lg rounded-3 bg-white">
                <Card.Body>
                    <h3 className="text-center mb-4">Semester Duration Form</h3>
                    <Form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-light">
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>University</Form.Label>
                                    <Form.Control as="select" value={selectedUniversity} onChange={handleUniversityChange} // No need for additional casting
                                    >
                                        <option value="" disabled>Select University</option>
                                        {universities.map((u) => (
                                            <option key={u.UNIVERSITY_ID} value={u.UNIVERSITY_ID}>{u.NAME}</option>
                                            ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Institute</Form.Label>
                                    <Form.Control as="select" value={selectedInstitute} onChange={handleInstituteChange} disabled={!selectedUniversity}>
                                        <option value="" disabled>Select Institute</option>
                                        {institutes.map((i: Institute) => (
                                            <option key={i.INSTITUTE_ID} value={i.INSTITUTE_ID}>{i.CODE}</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Program</Form.Label>
                                    <Form.Control as="select" value={selectedProgram} onChange={handleProgramChange} disabled={!selectedInstitute}>
                                        <option value="" disabled>Select Program</option>
                                        {programs.map((p) => (
                                            <option key={p.PROGRAM_ID} value={p.PROGRAM_ID}>{p.NAME}</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Branch</Form.Label>
                                    <Form.Control as="select" value={selectedBranch} onChange={handleBranchChange} disabled={!selectedProgram}>
                                        <option value="" disabled>Select Branch</option>
                                        {branches.map((b) => (
                                            <option key={b.BRANCH_ID} value={b.BRANCH_ID}>{b.NAME}</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Year</Form.Label>
                                    <Form.Control 
                                    as="select"
                                    value={selectedYear}
                                    onChange={(e) => handleYearChange(e as unknown as React.ChangeEvent<HTMLSelectElement>)}
                                    disabled={!selectedBranch}>
                                        <option value="" disabled>Select Year</option>
                                        {years.map((y) => (
                                            <option key={y.YEAR_ID} value={y.YEAR_ID}>{y.YEAR}</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Semester</Form.Label>
                                    <Form.Control
                                    as="select"
                                    value={selectedSemester}
                                    onChange={handleSemesterChange}
                                    disabled={!selectedYear}
                                    >
                                        <option value="" disabled>Select Semester</option>
                                        {semesters.map((s) => (
                                            <option key={s.SEMESTER_ID} value={s.SEMESTER_ID}>{s.SEMESTER}</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                            <Form.Group>
                                <Form.Label>Start Date</Form.Label>
                                <Form.Control
                                type="date"
                                value={startDate ? new Date(startDate).toISOString().split("T")[0] : ""}
                                onChange={(e) => setStartDate(e.target.value)}
                                required
                                />
                            </Form.Group>
                            </Col>
                            <Col md={6}>
                            
                            <Form.Group>
                                <Form.Label>End Date</Form.Label>
                                <Form.Control
                                type="date"
                                value={endDate ? new Date(endDate).toISOString().split("T")[0] : ""}
                                onChange={(e) => setEndDate(e.target.value)}
                                required
                                />
                            </Form.Group>
                            </Col>
                        </Row>


                        <div className="d-flex justify-content-center">
                            <Button variant="primary" type="submit" disabled={!selectedSemester || !startDate || !endDate}>Submit</Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </motion.div>
    );
};

export default SemesterDurationForm;
