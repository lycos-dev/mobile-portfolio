import React, { FC, useContext } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import styles from '../styles/globalStyles';

const navItems = [
  { id: 'profile', label: 'Profile' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

const SidebarMenu: FC<{
  activeSection: string;
  onNavigate: (section: string) => void;
}> = ({ activeSection, onNavigate }) => {
  const { theme } = useContext(ThemeContext)!;

  return (
    <View style={[styles.sidebar, { backgroundColor: theme.surface }]}>
      {navItems.map(item => (
        <TouchableOpacity
          key={item.id}
          style={[
            styles.sidebarItem,
            activeSection === item.id && {
              backgroundColor: theme.highlight,
            },
          ]}
          onPress={() => onNavigate(item.id)}
        >
          <Text
            style={[
              styles.sidebarText,
              {
                color:
                  activeSection === item.id
                    ? theme.text
                    : theme.textSecondary,
              },
            ]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default SidebarMenu;
