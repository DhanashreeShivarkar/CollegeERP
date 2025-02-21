import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "./layout/Navbar";
import Footer from "./layout/Footer";
import LoginModal from "./auth/LoginModal";
import { getDashboardRoute } from "../utils/roles";

interface Feature {
  title: string;
  description: string;
  icon: string;
}

interface HomeProps {
  onLoginSuccess: (userData: any) => void;
}

const Home: React.FC<HomeProps> = ({ onLoginSuccess }) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const navigate = useNavigate();

  const handleLoginSuccess = (userData: any) => {
    onLoginSuccess(userData);
    const dashboardRoute = getDashboardRoute(userData.designation.code);
    navigate(dashboardRoute);
  };

  const features: Feature[] = [
    {
      title: "Student Management",
      description:
        "Complete student lifecycle management from admission to graduation",
      icon: "👨‍🎓",
    },
    {
      title: "Faculty Portal",
      description:
        "Comprehensive tools for faculty to manage courses and students",
      icon: "👩‍🏫",
    },
    {
      title: "Administration",
      description: "Streamlined administrative tasks and reporting",
      icon: "🏛️",
    },
    {
      title: "Examination System",
      description: "End-to-end examination management and grading",
      icon: "📝",
    },
  ];

  return (
    <div className="vh-100 d-flex flex-column overflow-hidden">
      <Navbar onLoginClick={() => setIsLoginOpen(true)} />

      {/* Hero Section */}
      <section className="bg-primary text-white py-2">
        <div className="container">
          <div className="row align-items-center g-3">
            <div className="col-lg-6">
              <h1 className="display-6 fw-bold mb-2">
                Smart College Management System
              </h1>
              <p className="lead mb-3 fs-6">
                Streamline your educational institution with our comprehensive
                ERP solution
              </p>
              <button
                className="btn btn-light px-4"
                onClick={() => setIsLoginOpen(true)}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-3 bg-light flex-grow-1">
        <div className="container">
          <div className="text-center mb-3">
            <h2 className="h4 fw-bold mb-1">Key Features</h2>
            <p className="text-muted small mb-3">
              Manage your institution efficiently
            </p>
          </div>
          <div className="row g-3">
            {features.map((feature, index) => (
              <div key={index} className="col-sm-6 col-lg-3">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body p-3 text-center">
                    <div className="h4 mb-2">{feature.icon}</div>
                    <h3 className="h6 fw-bold mb-1">{feature.title}</h3>
                    <p className="card-text text-muted small mb-0">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <LoginModal
        open={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default Home;
