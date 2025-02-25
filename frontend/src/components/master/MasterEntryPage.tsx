import React, { useState } from "react";
import { useParams } from "react-router-dom";
import MasterTableList from "./MasterTableList";
import CountryEntry from "./masterPages/CountryEntry";
import StateEntry from "./masterPages/StateEntry";
import CityEntry from "./masterPages/CityEntry";
import CurrencyEntry from "./masterPages/CurrencyEntry";
import LanguageEntry from "./masterPages/LanguageEntry";
import DesignationEntry from "./masterPages/DesignationEntry";
import CategoryEntry from "./masterPages/CategoryEntry";
import MasterTableView from "./MasterTableView";
import { Paper } from "@mui/material";
import { useSettings } from "../../context/SettingsContext";

const MasterEntryPage: React.FC = () => {
  const { tableName } = useParams();
  const { darkMode } = useSettings();
  const [selectedAction, setSelectedAction] = useState<
    "create" | "update" | null
  >(null);

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
            <div className="d-flex align-items-center gap-3">
              <h2>Master Entry Management</h2>
              <div className="d-flex align-items-center gap-2">
                <div style={{ width: "250px" }}>
                  <MasterTableList />
                </div>
                {tableName && (
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
                )}
              </div>
            </div>
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
