import React from "react";
import {
  Box,
  Grid,
  Typography,
  FormControlLabel,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Divider,
} from "@mui/material";
import { useSettings } from "../../../../context/SettingsContext";
import {
  DarkMode,
  FormatSize,
  Animation,
  AspectRatio,
} from "@mui/icons-material";

const ThemeSettings = () => {
  const {
    darkMode,
    compactMode,
    fontSize,
    animations,
    toggleDarkMode,
    toggleCompactMode,
    setFontSize,
    toggleAnimations,
  } = useSettings();

  const settingItems = [
    {
      icon: <DarkMode />,
      title: "Dark Mode",
      description: "Toggle dark/light theme",
      control: <Switch checked={darkMode} onChange={toggleDarkMode} />,
    },
    {
      icon: <AspectRatio />,
      title: "Compact Mode",
      description: "Reduce spacing in UI",
      control: <Switch checked={compactMode} onChange={toggleCompactMode} />,
    },
    {
      icon: <FormatSize />,
      title: "Font Size",
      description: "Adjust text size",
      control: (
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={fontSize}
            onChange={(e) =>
              setFontSize(e.target.value as "small" | "medium" | "large")
            }
          >
            <MenuItem value="small">Small</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="large">Large</MenuItem>
          </Select>
        </FormControl>
      ),
    },
    {
      icon: <Animation />,
      title: "Animations",
      description: "Enable/disable UI animations",
      control: <Switch checked={animations} onChange={toggleAnimations} />,
    },
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Theme & Display
      </Typography>
      <Grid container spacing={3}>
        {settingItems.map((item, index) => (
          <Grid item xs={12} key={index}>
            <Paper 
              sx={{ 
                p: 2,
                bgcolor: 'background.paper',
                color: 'text.primary'
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 1,
                    bgcolor: "primary.main",
                    color: "white",
                    display: "flex",
                  }}
                >
                  {item.icon}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1">{item.title}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {item.description}
                  </Typography>
                </Box>
                {item.control}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ThemeSettings;
