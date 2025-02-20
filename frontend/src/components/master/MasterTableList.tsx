import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";

interface MasterTable {
  name: string;
  display_name: string;
  endpoint: string;
}

const MasterTableList: React.FC = () => {
  const [tables, setTables] = useState<MasterTable[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

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
    <div className="dropdown">
      <button
        className="btn btn-outline-primary w-100 dropdown-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        Select Table
      </button>
      {isOpen && (
        <ul className="dropdown-menu show w-100">
          {tables.map((table) => (
            <li key={table.name}>
              <button
                className="dropdown-item"
                onClick={() => handleTableSelect(table)}
              >
                {table.display_name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MasterTableList;
