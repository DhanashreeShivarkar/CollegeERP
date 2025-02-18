import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#3a7bd5",
      light: "#5d9cec",
      dark: "#2854b0",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#7e57c2",
      light: "#b085f5",
      dark: "#4d2c91",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f8faff",
      paper: "#ffffff",
    },
    text: {
      primary: "#2c3e50",
      secondary: "#546e7a",
    },
    success: {
      main: "#00c853",
      light: "#69f0ae",
      dark: "#008f3b",
    },
    error: {
      main: "#ff5252",
      light: "#ff867f",
      dark: "#c50e29",
    },
    info: {
      main: "#00b0ff",
      light: "#69e2ff",
      dark: "#0081cb",
    },
    warning: {
      main: "#ffa726",
      light: "#ffd95b",
      dark: "#c77800",
    },
    divider: "rgba(0, 0, 0, 0.08)",
  },
  typography: {
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#5d9cec",
      light: "#8cc5ff",
      dark: "#3a7bd5",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#b085f5",
      light: "#e4b3ff",
      dark: "#7e57c2",
      contrastText: "#ffffff",
    },
    background: {
      default: "#0a1929",
      paper: "#102a43",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b0bec5",
    },
    success: {
      main: "#69f0ae",
      light: "#b9f6ca",
      dark: "#00c853",
    },
    error: {
      main: "#ff5252",
      light: "#ff867f",
      dark: "#c50e29",
    },
    info: {
      main: "#69e2ff",
      light: "#a5f2ff",
      dark: "#00b0ff",
    },
    warning: {
      main: "#ffd95b",
      light: "#ffe97d",
      dark: "#ffa726",
    },
    divider: "rgba(255, 255, 255, 0.08)",
    action: {
      active: "#fff",
      hover: "rgba(255, 255, 255, 0.08)",
      selected: "rgba(255, 255, 255, 0.16)",
      disabled: "rgba(255, 255, 255, 0.3)",
      disabledBackground: "rgba(255, 255, 255, 0.12)",
    },
  },
  typography: {
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#102a43",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundImage: "none",
          backgroundColor: "#102a43",
          borderRight: "1px solid rgba(255, 255, 255, 0.08)",
        },
      },
    },
  },
});
