import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { Row, Col } from "react-bootstrap";
import axiosInstance from '../../api/axios';
import { motion } from 'framer-motion';
import { Card } from "react-bootstrap";

interface OptionType {
    UNIVERSITY?: number;
    INSTITUTE?: string;
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
    CODE: string;
  }

const SemesterDurationForm = () => {
    // Explicitly define the types of state variables
    const [universities, setUniversities] = useState<University[]>([]);
    const [institutes, setInstitutes] = useState<Institute[]>([]);
    const [programs, setPrograms] = useState<Program[]>([]);
    const [branches, setBranches] = useState<OptionType[]>([]);
    const [years, setYears] = useState<OptionType[]>([]);
    const [semesters, setSemesters] = useState<OptionType[]>([]);
    const [error, setError] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);

    const [selectedUniversity, setSelectedUniversity] = useState<string>("");
    const [selectedInstitute, setSelectedInstitute] = useState<string>("");
    const [selectedProgram, setSelectedProgram] = useState<string>("");
    const [selectedBranch, setSelectedBranch] = useState<string>("");
    const [selectedYear, setSelectedYear] = useState<string>("");
    const [selectedSemester, setSelectedSemester] = useState<string>("");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

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
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
    
            const response = await axiosInstance.get(`/api/master/programs/?institute_id=${instituteId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            if (response.status === 200) {
                setPrograms(response.data);
            }
        } catch (error) {
            console.error('Error fetching programs:', error);
            setError('Failed to load programs');
        }
    };
    
    const handleProgramChange = (data: OptionType[]) => {
    const programs: Program[] = data.map((option) => ({
        PROGRAM_ID: option.value, // Now `value` exists
        CODE: option.label,       // Now `label` exists
    }));

    setPrograms(programs);
};

    
    // useEffect(() => {
    //     if (selectedInstitute) {
    //         fetch(`/api/programs?institute=${selectedInstitute}`)
    //             .then(res => res.json())
    //             .then((data: OptionType[]) => setPrograms(data))
    //             .catch(err => console.error("Error fetching programs:", err));
    //     }
    // }, [selectedInstitute]);

    // useEffect(() => {
    //     if (selectedProgram) {
    //         fetch(`/api/branches?program=${selectedProgram}`)
    //             .then(res => res.json())
    //             .then((data: OptionType[]) => setBranches(data))
    //             .catch(err => console.error("Error fetching branches:", err));
    //     }
    // }, [selectedProgram]);

    // useEffect(() => {
    //     if (selectedBranch) {
    //         fetch(`/api/years?branch=${selectedBranch}`)
    //             .then(res => res.json())
    //             .then((data: OptionType[]) => setYears(data))
    //             .catch(err => console.error("Error fetching years:", err));
    //     }
    // }, [selectedBranch]);

    // useEffect(() => {
    //     if (selectedYear) {
    //         fetch(`/api/semesters?year=${selectedYear}`)
    //             .then(res => res.json())
    //             .then((data: OptionType[]) => setSemesters(data))
    //             .catch(err => console.error("Error fetching semesters:", err));
    //     }
    // }, [selectedYear]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = {
            university: selectedUniversity,
            institute: selectedInstitute,
            program: selectedProgram,
            branch: selectedBranch,
            year: selectedYear,
            semester: selectedSemester,
            startDate,
            endDate
        };
        console.log("Form Submitted: ", formData);
        // Submit form data to backend
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
                                    <Form.Control as="select" value={selectedProgram} onChange={e => setSelectedProgram(e.target.value)} disabled={!selectedInstitute}>
    <option value="" disabled>Select Program</option>
    {programs.map((p) => (
        <option key={p.PROGRAM_ID} value={p.PROGRAM_ID}>{p.CODE}</option>
    ))}
</Form.Control>

                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Branch</Form.Label>
                                    <Form.Control as="select" value={selectedBranch} onChange={e => setSelectedBranch(e.target.value)} disabled={!selectedProgram}>
                                        <option value="" disabled>Select Branch</option>
                                        {branches.map((b) => (
                                            <option key={b.id} value={b.id}>{b.name}</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Year</Form.Label>
                                    <Form.Control as="select" value={selectedYear} onChange={e => setSelectedYear(e.target.value)} disabled={!selectedBranch}>
                                        <option value="" disabled>Select Year</option>
                                        {years.map((y) => (
                                            <option key={y.id} value={y.id}>{y.name}</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Semester</Form.Label>
                                    <Form.Control as="select" value={selectedSemester} onChange={e => setSelectedSemester(e.target.value)} disabled={!selectedYear}>
                                        <option value="" disabled>Select Semester</option>
                                        {semesters.map((s) => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Start Date</Form.Label>
                                    <Form.Control type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>End Date</Form.Label>
                                    <Form.Control type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
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
