import React, { useState } from "react";
import Footer from "../layout/Footer";

interface MenuItem {
  icon: string | React.ReactNode;
  text: string;
  onClick: () => void;
  subItems?: Array<{
    icon: string | React.ReactNode;
    text: string;
    path?: string;
    onClick?: () => void;
  }>;
}

interface DashboardTemplateProps {
  title: string;
  user: any;
  menuItems: MenuItem[];
  children: React.ReactNode;
}

const DashboardTemplate = ({
  title,
  user,
  menuItems,
  children,
}: DashboardTemplateProps) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const renderIcon = (icon: string | React.ReactNode) => {
    if (typeof icon === "string") {
      return <i className={`bi ${icon}`}></i>;
    }
    return icon;
  };

  return (
    <div className="min-vh-100 d-flex overflow-hidden">
      {/* Sidebar */}
      <div
        className={`bg-dark text-white ${
          isSidebarCollapsed ? "sidebar-collapsed" : "sidebar-expanded"
        }`}
        style={{
          width: isSidebarCollapsed ? "60px" : "240px",
          transition: "width 0.3s ease",
        }}
      >
        <div className="d-flex flex-column h-100">
          {/* Sidebar Header */}
          <div className="p-3 border-bottom border-secondary">
            <div className="d-flex align-items-center">
              <i className="bi bi-building-fill fs-4"></i>
              {!isSidebarCollapsed && (
                <span className="ms-2 fw-bold">College ERP</span>
              )}
            </div>
          </div>

          {/* Toggle Button */}
          <button
            className="btn btn-link text-white border-0 p-3"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          >
            <i
              className={`bi bi-chevron-${
                isSidebarCollapsed ? "right" : "left"
              }`}
            ></i>
          </button>

          {/* Menu Items */}
          <div className="flex-grow-1 overflow-auto">
            {menuItems.map((item, index) => (
              <button
                key={index}
                className="btn btn-dark text-start rounded-0 w-100 p-3 border-0"
                onClick={item.onClick}
              >
                <span className="me-2">{renderIcon(item.icon)}</span>
                {!isSidebarCollapsed && <span>{item.text}</span>}
              </button>
            ))}
          </div>

          {/* User Info */}
          <div className="p-3 border-top border-secondary">
            <div className="d-flex align-items-center">
              <i className="bi bi-person-circle fs-4"></i>
              {!isSidebarCollapsed && (
                <div className="ms-2">
                  <div className="fw-bold">{user?.name || "User"}</div>
                  <small className="text-muted">
                    {user?.designation?.name || "Role"}
                  </small>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 d-flex flex-column bg-light overflow-hidden">
        <div className="flex-grow-1 overflow-hidden">{children}</div>
        <Footer />
      </div>
    </div>
  );
};

export default DashboardTemplate;
