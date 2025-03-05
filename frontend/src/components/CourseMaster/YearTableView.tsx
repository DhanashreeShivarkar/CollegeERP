import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { Button, Table } from "react-bootstrap";
import { Paper } from "@mui/material";
import EditModal from "../../components/CourseMaster/Editmodal";

interface Year {
  YEAR_ID: number;
  YEAR: number;
  IS_ACTIVE: boolean;
  BRANCH_ID: number;
  BRANCH_NAME: string;
}

interface Branch {
  BRANCH_ID: number;
  BRANCH_NAME: string;
}

const YearTableView: React.FC = () => {
  const [years, setYears] = useState<Year[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingYear, setEditingYear] = useState<Year | null>(null);

  useEffect(() => {
    fetchYears();
    fetchBranches();
  }, []);

  const fetchYears = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axiosInstance.get("/api/master/year/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (Array.isArray(response.data)) {
        setYears(response.data);
      } else {
        console.error("Expected an array but received:", response.data);
      }
    } catch (error) {
      console.error("Error fetching years:", error);
    }
  };

  const fetchBranches = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axiosInstance.get("/api/master/branch/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (Array.isArray(response.data)) {
        setBranches(response.data);
      } else {
        console.error("Expected an array but received:", response.data);
      }
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };

  const handleEdit = (year: Year) => {
    setEditingYear(year);
    setShowEditModal(true);
  };

  const handleUpdate = async (updatedYear: Year) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axiosInstance.put(`/api/master/year/${updatedYear.YEAR_ID}/`, updatedYear, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setYears((prevYears) =>
        prevYears.map((year) => (year.YEAR_ID === updatedYear.YEAR_ID ? updatedYear : year))
      );

      setShowEditModal(false);
      alert("Year updated successfully!");
    } catch (error) {
      console.error("Error updating year:", error);
      alert("Failed to update year");
    }
  };

  const handleDelete = async (yearId: number) => {
    if (!window.confirm("Are you sure you want to delete this year?")) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axiosInstance.delete(`/api/master/year/${yearId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setYears((prevYears) => prevYears.filter((year) => year.YEAR_ID !== yearId));
      alert("Year deleted successfully!");
    } catch (error) {
      console.error("Error deleting year:", error);
    }
  };

  return (
    <Paper elevation={3} style={{ padding: "20px" }}>
      <h3>Year Management</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Year ID</th>
            <th>Year Name</th>
            <th>Branch ID</th>
            <th>Branch Name</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {years.map((year) => (
            <tr key={year.YEAR_ID}>
              <td>{year.YEAR_ID}</td>
              <td>{year.YEAR}</td>
              <td>{year.BRANCH_ID}</td>
              <td>{year.BRANCH_NAME}</td>
              <td>{year.IS_ACTIVE ? "Yes" : "No"}</td>
              <td>
                <Button variant="primary" onClick={() => handleEdit(year)}>Edit</Button>
                <Button variant="danger" onClick={() => handleDelete(year.YEAR_ID)} style={{ marginLeft: "10px" }}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {editingYear && (
        <EditModal
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          onSave={handleUpdate}
          data={editingYear}
          title="Edit Year"
        />
      )}
    </Paper>
  );
};

export default YearTableView;