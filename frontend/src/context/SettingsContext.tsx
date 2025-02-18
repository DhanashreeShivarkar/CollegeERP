import React, { createContext, useContext, useState, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { lightTheme, darkTheme } from "../utils/theme";

interface SettingsState {
  darkMode: boolean;
  compactMode: boolean;
  fontSize: "small" | "medium" | "large";
  animations: boolean;
}

interface SettingsContextType extends SettingsState {
  toggleDarkMode: () => void;
  toggleCompactMode: () => void;
  setFontSize: (size: "small" | "medium" | "large") => void;
  toggleAnimations: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<SettingsState>(() => {
    const savedSettings = localStorage.getItem("userSettings");
    return savedSettings
      ? JSON.parse(savedSettings)
      : {
          darkMode: false,
          compactMode: false,
          fontSize: "medium" as const,
          animations: true,
        };
  });

  useEffect(() => {
    localStorage.setItem("userSettings", JSON.stringify(settings));
    document.documentElement.setAttribute(
      "data-theme",
      settings.darkMode ? "dark" : "light"
    );

    const fontSizes = {
      small: "14px",
      medium: "16px",
      large: "18px",
    } as const;

    document.documentElement.style.fontSize = fontSizes[settings.fontSize];
  }, [settings]);

  const toggleDarkMode = () => {
    setSettings((prev: SettingsState) => ({
      ...prev,
      darkMode: !prev.darkMode,
    }));
  };

  const toggleCompactMode = () => {
    setSettings((prev: SettingsState) => ({
      ...prev,
      compactMode: !prev.compactMode,
    }));
  };

  const setFontSize = (size: "small" | "medium" | "large") => {
    setSettings((prev: SettingsState) => ({ ...prev, fontSize: size }));
  };

  const toggleAnimations = () => {
    setSettings((prev: SettingsState) => ({
      ...prev,
      animations: !prev.animations,
    }));
  };

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        toggleDarkMode,
        toggleCompactMode,
        setFontSize,
        toggleAnimations,
      }}
    >
      <ThemeProvider theme={settings.darkMode ? darkTheme : lightTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
