import React from "react";
import { Link, useLocation } from "react-router-dom";
import MasterTableList from "../master/MasterTableList";
import { useTheme as useMUITheme } from "@mui/material/styles";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const theme = useMUITheme();

  const menuItems = [
    { icon: "bi-speedometer2", text: "Dashboard", path: "/dashboard/home" },
    {
      icon: "bi-database-fill",
      text: "Master Entry",
      path: "/dashboard/master",
      exact: true, // Add this to ensure exact match
    },
    {
      icon: "bi-building",
      text: "University",
      path: "/dashboard/master/university",
      exact: true, // Add this to ensure exact match
    },
    {
      icon: "bi-mortarboard",
      text: "Institute",
      path: "/dashboard/master/institute",
      exact: true, // Add this to ensure exact match
    },
    {
      icon: "bi-gear-fill",
      text: "System Settings",
      path: "/dashboard/settings",
    },
    {
      icon: "bi-building",
      text: "Institutions",
      path: "/dashboard/institutions",
    },
    { icon: "bi-shield-lock", text: "Roles & Permissions", path: "/roles" },
    { icon: "bi-sliders", text: "Configuration", path: "/config" },
    { icon: "bi-person-lines-fill", text: "User Management", path: "/users" },
    { icon: "bi-clock-history", text: "Audit Logs", path: "/audit" },
  ];

  // Update isActive to check for exact matches
  const isActive = (path: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div
      className={`border-end transition-width`}
      style={{
        width: isOpen ? "250px" : "50px",
        backgroundColor: theme.palette.background.paper,
        borderColor: theme.palette.divider,
      }}
    >
      {/* Sidebar Header */}
      <div
        className="p-3 border-bottom d-flex align-items-center"
        style={{
          backgroundColor: theme.palette.background.paper,
          borderColor: theme.palette.divider,
        }}
      >
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
              ${isActive(item.path, item.exact) ? "bg-primary text-white" : ""}
            `}
            style={{
              color: isActive(item.path, item.exact)
                ? theme.palette.primary.contrastText
                : theme.palette.text.secondary,
              backgroundColor: isActive(item.path, item.exact)
                ? theme.palette.primary.main
                : "transparent",
              transition: "background-color 0.3s",
            }}
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
