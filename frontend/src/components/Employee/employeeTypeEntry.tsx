import React, { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import TypeEntry from "./pages/TypeEntry";
import StatusEntry from "./pages/StatusEntry";
import ShiftEntry from "./pages/ShiftEntry";
import { getEmployeeMasterTables } from "../../api/establishmentService";

const EmployeeTypeEntry: React.FC = () => {
  const [masterTables, setMasterTables] = useState<any[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Update component map to match exact table names from your Django models
  const componentMap = {
    TYPE_MASTER: TypeEntry,
    STATUS_MASTER: StatusEntry,
    SHIFT_MASTER: ShiftEntry,
  };

  useEffect(() => {
    const fetchMasterTables = async () => {
      try {
        setLoading(true);
        const data = await getEmployeeMasterTables();
        // Ensure the table names match exactly with your Django model names
        setMasterTables([
          { name: "TYPE_MASTER", display_name: "Type Master" },
          { name: "STATUS_MASTER", display_name: "Status Master" },
          { name: "SHIFT_MASTER", display_name: "Shift Master" },
        ]);
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to fetch master tables");
      } finally {
        setLoading(false);
      }
    };

    fetchMasterTables();
  }, []);

  const handleTableChange = (event: SelectChangeEvent<string>) => {
    setSelectedTable(event.target.value);
  };

  // Get the component based on selected table
  const RenderComponent = selectedTable
    ? componentMap[selectedTable as keyof typeof componentMap]
    : null;

  console.log("Selected Table:", selectedTable); // Debug log
  console.log("Component to render:", RenderComponent); // Debug log

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Employee Master Entry</h2>
        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel>Select Master Table</InputLabel>
          <Select
            value={selectedTable}
            label="Select Master Table"
            onChange={handleTableChange}
          >
            {masterTables.map((table) => (
              <MenuItem key={table.name} value={table.name}>
                {table.display_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {/* Render the selected component and pass necessary props */}
      {RenderComponent && <RenderComponent tableName={selectedTable} />}
    </div>
  );
};

export default EmployeeTypeEntry;
