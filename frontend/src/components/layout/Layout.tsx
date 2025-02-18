import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  // Add empty handler since authenticated users don't need login
  const handleLoginClick = () => {
    // No-op for authenticated routes
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onLoginClick={handleLoginClick} />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 bg-gray-100 p-6">{children}</main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
