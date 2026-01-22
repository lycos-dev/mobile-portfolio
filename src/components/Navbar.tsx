import React, { FC, useContext } from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import styles from '../styles/globalStyles';
import { ThemeContext } from '../context/ThemeContext';

const navItems = [
  { name: 'Profile', icon: 'user' },
  { name: 'Skills', icon: 'code' },
  { name: 'Contact', icon: 'envelope' },
  { name: 'Projects', icon: 'folder-open' },
];

interface NavbarProps {
  activeSection: string;
  onNavPress: (section: string) => void;
}

const Navbar: FC<NavbarProps> = ({ activeSection, onNavPress }) => {
  const { theme, isDarkMode, toggleTheme } = useContext(ThemeContext)!;

  return (
    <View style={[styles.navbar, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
      {navItems.map((item) => {
        const isActive = activeSection === item.name;
        return (
          <TouchableOpacity
            key={item.name}
            onPress={() => onNavPress(item.name)}
            style={[
              styles.navButton,
              { backgroundColor: isActive ? theme.text : 'transparent' }
            ]}
            activeOpacity={0.7}
          >
            <FontAwesome 
              name={item.icon} 
              size={20} 
              color={isActive ? theme.background : theme.textSecondary} 
            />
          </TouchableOpacity>
        );
      })}

      <TouchableOpacity 
        onPress={toggleTheme}
        style={styles.navButton}
        activeOpacity={0.7}
      >
        <FontAwesome 
          name={isDarkMode ? "moon-o" : "sun-o"} 
          size={20} 
          color={theme.textSecondary} 
        />
      </TouchableOpacity>
    </View>
  );
};

export default Navbar;
