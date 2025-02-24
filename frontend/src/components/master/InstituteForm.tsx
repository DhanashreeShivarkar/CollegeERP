import { useForm, SubmitHandler } from "react-hook-form";
import { motion } from "framer-motion";
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from "react";

interface InstituteFormInputs {
  INSTITUTE_ID: number;
  UNIVERSITY_ID: number;
  INSTITUTE_NAME: string;
  ADDRESS: string;
  CONTACT_NUMBER: string;
  EMAIL: string;
  WEBSITE?: string;
  ESTD_YEAR: number;
  INSTITUTE_CODE: string;

}

export default function InstituteForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InstituteFormInputs>();

  const [universities, setUniversities] = useState([]);

  useEffect(() => {
    fetch("/api/universities")
      .then((response) => response.json())
      .then((data) => setUniversities(data))
      .catch((error) => console.error("Error fetching universities:", error));
  }, []);
  

  const onSubmit: SubmitHandler<InstituteFormInputs> = async (data) => {
    try {
      const response = await fetch("/api/create-institute/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Institute created successfully!");
      } else {
        const errorData = await response.json();
        alert(`Error: ${JSON.stringify(errorData)}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from(new Array(225), (_, index) => currentYear - index);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container my-5 p-4 bg-light shadow rounded"
    >
      <h2 className="text-center mb-4">
        Institute Registration Form
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-6"
      >
<div className="row g-3">
  <div className="col-md-4">
  <motion.div whileHover={{ scale: 1.02 }}>
  <label className="form-label fw-semibold text-secondary">University</label>
  <select
    {...register("UNIVERSITY_ID", { required: true, valueAsNumber: true })}
    className="form-control input-focus"
    defaultValue=""
  >
    <option value="" disabled>Select University</option>
    <option value="1">University A</option>
    {/* Add more options as needed */}
  </select>
  {errors.UNIVERSITY_ID && <p className="text-danger">This field is required</p>}
</motion.div>
</div>

  <div className="col-md-4">
    <motion.div whileHover={{ scale: 1.02 }}>
      <label className="form-label fw-semibold text-secondary">Institute Code</label>
      <input
        type="text"
        placeholder="Enter Institute Code"
        {...register("INSTITUTE_CODE", { required: true })}
        className="form-control input-focus"
      />
      {errors.INSTITUTE_CODE && <p className="text-danger">This field is required</p>}
    </motion.div>
  </div>

  <div className="col-md-4">
    <motion.div whileHover={{ scale: 1.02 }}>
      <label className="form-label fw-semibold text-secondary">Institute Name</label>
      <input
        type="text"
        placeholder="Enter Institute Name"
        {...register("INSTITUTE_NAME", { required: true })}
        className="form-control"
      />
      {errors.INSTITUTE_NAME && (
        <p className="text-danger">This field is required</p>
      )}
    </motion.div>
  </div>

  <div className="col-md-4">
    <motion.div whileHover={{ scale: 1.02 }}>
      <label className="form-label fw-semibold text-secondary">Address</label>
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
      <label className="fform-label fw-semibold text-secondary">Contact Number</label>
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
      <label className="form-label fw-semibold text-secondary">Email</label>
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
      <label className="form-label fw-semibold text-secondary">Website</label>
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
      <label className="form-label fw-semibold text-secondary">Established Year</label>
      <select
        {...register("ESTD_YEAR", { required: true, valueAsNumber: true })}
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
</div>

        <div className="col-12 text-center">
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
  );
}
