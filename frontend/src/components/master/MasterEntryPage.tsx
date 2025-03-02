import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MasterTableList from "./MasterTableList";
import CountryEntry from "./masterPages/CountryEntry";
import StateEntry from "./masterPages/StateEntry";
import CityEntry from "./masterPages/CityEntry";
import CurrencyEntry from "./masterPages/CurrencyEntry";
import LanguageEntry from "./masterPages/LanguageEntry";
import DesignationEntry from "./masterPages/DesignationEntry";
import CategoryEntry from "./masterPages/CategoryEntry";
import MasterTableView from "./MasterTableView";
import { Paper, Select, MenuItem, FormControl } from "@mui/material";
import { useSettings } from "../../context/SettingsContext";
import DepartmentEntry from "./masterPages/DepartmentEntry";

const MasterEntryPage: React.FC = () => {
  const { tableName } = useParams();
  const { darkMode } = useSettings();
  const [selectedAction, setSelectedAction] = useState<
    "create" | "update" | null
  >(null);
  const [selectedTable, setSelectedTable] = useState<string>("");
  const navigate = useNavigate();

  const tables = [
    { name: "country", display: "Country" },
    { name: "state", display: "State" },
    { name: "city", display: "City" },
    { name: "currency", display: "Currency" },
    { name: "language", display: "Language" },
    { name: "designation", display: "Designation" },
    { name: "department", display: "Department" },
    { name: "category", display: "Category" },
  ];

  const handleTableChange = (value: string) => {
    setSelectedTable(value);
    // Update to use relative path
    navigate(`${value}`);
  };

  const renderCreateForm = () => {
    switch (tableName?.toLowerCase()) {
      case "country":
        return <CountryEntry />;
      case "state":
        return <StateEntry />;
      case "city":
        return <CityEntry />;
      case "currency":
        return <CurrencyEntry />;
      case "language":
        return <LanguageEntry />;
      case "designation":
        return <DesignationEntry />;
      case "department":
        return <DepartmentEntry />;
      case "category":
        return <CategoryEntry />;
      default:
        return <div>Form not implemented for {tableName}</div>;
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        backgroundColor: (theme) =>
          theme.palette.mode === "dark" ? "#1a1a1a" : "#ffffff",
        color: (theme) => theme.palette.text.primary,
        minHeight: "100%",
      }}
    >
      <div className="container-fluid p-4">
        <div className="row">
          <div className="col-12 mb-4">
            <div className="d-flex justify-content-between align-items-center">
              <h2>Master Entry Management</h2>
              <FormControl sx={{ minWidth: 200 }}>
                <Select
                  value={tableName || ""}
                  onChange={(e) => handleTableChange(e.target.value)}
                  displayEmpty
                  variant="standard"
                  sx={{
                    "& .MuiSelect-select": {
                      backgroundColor: "transparent",
                      boxShadow: "none",
                      "&:focus": {
                        backgroundColor: "transparent",
                      },
                    },
                    "& .MuiInput-underline:before": {
                      borderBottomColor: "rgba(0, 0, 0, 0.12)",
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    Select Master Table
                  </MenuItem>
                  {tables.map((table) => (
                    <MenuItem key={table.name} value={table.name}>
                      {table.display}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {tableName && (
              <div className="mt-3 d-flex justify-content-center">
                <div className="btn-group">
                  <button
                    className={`btn ${
                      selectedAction === "create"
                        ? "btn-primary"
                        : "btn-outline-primary"
                    }`}
                    onClick={() => setSelectedAction("create")}
                  >
                    Create New Entry
                  </button>
                  <button
                    className={`btn ${
                      selectedAction === "update"
                        ? "btn-primary"
                        : "btn-outline-primary"
                    }`}
                    onClick={() => setSelectedAction("update")}
                  >
                    Update Entries
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="col-12">
            {tableName ? (
              <Paper
                elevation={2}
                sx={{
                  backgroundColor: (theme) =>
                    theme.palette.mode === "dark" ? "#2d2d2d" : "#ffffff",
                  color: (theme) => theme.palette.text.primary,
                }}
              >
                <div
                  className={`card ${darkMode ? "bg-dark text-light" : ""}`}
                  style={{ backgroundColor: "transparent" }}
                >
                  <div
                    className={`card-header ${
                      darkMode ? "border-secondary" : ""
                    }`}
                  >
                    <h5 className="card-title mb-0">
                      {tableName.charAt(0).toUpperCase() + tableName.slice(1)}{" "}
                      Management
                    </h5>
                  </div>
                  <div className="card-body">
                    {!selectedAction && (
                      <div className="alert alert-info">
                        Please select an action (Create or Update) to proceed
                      </div>
                    )}

                    {selectedAction === "create" && renderCreateForm()}

                    {selectedAction === "update" && tableName && (
                      <MasterTableView tableName={tableName} />
                    )}
                  </div>
                </div>
              </Paper>
            ) : (
              <div
                className={`alert ${
                  darkMode ? "alert-secondary" : "alert-info"
                }`}
              >
                Please select a table from the dropdown above to manage its
                entries
              </div>
            )}
          </div>
        </div>
      </div>
    </Paper>
  );
};

export default MasterEntryPage;
