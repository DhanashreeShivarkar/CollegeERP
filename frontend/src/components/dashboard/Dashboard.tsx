import React from "react";
import AdminDashboard from "./AdminDashboard";
import TeacherDashboard from "./TeacherDashboard";
import StudentDashboard from "./StudentDashboard";

interface DashboardProps {
  user: {
    user_id: string;
    username: string;
    email: string;
    designation: string;
    permissions: any;
  };
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const renderDashboard = () => {
    switch (user.designation?.toUpperCase()) {
      case "ADMIN":
      case "SUPERADMIN":
        return <AdminDashboard user={user} />;
      case "TEACHER":
        return <TeacherDashboard user={user} />;
      case "STUDENT":
        return <StudentDashboard user={user} />;
      default:
        return <div>Access Denied: Unknown role {user.designation}</div>;
    }
  };

  return renderDashboard();
};

export default Dashboard;
