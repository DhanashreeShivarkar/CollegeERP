import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";
import LoginModal from "./auth/LoginModal";

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

  const handleLoginSuccess = (userData: any) => {
    console.log("Home - Login successful:", userData);
    onLoginSuccess(userData);
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
    <div className="h-screen flex flex-col">
      <Navbar onLoginClick={() => setIsLoginOpen(true)} />

      <main className="flex-1 overflow-auto pt-16">
        {" "}
        {/* Added pt-16 for navbar offset */}
        {/* Hero Section - Reduced padding */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
          <div className="container mx-auto text-center px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Modern Education Management Solution
            </h1>
            <p className="text-lg md:text-xl mb-6">
              Streamline your educational institution's operations
            </p>
            <button
              onClick={() => setIsLoginOpen(true)}
              className="bg-white text-blue-600 px-6 py-2 rounded-lg font-bold hover:bg-gray-100 transition"
            >
              Get Started →
            </button>
          </div>
        </section>
        {/* Features Section - Reduced padding */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              Key Features
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
                >
                  <div className="text-3xl mb-3">{feature.icon}</div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

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
