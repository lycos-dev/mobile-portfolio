import React, { createContext, FC, ReactNode, useState } from 'react';

export interface Theme {
  background: string;
  text: string;
  textSecondary: string;
  accent: string;
  card: string;
  gradient: string[];
  primary: string;
  secondary: string;
  surface: string;
  border: string;
  highlight: string;
}

export interface ThemeContextType {
  theme: Theme;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const theme: Theme = isDarkMode
    ? {
        background: '#000000',
        text: '#ffffff',
        textSecondary: '#9ca3af',
        accent: '#374151',
        card: '#111111',
        gradient: ['#1a1a1a', '#000000'],
        primary: '#2d2d2d',
        secondary: '#1f1f1f',
        surface: '#1a1a1a',
        border: '#2a2a2a',
        highlight: '#3f3f3f',
      }
    : {
        background: '#ffffff',
        text: '#111827',
        textSecondary: '#6b7280',
        accent: '#d1d5db',
        card: '#f9fafb',
        gradient: ['#ffffff', '#f3f4f6'],
        primary: '#e5e7eb',
        secondary: '#f3f4f6',
        surface: '#f9fafb',
        border: '#e5e7eb',
        highlight: '#d1d5db',
      };

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
