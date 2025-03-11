import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { lightTheme, darkTheme } from "../utils/theme";
import { loadFromLocalStorage, saveToLocalStorage } from '../utils/storageUtils';

interface SettingsContextType {
  darkMode: boolean;
  compactMode: boolean;
  fontSize: "small" | "medium" | "large";
  animations: boolean;
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
  const [darkMode, setDarkMode] = useState(() => 
    loadFromLocalStorage('darkMode', false)
  );
  
  const [fontSize, setFontSize] = useState(() => 
    loadFromLocalStorage('fontSize', 'medium')
  );
  
  const [compactMode, setCompactMode] = useState(() => 
    loadFromLocalStorage('compactMode', false)
  );
  
  const [animations, setAnimations] = useState(() => 
    loadFromLocalStorage('animations', true)
  );

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );

    const fontSizes = {
      small: "14px",
      medium: "16px",
      large: "18px",
    } as const;

    document.documentElement.style.fontSize = fontSizes[fontSize as keyof typeof fontSizes];
  }, [darkMode, compactMode, fontSize, animations]);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev: boolean): boolean => {
      const newValue: boolean = !prev;
      saveToLocalStorage('darkMode', newValue);
      return newValue;
    });
  }, []);

  const toggleCompactMode = useCallback(() => {
    setCompactMode((prev: boolean) => {
      const newValue: boolean = !prev;
      saveToLocalStorage('compactMode', newValue);
      return newValue;
    });
  }, []);

  const handleSetFontSize = useCallback((size: 'small' | 'medium' | 'large') => {
    setFontSize(size);
    saveToLocalStorage('fontSize', size);
  }, []);

  const toggleAnimations = useCallback(() => {
    setAnimations((prev: boolean): boolean => {
      const newValue: boolean = !prev;
      saveToLocalStorage('animations', newValue);
      return newValue;
    });
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        darkMode,
        compactMode,
        fontSize,
        animations,
        toggleDarkMode,
        toggleCompactMode,
        setFontSize: handleSetFontSize,
        toggleAnimations,
      }}
    >
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
