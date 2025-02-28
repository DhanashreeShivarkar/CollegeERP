import React from "react";
import { Link, useLocation } from "react-router-dom";
import MasterTableList from "../master/MasterTableList";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const menuItems = [
    { icon: "bi-speedometer2", text: "Dashboard", path: "/dashboard/home" },
    {
      icon: "bi-database-fill",
      text: "Master Entry",
      path: "/dashboard/master",
    },
    {
      icon: "bi-gear-fill",
      text: "System Settings",
      path: "/dashboard/settings",
    },
    {
      icon: "bi-building",
      text: "Master University",
      path: "/dashboard/master/university",
    },
    {
      icon: "bi-building",
      text: "Master Institute",
      path: "/dashboard/master/institute",
    },
    {
      icon: "bi-building",
      text: "Academic Year Master",
      path: "/dashboard/master/academic",
    },
    { icon: "bi-shield-lock", text: "Roles & Permissions", path: "/roles" },
    { icon: "bi-sliders", text: "Configuration", path: "/config" },
    { icon: "bi-person-lines-fill", text: "User Management", path: "/users" },
    { icon: "bi-clock-history", text: "Audit Logs", path: "/audit" },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div
      className="bg-light border-end transition-width"
      style={{ width: isOpen ? "250px" : "50px" }}
    >
      {/* Sidebar Header */}
      <div className="p-3 border-bottom bg-white d-flex align-items-center">
        <button
          className="btn btn-link p-0 me-2 text-primary"
          onClick={() => setIsOpen(!isOpen)}
        >
          <i
            className={`bi ${isOpen ? "bi-chevron-left" : "bi-chevron-right"}`}
          ></i>
        </button>
        {isOpen && (
          <h5 className="mb-0 text-primary d-flex align-items-center">
            <i className="bi bi-grid-fill me-2"></i>
            Admin Portal
          </h5>
        )}
      </div>

      {/* Sidebar Menu */}
      <div className="p-2">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`
              d-flex align-items-center text-decoration-none p-2 mb-1 rounded
              ${
                isActive(item.path)
                  ? "bg-primary text-white"
                  : "text-secondary hover-bg-light-primary"
              }
            `}
            title={!isOpen ? item.text : ""}
          >
            <i className={`${item.icon} ${isOpen ? "me-2" : ""}`}></i>
            {isOpen && <span className="small">{item.text}</span>}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
