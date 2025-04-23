import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import axiosInstance from "../../api/axios";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import axios from "axios";

interface OptionType {
  ACADEMIC_YEAR: number;
  UNIVERSITY?: number;
  INSTITUTE?: number;
  PROGRAM_ID?: number;
  EXAM_TYPE: string;
}

interface AcademicYear {
  ACADEMIC_YEAR_ID: number;
  ACADEMIC_YEAR: string;
}

interface University {
  UNIVERSITY_ID: number;
  NAME: string;
}

interface Institute {
  INSTITUTE_ID: number;
  NAME: string;
}

interface Program {
  PROGRAM_ID: number;
  NAME: string;
  CODE: string;
}

const CollegeExamTypeForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OptionType>();

  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [examType, setExamType] = useState("");

  useEffect(() => {
    const fetchAcademicYears = async () => {
      try {
        const response = await axiosInstance.get("/api/master/academic-years/");
        if (response.status === 200 && Array.isArray(response.data)) {
          setAcademicYears(response.data);
        }
      } catch (error) {
        console.error("Error fetching academic years:", error);
      }
    };

    const fetchUniversities = async () => {
      try {
        const response = await axiosInstance.get("/api/master/universities/");
        if (response.status === 200) setUniversities(response.data);
      } catch (error) {
        console.error("Error fetching universities:", error);
      }
    };

    fetchAcademicYears();
    fetchUniversities();
  }, []);

  const fetchInstitutes = async (universityId: number) => {
    try {
      const response = await axiosInstance.get(
        `/api/master/institutes/?university_id=${universityId}`
      );
      if (response.status === 200) {
        setInstitutes(response.data);
        setPrograms([]);
        setValue("INSTITUTE", undefined);
        setValue("PROGRAM_ID", undefined);
      }
    } catch (error) {
      console.error("Error fetching institutes:", error);
    }
  };

  const fetchPrograms = async (instituteId: number) => {
    try {
      const response = await axiosInstance.get(
        `/api/master/program/?institute_id=${instituteId}`
      );
      if (response.status === 200 && Array.isArray(response.data)) {
        setPrograms(response.data);
        if (response.data.length === 0) {
          setValue("PROGRAM_ID", undefined);
        }
      } else {
        setPrograms([]);
        setValue("PROGRAM_ID", undefined);
      }
    } catch (error) {
      console.error("Error fetching programs:", error);
      setPrograms([]);
      setValue("PROGRAM_ID", undefined);
    }
  };

  const onSubmit = async (data: OptionType) => {
    const payload = {
      ...data,
      UNIVERSITY: data.UNIVERSITY ?? null,
      INSTITUTE: data.INSTITUTE ?? null,
      PROGRAM_ID: data.PROGRAM_ID ?? null,
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Authentication token is missing. Please log in again.");
        return;
      }

      const response = await axiosInstance.post(
        "/api/exam/college-exam-type/",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        alert("College Exam Type Form submitted successfully!");
        window.location.reload();
      } else {
        alert("Failed to save data. Please try again.");
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      if (axios.isAxiosError(error) && error.response) {
        alert(JSON.stringify(error.response.data, null, 2));
      } else {
        alert("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-4 shadow-lg rounded-3 bg-white">
        <Card.Body>
          <h3 className="text-center mb-4">College Exam Type Form</h3>
          <Form
            onSubmit={handleSubmit(onSubmit)}
            className="p-4 border rounded shadow-sm bg-light"
          >
            {/* Academic Year Dropdown */}
            <Row className="mb-3">
              <Col md={6}>
              <Form.Group>
                    <Form.Label>Academic Year</Form.Label>
                    <Form.Select
                        {...register("ACADEMIC_YEAR", {
                        required: "Academic Year is required",
                        })}
                        defaultValue=""
                    >
                        <option value="">Select Academic Year</option>
                        {academicYears.map((year) => (
                        <option key={year.ACADEMIC_YEAR_ID} value={year.ACADEMIC_YEAR_ID}>
                            {year.ACADEMIC_YEAR}
                        </option>
                        ))}
                    </Form.Select>
                    {errors.ACADEMIC_YEAR && (
                        <span className="text-danger">{errors.ACADEMIC_YEAR.message}</span>
                    )}
                </Form.Group>
              </Col>
            </Row>

            {/* University & Institute */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>University</Form.Label>
                  <Form.Select
                    onChange={(e) => {
                      const universityId = Number(e.target.value);
                      setValue("UNIVERSITY", universityId);
                      fetchInstitutes(universityId);
                    }}
                  >
                    <option value="">Select University</option>
                    {universities.map((u) => (
                      <option key={u.UNIVERSITY_ID} value={u.UNIVERSITY_ID}>
                        {u.NAME}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Institute</Form.Label>
                  <Form.Select
                    onChange={(e) => {
                      const instituteId = Number(e.target.value);
                      setValue("INSTITUTE", instituteId);
                      fetchPrograms(instituteId);
                    }}
                    disabled={institutes.length === 0}
                  >
                    <option value="">Select Institute</option>
                    {institutes.map((i) => (
                      <option key={i.INSTITUTE_ID} value={i.INSTITUTE_ID}>
                        {i.NAME}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {/* Program & Exam Type */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Program</Form.Label>
                  <Form.Select
                    onChange={(e) =>
                      setValue("PROGRAM_ID", Number(e.target.value))
                    }
                    disabled={programs.length === 0}
                  >
                    <option value="">Select Program</option>
                    {programs.map((p) => (
                      <option key={p.PROGRAM_ID} value={p.PROGRAM_ID}>
                        {p.NAME}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Exam Type</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Exam Type"
                    {...register("EXAM_TYPE", {
                      required: "Exam Type is required",
                    })}
                    value={examType}
                    onChange={(e) => {
                      setExamType(e.target.value);
                      setValue("EXAM_TYPE", e.target.value);
                    }}
                  />
                  {errors.EXAM_TYPE && (
                    <span className="text-danger">
                      {errors.EXAM_TYPE.message}
                    </span>
                  )}
                </Form.Group>
              </Col>
            </Row>

            {/* Submit */}
            <div className="d-flex justify-content-center mt-3">
              <Button type="submit" variant="primary">
                Submit
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </motion.div>
  );
};

export default CollegeExamTypeForm;
