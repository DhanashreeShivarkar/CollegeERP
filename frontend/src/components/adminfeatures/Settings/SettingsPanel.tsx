import React, { useState } from "react";
import { Box, Paper, Tabs, Tab, Typography, Divider } from "@mui/material";
import GeneralSettings from "./tabs/GeneralSettings";
import EmailSettings from "./tabs/EmailSettings";
import SecuritySettings from "./tabs/SecuritySettings";
import AcademicSettings from "./tabs/AcademicSettings";
import ThemeSettings from "./tabs/ThemeSettings";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      {...other}
      sx={{ p: 3 }}
    >
      {value === index && children}
    </Box>
  );
};

const SettingsPanel = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Paper sx={{ height: "100%", overflow: "hidden" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="General" />
          <Tab label="Theme" />
          <Tab label="Email" />
          <Tab label="Security" />
          <Tab label="Academic" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <GeneralSettings />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ThemeSettings />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <EmailSettings />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <SecuritySettings />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <AcademicSettings />
      </TabPanel>
    </Paper>
  );
};

export default SettingsPanel;
