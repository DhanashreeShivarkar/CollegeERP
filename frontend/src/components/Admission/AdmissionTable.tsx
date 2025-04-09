import React, { useState } from "react";
import { Paper } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Import forms and tables
import CasteEntryForm from "./pages/CasteEntryForm";
import MasterTableView from "./MasterTableView";
import QuotaEntryForm from "./pages/QuotaEntryForm";
import AdmissionQuotaEntryForm from "./pages/AdmissionQuotaEntryForm";
import { TableView } from "@mui/icons-material";
import ChecklistDocument from "./pages/CheckListDocumentEntryForm";
import CheckListDocumentEntryForm from "./pages/CheckListDocumentEntryForm";



const MasterEntryForm = () => {
  const [selectedForm, setSelectedForm] = useState<string>("caste"); // Default selection
  const [selectedAction, setSelectedAction] = useState<"create" | "view">("create");
  const navigate = useNavigate();

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-center mb-4">Master Entry Form</h2>

        {/* Dropdown to Select Entry Type */}
        <select onChange={(e) => setSelectedForm(e.target.value)} className="form-control mb-3">
          <option value="caste">Caste</option>
          <option value="quota">Quota</option>
          <option value="admission_quota">Admission Quota</option> 
          <option value="check_list_documents">Check List Documents</option> 
        </select>

        {/* Create / View Buttons */}
        <div className="d-flex justify-content-center gap-2">
          <button
            className={`btn ${selectedAction === "create" ? "btn-primary" : "btn-outline-primary"} btn-sm`}
            onClick={() => setSelectedAction("create")}
          >
            Create {selectedForm.replace("_", " ").charAt(0).toUpperCase() + selectedForm.slice(1)}
          </button>
          <button
            className={`btn ${selectedAction === "view" ? "btn-primary" : "btn-outline-primary"} btn-sm`}
            onClick={() => setSelectedAction("view")}
          >
            View {selectedForm.replace("_", " ").charAt(0).toUpperCase() + selectedForm.slice(1)}
          </button>
        </div>

        {/* Dynamic Rendering of Forms */}
        {selectedAction === "create" && (
          <div className="card mt-3">
            <div className="card-header py-2">
              <h6 className="mb-0">{selectedForm.replace("_", " ").charAt(0).toUpperCase() + selectedForm.slice(1)} Master</h6>
            </div>
            <div className="card-body p-2">
              {selectedForm === "caste" && <CasteEntryForm />}
               {selectedForm === "quota" && <QuotaEntryForm />}
              {selectedForm === "admission_quota" && <AdmissionQuotaEntryForm />} 
              {selectedForm === "check_list_documents" && <CheckListDocumentEntryForm />} 
            </div>
          </div>
        )}

        {/* Dynamic Rendering of Tables */}
        {selectedAction === "view" && (
          <div className="card mt-3">
            <div className="card-header py-2 d-flex justify-content-between align-items-center">
              <h6 className="mb-0">{selectedForm.replace("_", " ").charAt(0).toUpperCase() + selectedForm.slice(1)} List</h6>
            </div>
            <div className="card-body p-2">
              {selectedForm === "caste" && <MasterTableView masterType={"caste"} />}
                {selectedForm === "quota" && <MasterTableView masterType={"quota"} />} 
              {selectedForm === "admission_quota" && <MasterTableView masterType={"admission"} />} 
              {selectedForm ==="check_list_documents" && <MasterTableView masterType={"checklist"} />} 
            </div>
          </div>
        )}
      </motion.div>
    </Paper>
  );
};

export default MasterEntryForm;