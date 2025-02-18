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
  ListItemButton,
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

const DashboardTemplate: React.FC<DashboardTemplateProps> = ({
  title,
  user,
  menuItems,
  children,
}) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        maxHeight: "100vh",
        overflow: "hidden",
      }}
    >
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          height: "64px",
        }}
      >
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

      {/* Modified Drawer - Now temporary and positioned correctly */}
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: "block" },
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            mt: "64px", // Height of AppBar
            height: "calc(100% - 64px)",
            bgcolor: "primary.main",
            color: "white",
          },
        }}
      >
        <Box
          sx={{
            overflow: "auto",
            "&:hover": {
              overflowY: "auto",
            },
          }}
        >
          <List>
            {menuItems.map((item, index) => (
              <ListItem
                key={index}
                disablePadding
                onClick={() => {
                  item.onClick();
                  setDrawerOpen(false);
                }}
              >
                <ListItemButton
                  sx={{
                    py: 1.5,
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.08)",
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: "0.9rem",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content - Modified to ensure footer stays at bottom */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Toolbar /> {/* Spacer for AppBar */}
        {children}
      </Box>
    </Box>
  );
};

export default DashboardTemplate;
