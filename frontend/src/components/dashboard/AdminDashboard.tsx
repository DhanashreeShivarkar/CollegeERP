import React, { useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  ListItemButton, // Add this import
  Button,
  Stack, // Add Stack import
} from "@mui/material";
import DashboardTemplate from "./DashboardTemplate";
import {
  Person,
  School,
  Class,
  Assignment,
  PersonAdd,
  Group,
  Settings,
  Assessment,
  Book,
  EventNote,
  Payment,
  LibraryBooks,
  Schedule,
  Announcement,
  Business,
  Security,
  BarChart,
  Email,
  SupervisorAccount,
  AccountCircle,
  CalendarMonth,
  AttachMoney,
  ImportContacts,
  CardMembership,
  Notifications,
  Calculate,
  Schedule as TimetableIcon, // Replace TimeTable with Schedule and alias it
  Groups,
  LocalLibrary,
  MenuBook,
  Report,
  Science,
  SportsEsports,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import SettingsPanel from "../adminfeatures/Settings/SettingsPanel";

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, color }) => (
  <Card sx={{ height: "100%" }}>
    <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="h4" component="div">
          {value}
        </Typography>
        <Typography color="textSecondary">{title}</Typography>
      </Box>
    </CardContent>
  </Card>
);

const AdminDashboard: React.FC<{ user: any }> = ({ user }) => {
  const navigate = useNavigate();
  // Update state initialization to check localStorage
  const [currentView, setCurrentView] = useState(() => {
    return localStorage.getItem("adminDashboardView") || "dashboard";
  });

  const renderContent = () => {
    switch (currentView) {
      case "settings":
        return (
          <Box sx={{ flex: 1, overflow: "hidden" }}>
            <SettingsPanel />
          </Box>
        );
      default:
        return (
          <Box sx={{ flex: 1, p: 2 }}>
            {/* Welcome & Stats */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Welcome back, {user.username}
              </Typography>
              <Grid container spacing={2}>
                {stats.map((stat, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <StatCard {...stat} />
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Quick Actions */}
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                {quickActions.map((action, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={action.icon}
                      onClick={() => navigate(action.path)}
                      sx={{
                        justifyContent: "flex-start",
                        py: 1,
                        px: 1.5,
                        borderColor: "primary.light",
                        "&:hover": {
                          borderColor: "primary.main",
                          bgcolor: "action.hover",
                        },
                      }}
                    >
                      <Typography variant="body2" noWrap>
                        {action.title}
                      </Typography>
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Box>
        );
    }
  };

  // Update state and localStorage when view changes
  const handleMenuClick = (view: string) => {
    setCurrentView(view);
    localStorage.setItem("adminDashboardView", view);
  };

  // Update the dashboard menu item to use handleMenuClick
  const menuItems = [
    {
      icon: <Assignment />,
      text: "Dashboard",
      onClick: () => handleMenuClick("dashboard"),
    },
    {
      icon: <SupervisorAccount />,
      text: "User Management",
      onClick: () => handleMenuClick("users"),
      subItems: [
        {
          icon: <School />,
          text: "Students",
          onClick: () => navigate("/admin/students"),
          path: "/admin/students",
        },
        {
          icon: <Person />,
          text: "Faculty",
          onClick: () => navigate("/admin/faculty"),
          path: "/admin/faculty",
        },
        {
          icon: <Group />,
          text: "Staff",
          onClick: () => navigate("/admin/staff"),
          path: "/admin/staff",
        },
      ],
    },
    // Academic Section
    {
      icon: <LibraryBooks />,
      text: "Academics",
      onClick: () => navigate("/admin/academics"),
      subItems: [
        { icon: <Class />, text: "Courses", path: "/admin/courses" },
        { icon: <Business />, text: "Departments", path: "/admin/departments" },
        { icon: <Schedule />, text: "Timetable", path: "/admin/timetable" },
        { icon: <MenuBook />, text: "Subjects", path: "/admin/subjects" },
      ],
    },
    // Examination Section
    {
      icon: <Assessment />,
      text: "Examinations",
      onClick: () => navigate("/admin/exams"),
      subItems: [
        {
          icon: <EventNote />,
          text: "Schedule Exam",
          path: "/admin/exams/new",
        },
        { icon: <Calculate />, text: "Marks Entry", path: "/admin/marks" },
        { icon: <Report />, text: "Results", path: "/admin/results" },
      ],
    },
    // Finance Section
    {
      icon: <Payment />,
      text: "Finance",
      onClick: () => navigate("/admin/finance"),
      subItems: [
        { icon: <AttachMoney />, text: "Fee Collection", path: "/admin/fees" },
        { icon: <Payment />, text: "Salary", path: "/admin/salary" },
        { icon: <BarChart />, text: "Reports", path: "/admin/finance/reports" },
      ],
    },
    // Library Section
    {
      icon: <LocalLibrary />,
      text: "Library",
      onClick: () => navigate("/admin/library"),
      subItems: [
        { icon: <MenuBook />, text: "Books", path: "/admin/library/books" },
        {
          icon: <CardMembership />,
          text: "Memberships",
          path: "/admin/library/members",
        },
      ],
    },
    // Communication
    {
      icon: <Email />,
      text: "Communication",
      onClick: () => navigate("/admin/communication"),
      subItems: [
        { icon: <Announcement />, text: "Notices", path: "/admin/notices" },
        { icon: <CalendarMonth />, text: "Events", path: "/admin/events" },
      ],
    },
    // Settings
    {
      icon: <Settings />,
      text: "Settings",
      onClick: () => handleMenuClick("settings"),
    },
  ];

  const stats = [
    {
      icon: <Person />,
      title: "Total Students",
      value: 1200,
      color: "#1976d2",
    },
    { icon: <School />, title: "Faculty Members", value: 80, color: "#2e7d32" },
    { icon: <Class />, title: "Active Courses", value: 24, color: "#ed6c02" },
    { icon: <Assignment />, title: "Departments", value: 6, color: "#9c27b0" },
  ];

  const quickActions = [
    { icon: <PersonAdd />, title: "Add Student", path: "/admin/students/new" },
    { icon: <Group />, title: "Add Faculty", path: "/admin/faculty/new" },
    { icon: <EventNote />, title: "Schedule Exam", path: "/admin/exams/new" },
    {
      icon: <Notifications />,
      title: "Send Notice",
      path: "/admin/notices/new",
    },
    {
      icon: <AttachMoney />,
      title: "Collect Fees",
      path: "/admin/fees/collect",
    },
    {
      icon: <CardMembership />,
      title: "Issue Certificate",
      path: "/admin/certificates/new",
    },
  ];

  return (
    <DashboardTemplate
      title="Admin Dashboard"
      user={user}
      menuItems={menuItems}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 64px)", // Viewport height minus header
          overflow: "hidden",
        }}
      >
        {renderContent()}
        <Box
          component="footer"
          sx={{
            py: 1,
            px: 2,
            mt: "auto",
            backgroundColor: "primary.main",
            color: "white",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body2">
              © {new Date().getFullYear()} College ERP
            </Typography>
            <Typography variant="body2">Version 1.0.0</Typography>
          </Box>
        </Box>
      </Box>
    </DashboardTemplate>
  );
};

export default AdminDashboard;
