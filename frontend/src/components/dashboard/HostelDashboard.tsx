import React from "react";
import { Box, Typography, AppBar, Toolbar } from "@mui/material";

const HostelDashboard = ({ user }: any) => {
  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Hostel Dashboard</Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4">Welcome Hostel, {user.username}</Typography>
        {/* Add Hostel specific features */}
      </Box>
    </Box>
  );
};

export default HostelDashboard;
