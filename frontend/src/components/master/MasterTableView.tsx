import React, { useState, useEffect } from "react";
import { Table, Button, Form, Row, Col } from "react-bootstrap";
import axiosInstance from "../../api/axios";
import { useNavigate } from "react-router-dom";
import EditModal from "./EditModal";
import { Paper } from "@mui/material";
import { useSettings } from "../../context/SettingsContext";

interface MasterData {
  [key: string]: any;
}

interface MasterTableViewProps {
  tableName: string;
}

const getEndpointName = (tableName: string): string => {
  // Handle irregular plurals
  const irregularPlurals: { [key: string]: string } = {
    country: "countries",
    city: "cities",
    currency: "currencies",
    category: "categories",
  };

  return irregularPlurals[tableName.toLowerCase()] || `${tableName}s`;
};

const MasterTableView: React.FC<MasterTableViewProps> = ({ tableName }) => {
  const navigate = useNavigate();
  const { darkMode } = useSettings();
  const [data, setData] = useState<MasterData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MasterData | null>(null);
  const [relatedData, setRelatedData] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
    fetchRelatedData();
  }, [tableName]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const endpoint = getEndpointName(tableName);
      const response = await axiosInstance.get(`/api/master/${endpoint}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(response.data);
      setLoading(false);
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.response?.data?.message || "Failed to fetch data");
      if (err.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  const fetchRelatedData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (tableName === "state") {
        const response = await axiosInstance.get("/api/master/countries/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRelatedData(response.data);
      } else if (tableName === "city") {
        const response = await axiosInstance.get("/api/master/states/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRelatedData(response.data);
      }
    } catch (err) {
      console.error("Error fetching related data:", err);
    }
  };

  const handleDelete = async (ids: string[]) => {
    if (!window.confirm("Are you sure you want to delete selected items?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const endpoint = getEndpointName(tableName);
      await Promise.all(
        ids.map((id) =>
          axiosInstance.delete(`/api/master/${endpoint}/${id}/`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        )
      );

      // Refresh data
      fetchData();
      setSelectedItems([]);
      setSelectAll(false);
      alert("Selected items deleted successfully!");
    } catch (err: any) {
      console.error("Error deleting items:", err);
      alert(err.response?.data?.message || "Failed to delete items");
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectAll(e.target.checked);
    if (e.target.checked) {
      setSelectedItems(
        data.map((item) => item[`${tableName.toUpperCase()}_ID`])
      );
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelect = (id: string) => {
    setSelectedItems((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      return [...prev, id];
    });
  };

  const handleEdit = (item: MasterData) => {
    setEditingItem(item);
    setShowEditModal(true);
  };

  const handleUpdate = async (updatedData: MasterData) => {
    try {
      const token = localStorage.getItem("token");
      const endpoint = getEndpointName(tableName);
      const id = updatedData[`${tableName.toUpperCase()}_ID`];

      const response = await axiosInstance.put(
        `/api/master/${endpoint}/${id}/`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setShowEditModal(false);
        fetchData(); // Refresh the data
        alert(`${tableName} updated successfully!`);
      }
    } catch (err: any) {
      console.error("Error updating item:", err);
      alert(err.response?.data?.message || `Failed to update ${tableName}`);
    }
  };

  const getColumnHeaders = () => {
    if (data.length === 0) return [];
    const item = data[0];
    return Object.keys(item).filter(
      (key) =>
        !["CREATED_BY", "UPDATED_BY", "CREATED_AT", "UPDATED_AT"].includes(key)
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        backgroundColor: (theme) =>
          theme.palette.mode === "dark" ? "#1a1a1a" : "#ffffff",
        color: (theme) => theme.palette.text.primary,
      }}
    >
      <div className="d-flex justify-content-between mb-3">
        <h4>{tableName.charAt(0).toUpperCase() + tableName.slice(1)} List</h4>
        {selectedItems.length > 0 && (
          <Button variant="danger" onClick={() => handleDelete(selectedItems)}>
            Delete Selected ({selectedItems.length})
          </Button>
        )}
      </div>

      <Table
        striped
        bordered
        hover
        responsive
        className={darkMode ? "table-dark" : ""}
      >
        <thead>
          <tr>
            <th>
              <Form.Check
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                style={{
                  backgroundColor: darkMode ? "#2d2d2d" : "",
                  color: darkMode ? "#e0e0e0" : "",
                }}
              />
            </th>
            {getColumnHeaders().map((header) => (
              <th
                key={header}
                style={{
                  backgroundColor: darkMode ? "#2d2d2d" : "",
                  color: darkMode ? "#e0e0e0" : "",
                }}
              >
                {header.replace(/_/g, " ")}
              </th>
            ))}
            <th
              style={{
                backgroundColor: darkMode ? "#2d2d2d" : "",
                color: darkMode ? "#e0e0e0" : "",
              }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={item[`${tableName.toUpperCase()}_ID`]}
              style={{
                backgroundColor: darkMode ? "#1e1e1e" : "",
                color: darkMode ? "#e0e0e0" : "",
              }}
            >
              <td>
                <Form.Check
                  type="checkbox"
                  checked={selectedItems.includes(
                    item[`${tableName.toUpperCase()}_ID`]
                  )}
                  onChange={() =>
                    handleSelect(item[`${tableName.toUpperCase()}_ID`])
                  }
                />
              </td>
              {getColumnHeaders().map((header) => (
                <td key={header}>{String(item[header])}</td>
              ))}
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEdit(item)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() =>
                    handleDelete([item[`${tableName.toUpperCase()}_ID`]])
                  }
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {editingItem && (
        <EditModal
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          onSave={handleUpdate}
          data={editingItem}
          tableName={tableName}
          relatedData={relatedData}
        />
      )}
    </Paper>
  );
};

export default MasterTableView;
