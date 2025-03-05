import { useForm, SubmitHandler } from "react-hook-form";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { Paper } from "@mui/material";

interface InstituteFormInputs {
  INSTITUTE_ID?: number;
  UNIVERSITY: number; // Changed from UNIVERSITY_ID
  NAME: string; // Changed from INSTITUTE_NAME
  CODE: string; // Changed from INSTITUTE_CODE
  ADDRESS: string;
  CONTACT_NUMBER: string;
  EMAIL: string;
  WEBSITE?: string;
  ESTD_YEAR: number;
  IS_ACTIVE: boolean;
}

interface University {
  UNIVERSITY_ID: number;
  NAME: string;
  CODE: string;
}

export default function InstituteForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InstituteFormInputs>({
    defaultValues: {
      IS_ACTIVE: true,
    },
  });

  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          return;
        }

        const response = await axiosInstance.get("/api/master/universities/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setUniversities(response.data);
        }
      } catch (error) {
        console.error("Error fetching universities:", error);
        setError("Failed to load universities");
      }
    };

    fetchUniversities();
  }, []);

  const onSubmit: SubmitHandler<InstituteFormInputs> = async (data) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required");
        return;
      }

      const response = await axiosInstance.post(
        "/api/master/institutes/",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        alert("Institute created successfully!");
      } else {
        setError(response.data?.message || "Failed to create institute");
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      setError(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from(new Array(225), (_, index) => currentYear - index);

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
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container my-5 p-4 shadow rounded form-container"
      >
        <h2 className="text-center mb-4">Institute Registration Form</h2>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row g-3">
            {/* First row */}
            <div className="col-md-4">
              <motion.div whileHover={{ scale: 1.02 }}>
                <label className="form-label fw-semibold text-secondary">
                  University
                </label>
                <select
                  {...register("UNIVERSITY", {
                    required: true,
                    valueAsNumber: true,
                  })}
                  className="form-control input-focus"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select University
                  </option>
                  {universities.map((university) => (
                    <option
                      key={university.UNIVERSITY_ID}
                      value={university.UNIVERSITY_ID}
                    >
                      {university.NAME} ({university.CODE})
                    </option>
                  ))}
                </select>
                {errors.UNIVERSITY && (
                  <p className="text-danger">Please select a university</p>
                )}
              </motion.div>
            </div>

            <div className="col-md-4">
              <motion.div whileHover={{ scale: 1.02 }}>
                <label className="form-label fw-semibold text-secondary">
                  Institute Code
                </label>
                <input
                  type="text"
                  placeholder="Enter Institute Code"
                  {...register("CODE", { required: true })} // Changed from INSTITUTE_CODE
                  className="form-control input-focus"
                />
                {errors.CODE && (
                  <p className="text-danger">This field is required</p>
                )}
              </motion.div>
            </div>

            <div className="col-md-4">
              <motion.div whileHover={{ scale: 1.02 }}>
                <label className="form-label fw-semibold text-secondary">
                  Institute Name
                </label>
                <input
                  type="text"
                  placeholder="Enter Institute Name"
                  {...register("NAME", { required: true })} // Changed from INSTITUTE_NAME
                  className="form-control"
                />
                {errors.NAME && (
                  <p className="text-danger">This field is required</p>
                )}
              </motion.div>
            </div>

            <div className="col-md-4">
              <motion.div whileHover={{ scale: 1.02 }}>
                <label className="form-label fw-semibold text-secondary">
                  Address
                </label>
                <textarea
                  placeholder="Enter Address"
                  {...register("ADDRESS", { required: true })}
                  className="form-control"
                ></textarea>
                {errors.ADDRESS && (
                  <p className="text-danger">This field is required</p>
                )}
              </motion.div>
            </div>

            <div className="col-md-4">
              <motion.div whileHover={{ scale: 1.02 }}>
                <label className="form-label fw-semibold text-secondary">
                  Contact Number
                </label>
                <input
                  type="text"
                  placeholder="Enter Contact Number"
                  {...register("CONTACT_NUMBER", {
                    required: true,
                    pattern: /^[0-9]{10,15}$/,
                  })}
                  className="form-control"
                />
                {errors.CONTACT_NUMBER && (
                  <p className="text-danger">Invalid contact number</p>
                )}
              </motion.div>
            </div>

            <div className="col-md-4">
              <motion.div whileHover={{ scale: 1.02 }}>
                <label className="form-label fw-semibold text-secondary">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter Email"
                  {...register("EMAIL", { required: true })}
                  className="form-control"
                />
                {errors.EMAIL && (
                  <p className="text-danger">Valid email required</p>
                )}
              </motion.div>
            </div>

            <div className="col-md-4">
              <motion.div whileHover={{ scale: 1.02 }}>
                <label className="form-label fw-semibold text-secondary">
                  Website
                </label>
                <input
                  type="text"
                  placeholder="Enter Website URL"
                  {...register("WEBSITE")}
                  className="form-control"
                />
              </motion.div>
            </div>

            <div className="col-md-4">
              <motion.div whileHover={{ scale: 1.02 }}>
                <label className="form-label fw-semibold text-secondary">
                  Established Year
                </label>
                <select
                  {...register("ESTD_YEAR", {
                    required: true,
                    valueAsNumber: true,
                  })}
                  className="form-select"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                {errors.ESTD_YEAR && (
                  <p className="text-danger">Enter a valid year</p>
                )}
              </motion.div>
            </div>

            <div className="col-md-4">
              <motion.div whileHover={{ scale: 1.02 }}>
                <Form.Check
                  type="checkbox"
                  {...register("IS_ACTIVE")}
                  label="Is Active"
                  className="fw-semibold text-secondary"
                />
              </motion.div>
            </div>
          </div>

          <div className="col-12 text-center mt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="btn btn-primary"
            >
              Submit
            </motion.button>
          </div>
        </form>
      </motion.div>
    </Paper>
  );
}