import React from "react";
import { Box, Typography, AppBar, Toolbar } from "@mui/material";

const TeacherDashboard = ({ user }: any) => {
  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Teacher Dashboard</Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4">Welcome Teacher, {user.username}</Typography>
        {/* Add teacher specific features */}
      </Box>
    </Box>
  );
};

export default TeacherDashboard;
