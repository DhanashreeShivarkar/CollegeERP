import React, { useState, useEffect } from "react";
import InstituteMaster from "./InstituteMaster";
import InstituteTableView from "./InstituteTableView";

const MasterEntryPage: React.FC = () => {
  const [selectedAction, setSelectedAction] = useState<"create" | "view">("create");

  useEffect(() => {
    setSelectedAction("create"); // Set default to "create" on page load
  }, []);

  return (
    <div className="container-fluid p-4">
      <h2>Institute Master Management</h2>
      <div className="d-flex gap-3 mb-4">
        <button
          className={`btn ${selectedAction === "create" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setSelectedAction("create")}
        >
          Create Institute
        </button>
        <button
          className={`btn ${selectedAction === "view" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setSelectedAction("view")}
        >
          View Institutes
        </button>
      </div>

      {selectedAction === "create" && (
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">Institute Master</h5>
          </div>
          <div className="card-body">
            <InstituteMaster />
          </div>
        </div>
      )}

      {selectedAction === "view" && (
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">Institutes List</h5>
          </div>
          <div className="card-body">
            <InstituteTableView />
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterEntryPage;
