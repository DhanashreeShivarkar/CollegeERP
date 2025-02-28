import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios";

interface Program {
  PROGRAM_ID: number;
  NAME: string;
}

const ProgramList: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await axiosInstance.get("/api/master/program/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) setPrograms(response.data);
    } catch (error) {
      console.error("Error fetching programs:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Program List</h2>
      <ul>
        {programs.map((program) => (
          <li key={program.PROGRAM_ID}>
            {program.NAME}{" "}
            <button onClick={() => navigate(`/edit-program/${program.PROGRAM_ID}`)}>Edit</button>
            <button onClick={() => console.log("Delete logic here")}>Delete</button>
          </li>
        ))}
      </ul>
      <button className="btn btn-primary mt-3" onClick={() => navigate(-1)}>Back</button>
    </div>
  );
};

export default ProgramList;
