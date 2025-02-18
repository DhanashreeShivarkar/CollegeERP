import React, { useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  Button,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Logout,
  Dashboard,
  Person,
  LogoutOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { handleLogout } from "../../utils/auth";

interface DashboardTemplateProps {
  title: string; // Dashboard title (e.g., "Admin Dashboard", "Student Dashboard")
  user: {
    // User information
    username: string;
    designation: {
      name: string;
      permissions: Record<string, any>;
    };
  };
  menuItems: Array<{
    // Sidebar menu items
    icon: React.ReactNode; // Menu item icon
    text: string; // Menu item text
    onClick: () => void; // Menu item click handler
  }>;
  children?: React.ReactNode; // Dashboard content
}

const DRAWER_WIDTH = 240;

const DashboardTemplate = ({
  title,
  user,
  menuItems,
  children,
}: DashboardTemplateProps) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Top Navigation Bar */}
      <AppBar position="fixed">
        <Toolbar>
          {/* Menu Toggle Button */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setDrawerOpen(!drawerOpen)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          {/* Dashboard Title */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          {/* User Info & Logout */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body2">{user?.username || "User"}</Typography>
            <Button
              color="inherit"
              onClick={handleLogout}
              startIcon={<LogoutOutlined />}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Navigation Drawer */}
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          width: DRAWER_WIDTH,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            backgroundColor: theme.palette.primary.main,
            color: "white",
          },
        }}
      >
        <Toolbar>
          <Typography variant="h6" color="inherit">
            Menu
          </Typography>
        </Toolbar>
        <Divider sx={{ bgcolor: "rgba(255,255,255,0.12)" }} />
        <List>
          {/* Dynamic Menu Items */}
          {menuItems.map((item, index) => (
            <ListItem
              component="li"
              key={index}
              onClick={() => {
                item.onClick();
                setDrawerOpen(false);
              }}
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.08)",
                },
              }}
            >
              <ListItemIcon sx={{ color: "inherit" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          backgroundColor: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default DashboardTemplate;
