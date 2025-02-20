import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MasterTableList from "./MasterTableList";

const MasterEntryPage: React.FC = () => {
  const { tableName } = useParams();

  return (
    <div className="container-fluid p-4">
      <div className="row">
        <div className="col-12 mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <h2>Master Entry Management</h2>
            <div style={{ width: "250px" }}>
              <MasterTableList />
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
                {/* Table content will be added here */}
                <p>Selected table: {tableName}</p>
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
