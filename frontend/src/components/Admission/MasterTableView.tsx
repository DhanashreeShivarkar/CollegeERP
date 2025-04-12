import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { Button, Table } from "react-bootstrap"; // React-Bootstrap Components
import { Paper } from "@mui/material"; // MUI Component
import EditModal from "./EditModal"; // Ensure this path is correct

interface MasterTableViewProps {
  masterType: string;
}

const MasterTableView: React.FC<MasterTableViewProps> = ({ masterType }) => {
  interface DataItem {
    id: number;
    NAME: string;
  }

  const [dataList, setDataList] = useState<DataItem[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DataItem | null>(null);

  useEffect(() => {
    fetchData();
  }, [masterType]);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`api/master/${masterType}/`);
      setDataList(
        response.data.map((item: any) => ({
          id: item.CASTE_ID || item.QUOTA_ID || item.ADMN_QUOTA_ID  || item.RECORD_ID || item.id, // Adjust based on API response
          NAME: item.NAME,
        }))
      );
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Error fetching data!");
    }
  };

  const handleDelete = async (id?: number) => {
    if (!id) {
      console.error("Invalid ID:", id);
      alert("Error: Invalid ID!");
      return;
    }

    let endpoint = `api/master/${masterType}/${id}/`;

    try {
      await axiosInstance.delete(endpoint);
      setDataList((prevData) => prevData.filter((item) => item.id !== id));
      alert("Data deleted successfully!");
    } catch (error) {
      console.error("Error deleting data:", error);
      alert("Error deleting data!");
    }
  };

  const handleEdit = (item: DataItem) => {
    setSelectedItem(item);
    setEditModalOpen(true);
  };

  return (
    <Paper elevation={3} style={{ padding: "20px", borderRadius: "10px" }}>
      <h3 style={{ textAlign: "center", marginBottom: "16px" }}>
        {masterType.charAt(0).toUpperCase() + masterType.slice(1)} List
      </h3>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {dataList.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.NAME}</td>
              <td>
                <Button variant="primary" size="sm" onClick={() => handleEdit(item)}>
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(item.id)}
                  className="ms-2"
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Edit Modal */}
      {selectedItem && (
        <EditModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          masterType={masterType}
          id={selectedItem.id}
          initialData={selectedItem}
          refreshData={fetchData}
        />
      )}
    </Paper>
  );
};

export default MasterTableView;
