import React, { useState } from "react";
import { Navbar } from "./Navbar"; // Changed to named import
import Sidebar from "./Sidebar";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLoginClick = () => {
    // No-op for authenticated routes
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onLoginClick={handleLoginClick} />
      <div className="flex flex-1">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <main className="flex-1 bg-gray-100 p-6">{children}</main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
