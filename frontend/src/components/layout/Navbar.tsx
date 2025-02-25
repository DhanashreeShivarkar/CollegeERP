import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTheme as useMUITheme } from "@mui/material/styles";
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Box,
  Avatar,
  Tooltip,
  Fade,
  InputBase,
  styled,
  alpha,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useSettings } from "../../context/SettingsContext";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

// Styled components
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
      "&:focus": {
        width: "30ch",
      },
    },
  },
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

interface NavbarProps {
  onLoginClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onLoginClick }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <i className="bi bi-building-fill text-primary me-2"></i>
          <span className="fw-bold">SynchronikERP</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">
                Contact
              </Link>
            </li>
          </ul>

          <button className="btn btn-primary" onClick={onLoginClick}>
            <i className="bi bi-person me-2"></i>
            Login
          </button>
        </div>
      </div>
    </nav>
  );
};

interface DashboardNavbarProps {
  user: any;
  title?: string;
  onLogout?: () => void;
}

export const DashboardNavbar: React.FC<DashboardNavbarProps> = ({
  user,
  title,
  onLogout,
}) => {
  const theme = useMUITheme();
  const { darkMode, toggleDarkMode } = useSettings();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationEl, setNotificationEl] = useState<null | HTMLElement>(
    null
  );

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationEl(event.currentTarget);
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderBottom: `1px solid ${theme.palette.divider}`,
        height: "64px", // Fixed height for navbar
        "& .MuiToolbar-root": {
          minHeight: "64px",
          height: "64px",
        },
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Logo Section */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            component="img"
            src="/logo.svg" // Updated to use SVG logo
            alt="SynchronikERP Logo"
            sx={{
              height: 40, // Adjusted height for SVG
              mr: 2,
              filter:
                theme.palette.mode === "dark"
                  ? "invert(0.85) hue-rotate(180deg) contrast(0.8) saturate(1.2)" // Adjusted for better visibility in dark mode
                  : "none",
              transition: "filter 0.3s ease", // Smooth transition for theme changes
              "&:hover": {
                filter:
                  theme.palette.mode === "dark"
                    ? "invert(1) hue-rotate(180deg) contrast(0.9) saturate(1.2)" // Brighter on hover in dark mode
                    : "brightness(1.1)", // Slightly brighter on hover in light mode
              },
            }}
          />
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              borderLeft: `2px solid ${theme.palette.divider}`,
              pl: 2,
            }}
          >
            <Box
              sx={{
                fontWeight: "bold",
                fontSize: "1.2rem",
                letterSpacing: "-0.5px",
              }}
            >
              SynchronikERP
            </Box>
            <Box
              sx={{
                fontSize: "0.75rem",
                color: theme.palette.text.secondary,
                letterSpacing: "0.5px",
              }}
            >
              {title}
            </Box>
          </Box>
        </Box>

        {/* Search Bar */}
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ "aria-label": "search" }}
          />
        </Search>

        {/* Right Section */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Dark Mode Toggle */}
          <Tooltip title={darkMode ? "Light mode" : "Dark mode"}>
            <IconButton onClick={toggleDarkMode} color="inherit">
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Tooltip>

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton
              onClick={handleNotificationClick}
              size="large"
              color="inherit"
            >
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Settings */}
          <Tooltip title="Settings">
            <IconButton size="large" color="inherit">
              <SettingsIcon />
            </IconButton>
          </Tooltip>

          {/* Profile */}
          <Box
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={handleProfileClick}
          >
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar
                alt={user?.name || "User"}
                src={user?.avatar}
                sx={{ width: 35, height: 35 }}
              />
            </StyledBadge>
            <Box sx={{ ml: 1, display: { xs: "none", md: "block" } }}>
              <Box sx={{ fontWeight: 500 }}>{user?.name || "Admin"}</Box>
              <Box
                sx={{
                  fontSize: "0.75rem",
                  color: theme.palette.text.secondary,
                }}
              >
                {user?.role}
              </Box>
            </Box>
            <KeyboardArrowDownIcon sx={{ ml: 0.5 }} />
          </Box>

          {/* Profile Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            TransitionComponent={Fade}
            sx={{ mt: 1 }}
          >
            <MenuItem>Profile</MenuItem>
            <MenuItem>My Account</MenuItem>
            <MenuItem onClick={onLogout}>Logout</MenuItem>
          </Menu>

          {/* Notifications Menu */}
          <Menu
            anchorEl={notificationEl}
            open={Boolean(notificationEl)}
            onClose={() => setNotificationEl(null)}
            TransitionComponent={Fade}
            sx={{ mt: 1 }}
          >
            <MenuItem>New Message</MenuItem>
            <MenuItem>System Update</MenuItem>
            <MenuItem>Task Complete</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
