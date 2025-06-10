import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const themes = {
  light: {
    name: 'light',
    colors: {
      primary: '#3498db',
      secondary: '#2ecc71',
      background: '#f5f6fa',
      surface: '#ffffff',
      text: '#2c3e50',
      textSecondary: '#7f8c8d',
      border: '#ddd',
      error: '#e74c3c',
      success: '#2ecc71',
      warning: '#f1c40f',
    },
    fonts: {
      main: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
    },
    shadows: {
      small: '0 2px 4px rgba(0, 0, 0, 0.1)',
      medium: '0 4px 6px rgba(0, 0, 0, 0.1)',
      large: '0 6px 12px rgba(0, 0, 0, 0.15)',
    },
  },
  dark: {
    name: 'dark',
    colors: {
      primary: '#3498db',
      secondary: '#2ecc71',
      background: '#1a1a1a',
      surface: '#2d2d2d',
      text: '#ffffff',
      textSecondary: '#b3b3b3',
      border: '#404040',
      error: '#e74c3c',
      success: '#2ecc71',
      warning: '#f1c40f',
    },
    fonts: {
      main: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
    },
    shadows: {
      small: '0 2px 4px rgba(0, 0, 0, 0.2)',
      medium: '0 4px 6px rgba(0, 0, 0, 0.2)',
      large: '0 6px 12px rgba(0, 0, 0, 0.3)',
    },
  },
  nature: {
    name: 'nature',
    colors: {
      primary: '#2ecc71',
      secondary: '#27ae60',
      background: '#f0f7f4',
      surface: '#ffffff',
      text: '#2c3e50',
      textSecondary: '#7f8c8d',
      border: '#bdc3c7',
      error: '#e74c3c',
      success: '#27ae60',
      warning: '#f39c12',
    },
    fonts: {
      main: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
    },
    shadows: {
      small: '0 2px 4px rgba(0, 0, 0, 0.1)',
      medium: '0 4px 6px rgba(0, 0, 0, 0.1)',
      large: '0 6px 12px rgba(0, 0, 0, 0.15)',
    },
  },
  ocean: {
    name: 'ocean',
    colors: {
      primary: '#3498db',
      secondary: '#2980b9',
      background: '#ecf0f1',
      surface: '#ffffff',
      text: '#2c3e50',
      textSecondary: '#7f8c8d',
      border: '#bdc3c7',
      error: '#e74c3c',
      success: '#27ae60',
      warning: '#f39c12',
    },
    fonts: {
      main: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
    },
    shadows: {
      small: '0 2px 4px rgba(0, 0, 0, 0.1)',
      medium: '0 4px 6px rgba(0, 0, 0, 0.1)',
      large: '0 6px 12px rgba(0, 0, 0, 0.15)',
    },
  },
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? themes[savedTheme] : themes.light;
  });

  useEffect(() => {
    localStorage.setItem('theme', currentTheme.name);
    document.documentElement.style.setProperty('--primary-color', currentTheme.colors.primary);
    document.documentElement.style.setProperty('--secondary-color', currentTheme.colors.secondary);
    document.documentElement.style.setProperty('--background-color', currentTheme.colors.background);
    document.documentElement.style.setProperty('--surface-color', currentTheme.colors.surface);
    document.documentElement.style.setProperty('--text-color', currentTheme.colors.text);
    document.documentElement.style.setProperty('--text-secondary-color', currentTheme.colors.textSecondary);
    document.documentElement.style.setProperty('--border-color', currentTheme.colors.border);
    document.documentElement.style.setProperty('--error-color', currentTheme.colors.error);
    document.documentElement.style.setProperty('--success-color', currentTheme.colors.success);
    document.documentElement.style.setProperty('--warning-color', currentTheme.colors.warning);
    document.documentElement.style.setProperty('--font-main', currentTheme.fonts.main);
    document.documentElement.style.setProperty('--shadow-small', currentTheme.shadows.small);
    document.documentElement.style.setProperty('--shadow-medium', currentTheme.shadows.medium);
    document.documentElement.style.setProperty('--shadow-large', currentTheme.shadows.large);
  }, [currentTheme]);

  const changeTheme = (themeName) => {
    setCurrentTheme(themes[themeName]);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 