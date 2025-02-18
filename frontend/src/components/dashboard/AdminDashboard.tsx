import React from "react";
import DashboardTemplate from "./DashboardTemplate";
import { Box, Typography } from "@mui/material";

const AdminDashboard: React.FC<{ user: any }> = ({ user }) => {
  return (
    <DashboardTemplate
      title="Admin Dashboard"
      user={user}
      menuItems={
        [
          // ...your menu items...
        ]
      }
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h4">Welcome Admin, {user.username}</Typography>
        {/* Add admin specific features */}
      </Box>
    </DashboardTemplate>
  );
};

export default AdminDashboard;
