import React, { useState, useEffect } from "react";
import axios from "axios";
import axiosInstance from "../../../api/axios";

interface Program {
  id: number;
  name: string;
}

const BranchForm: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [formData, setFormData] = useState({
    PROGRAM: "",
    NAME: "",
    CODE: "",
    DESCRIPTION: "",
    IS_ACTIVE: true,
  });

  useEffect(() => {
    // Fetch programs to populate dropdown
    axios.get("/api/master/program/")
      .then((response) => setPrograms(response.data))
      .catch((error) => console.error("Error fetching programs:", error));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/master/branch/", formData);
      alert("Branch Created Successfully!");
      setFormData({ PROGRAM: "", NAME: "", CODE: "", DESCRIPTION: "", IS_ACTIVE: true });
    } catch (error) {
      console.error("Error creating branch:", error);
      alert("Failed to create branch.");
    }
  };

  return (
    <div className="container">
      <h2 className="mb-3">Create Branch</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Program</label>
          <select name="PROGRAM" className="form-control" value={formData.PROGRAM} onChange={handleChange} required>
            <option value="">Select Program</option>
            {programs.map((program) => (
              <option key={program.id} value={program.name}>{program.id}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Branch Name</label>
          <input type="text" name="NAME" className="form-control" value={formData.NAME} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Branch Code</label>
          <input type="text" name="CODE" className="form-control" value={formData.CODE} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea name="DESCRIPTION" className="form-control" value={formData.DESCRIPTION} onChange={handleChange} />
        </div>

        <div className="form-check mb-3">
          <input type="checkbox" className="form-check-input" id="isActive" name="IS_ACTIVE" checked={formData.IS_ACTIVE} onChange={handleChange} />
          <label className="form-check-label" htmlFor="isActive">Active</label>
        </div>

        <button type="submit" className="btn btn-primary">Create Branch</button>
      </form>
    </div>
  );
};

export default BranchForm;
