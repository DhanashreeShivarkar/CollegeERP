import React from "react";
import { Box, Typography, AppBar, Toolbar } from "@mui/material";

const FinanceDashboard = ({ user }: any) => {
  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Finance Dashboard</Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4">Welcome Finance, {user.username}</Typography>
        {/* Add Finance specific features */}
      </Box>
    </Box>
  );
};

export default FinanceDashboard;
