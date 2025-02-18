import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";
import LoginModal from "./auth/LoginModal";
import { authService } from "../api/auth";
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>("");
  const navigate = useNavigate();

  const handleLoginSuccess = (userData: any) => {
    console.log("Home - Login successful:", userData);
    onLoginSuccess(userData);
  };

  const handleOtpVerify = async (otp: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authService.verifyOtp(userId, otp);

      if (response.user) {
        onLoginSuccess(response.user);
        const dashboardRoute = getDashboardRoute(
          response.user.designation.code
        );
        navigate(dashboardRoute);
      } else {
        setError("Invalid OTP verification response");
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "OTP verification failed");
    } finally {
      setIsLoading(false);
    }
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
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
          {/* ...existing hero section JSX... */}
        </section>
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
