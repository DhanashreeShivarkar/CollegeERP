import React, { useState } from "react";
import { useParams } from "react-router-dom";
import MasterTableList from "./MasterTableList";
import CountryEntry from "./masterPages/CountryEntry";
import StateEntry from "./masterPages/StateEntry"; // Add this import

const MasterEntryPage: React.FC = () => {
  const { tableName } = useParams();
  const [selectedAction, setSelectedAction] = useState<
    "create" | "update" | null
  >(null);

  const renderCreateForm = () => {
    switch (tableName?.toLowerCase()) {
      case "country":
        return <CountryEntry />;
      case "state":
        return <StateEntry />; // Add state case
      default:
        return <div>Form not implemented for {tableName}</div>;
    }
  };

  return (
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
            <div className="card">
              <div className="card-header">
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

                {selectedAction === "update" && (
                  <div>
                    <h4>
                      {tableName.charAt(0).toUpperCase() + tableName.slice(1)}{" "}
                      List
                    </h4>
                    {/* Add your update list component here */}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="alert alert-info">
              Please select a table from the dropdown above to manage its
              entries
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MasterEntryPage;
