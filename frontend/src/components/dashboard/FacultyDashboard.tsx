import React from "react";
import { Grid, Paper, Typography, Box, Button } from "@mui/material";
import {
  Class,
  Assessment,
  Assignment,
  Schedule,
  People,
  Dashboard as DashIcon,
} from "@mui/icons-material";
import { DashboardProps } from "../../types/dashboard";
import DashboardTemplate from "./DashboardTemplate";

const FacultyDashboard: React.FC<DashboardProps> = ({ user }) => {
  const menuItems = [
    { icon: <DashIcon />, text: "Overview", onClick: () => {} },
    { icon: <Class />, text: "Classes", onClick: () => {} },
    { icon: <Assessment />, text: "Marks", onClick: () => {} },
    { icon: <Schedule />, text: "Schedule", onClick: () => {} },
  ];

  const quickActions = [
    { text: "Take Attendance", icon: <People />, color: "#1976d2" },
    { text: "Upload Marks", icon: <Assessment />, color: "#2e7d32" },
    { text: "Create Assignment", icon: <Assignment />, color: "#ed6c02" },
    { text: "View Schedule", icon: <Schedule />, color: "#9c27b0" },
  ];

  return (
    <DashboardTemplate
      title="Faculty Dashboard"
      user={user}
      menuItems={menuItems}
    >
      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {quickActions.map((action, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    cursor: "pointer",
                    transition: "0.3s",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: 3,
                    },
                  }}
                >
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: "50%",
                      bgcolor: `${action.color}20`,
                      color: action.color,
                      mb: 1,
                    }}
                  >
                    {action.icon}
                  </Box>
                  <Typography variant="subtitle1">{action.text}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Today's Classes */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Today's Classes
            </Typography>
            {/* Add class schedule here */}
          </Paper>
        </Grid>

        {/* Pending Tasks */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Pending Tasks
            </Typography>
            {/* Add pending tasks list here */}
          </Paper>
        </Grid>
      </Grid>
    </DashboardTemplate>
  );
};

export default FacultyDashboard;
