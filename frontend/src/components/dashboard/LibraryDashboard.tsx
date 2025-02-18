import React from "react";
import { Box, Typography, AppBar, Toolbar } from "@mui/material";

const LibraryDashboard = ({ user }: any) => {
  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Library Dashboard</Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4">Welcome Library, {user.username}</Typography>
        {/* Add Library specific features */}
      </Box>
    </Box>
  );
};

export default LibraryDashboard;
