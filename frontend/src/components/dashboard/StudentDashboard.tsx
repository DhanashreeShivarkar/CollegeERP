import React from "react";
import { Box, Typography, AppBar, Toolbar } from "@mui/material";

const StudentDashboard = ({ user }: any) => {
  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Student Dashboard</Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4">Welcome Student, {user.username}</Typography>
        {/* Add student specific features */}
      </Box>
    </Box>
  );
};

export default StudentDashboard;
