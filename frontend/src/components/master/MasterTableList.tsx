import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import { Paper } from "@mui/material";
import { useSettings } from "../../context/SettingsContext";

interface MasterTable {
  name: string;
  display_name: string;
  endpoint: string;
}

const MasterTableList: React.FC = () => {
  const [tables, setTables] = useState<MasterTable[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { darkMode } = useSettings();

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await axios.get("/api/master/tables/");
        setTables(response.data);
      } catch (error) {
        console.error("Error fetching master tables:", error);
      }
    };
    fetchTables();
  }, []);

  const handleTableSelect = (table: MasterTable) => {
    navigate(`/dashboard/master/${table.name}`);
    setIsOpen(false);
  };

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
      <div className="dropdown">
        <button
          className={`btn ${
            darkMode ? "btn-outline-light" : "btn-outline-primary"
          } w-100 dropdown-toggle`}
          onClick={() => setIsOpen(!isOpen)}
          style={{
            backgroundColor: darkMode ? "#2d2d2d" : "",
            borderColor: darkMode ? "#404040" : "",
          }}
        >
          Select Table
        </button>
        {isOpen && (
          <ul
            className="dropdown-menu show w-100"
            style={{
              backgroundColor: darkMode ? "#2d2d2d" : "#ffffff",
              borderColor: darkMode ? "#404040" : "",
            }}
          >
            {tables.map((table) => (
              <li key={table.name}>
                <button
                  className="dropdown-item"
                  onClick={() => handleTableSelect(table)}
                  style={{
                    color: darkMode ? "#e0e0e0" : "inherit",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = darkMode
                      ? "#404040"
                      : "";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "";
                  }}
                >
                  {table.display_name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Paper>
  );
};

export default MasterTableList;
