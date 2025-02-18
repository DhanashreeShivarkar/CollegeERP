import React from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Security,
  School,
  People,
  Assignment,
  Settings,
  AddCircle,
  GroupAdd,
  Domain,
  VerifiedUser,
} from "@mui/icons-material";
import DashboardTemplate from "./DashboardTemplate";

const SuperAdminDashboard = ({ user }: any) => {
  const menuItems = [
    { icon: <Security />, text: "System Settings", onClick: () => {} },
    { icon: <Domain />, text: "Institutions", onClick: () => {} },
    { icon: <VerifiedUser />, text: "Roles & Permissions", onClick: () => {} },
    { icon: <Settings />, text: "Configuration", onClick: () => {} },
  ];

  const statistics = [
    {
      title: "Total Institutions",
      value: "5",
      icon: <Domain />,
      color: "#1976d2",
    },
    {
      title: "Total Users",
      value: "1,234",
      icon: <People />,
      color: "#2e7d32",
    },
    {
      title: "Active Admins",
      value: "12",
      icon: <Security />,
      color: "#d32f2f",
    },
    {
      title: "System Modules",
      value: "8",
      icon: <Settings />,
      color: "#ed6c02",
    },
  ];

  const quickActions = [
    { text: "Add Institution", icon: <AddCircle />, action: () => {} },
    { text: "Create Admin", icon: <GroupAdd />, action: () => {} },
    { text: "System Audit", icon: <Assignment />, action: () => {} },
    { text: "Global Settings", icon: <Settings />, action: () => {} },
  ];

  return (
    <DashboardTemplate
      title="Super Admin Dashboard"
      user={user}
      menuItems={menuItems}
    >
      <Grid container spacing={3}>
        {/* Statistics */}
        {statistics.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              elevation={3}
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                bgcolor: `${stat.color}15`,
                borderLeft: `4px solid ${stat.color}`,
              }}
            >
              <Box sx={{ color: stat.color, mb: 1 }}>{stat.icon}</Box>
              <Typography variant="h4" sx={{ color: stat.color }}>
                {stat.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stat.title}
              </Typography>
            </Paper>
          </Grid>
        ))}

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <List>
              {quickActions.map((action, index) => (
                <ListItem
                  component="button"
                  key={index}
                  onClick={action.action}
                  sx={{ mb: 1, bgcolor: "background.default", borderRadius: 1 }}
                >
                  <ListItemIcon>{action.icon}</ListItemIcon>
                  <ListItemText primary={action.text} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* System Status */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              System Status
            </Typography>
            <List>
              <ListItem sx={{ color: "success.main" }}>
                <ListItemIcon>
                  <School sx={{ color: "inherit" }} />
                </ListItemIcon>
                <ListItemText
                  primary="All Systems Operational"
                  secondary="Last checked: 2 minutes ago"
                />
              </ListItem>
              {/* Add more system status items */}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </DashboardTemplate>
  );
};

export default SuperAdminDashboard;
