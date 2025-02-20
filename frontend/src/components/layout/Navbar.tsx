import React from "react";
import { useNavigate, Link } from "react-router-dom";

interface NavbarProps {
  onLoginClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onLoginClick }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <i className="bi bi-building-fill text-primary me-2"></i>
          <span className="fw-bold">SynchronikERP</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">
                Contact
              </Link>
            </li>
          </ul>

          <button className="btn btn-primary" onClick={onLoginClick}>
            <i className="bi bi-person me-2"></i>
            Login
          </button>
        </div>
      </div>
    </nav>
  );
};

interface DashboardNavbarProps {
  user: any;
  title?: string;
  onLogout?: () => void;
}

export const DashboardNavbar: React.FC<DashboardNavbarProps> = ({
  user,
  title,
  onLogout,
}) => {
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom py-1">
      <div className="container-fluid px-3">
        <span className="navbar-brand d-flex align-items-center">
          <i className="bi bi-building-fill text-primary"></i>
          <span className="ms-2 small fw-bold">SynchronikERP</span>
        </span>

        <ul className="navbar-nav ms-auto d-flex align-items-center">
          {/* Search */}
          <li className="nav-item me-3">
            <div className="input-group input-group-sm">
              <span className="input-group-text border-0 bg-light">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control form-control-sm border-0 bg-light"
                placeholder="Search..."
                style={{ maxWidth: "150px" }}
              />
            </div>
          </li>

          {/* Notifications */}
          <li className="nav-item dropdown me-2">
            <button
              className="btn btn-sm btn-link nav-link p-0 position-relative"
              data-bs-toggle="dropdown"
            >
              <i className="bi bi-bell fs-5"></i>
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                3
              </span>
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow-sm py-1">
              <li>
                <h6 className="dropdown-header">Notifications</h6>
              </li>
              <li>
                <a className="dropdown-item py-2" href="#">
                  <i className="bi bi-info-circle me-2 text-primary"></i>System
                  Update
                </a>
              </li>
              <li>
                <a className="dropdown-item py-2" href="#">
                  <i className="bi bi-exclamation-circle me-2 text-warning"></i>
                  Pending Tasks
                </a>
              </li>
              <li>
                <hr className="dropdown-divider my-1" />
              </li>
              <li>
                <a
                  className="dropdown-item small text-muted text-center"
                  href="#"
                >
                  View All
                </a>
              </li>
            </ul>
          </li>

          {/* User Menu */}
          <li className="nav-item dropdown">
            <button
              className="btn btn-sm btn-link nav-link p-0 d-flex align-items-center"
              data-bs-toggle="dropdown"
            >
              <i className="bi bi-person-circle fs-5"></i>
              <span className="ms-2 d-none d-md-inline small">
                {user?.name || "Admin"}
                <div className="small text-muted">{title}</div>
              </span>
              <i className="bi bi-chevron-down small ms-2"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow-sm py-1">
              <li>
                <span className="dropdown-item-text small text-muted ps-3">
                  Signed in as <br />
                  <strong>{user?.email}</strong>
                </span>
              </li>
              <li>
                <hr className="dropdown-divider my-1" />
              </li>
              <li>
                <a className="dropdown-item py-2" href="#">
                  <i className="bi bi-person me-2"></i>Profile
                </a>
              </li>
              <li>
                <a className="dropdown-item py-2" href="#">
                  <i className="bi bi-gear me-2"></i>Settings
                </a>
              </li>
              <li>
                <hr className="dropdown-divider my-1" />
              </li>
              <li>
                <button
                  className="dropdown-item py-2 text-danger"
                  onClick={onLogout}
                >
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Logout
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
};
