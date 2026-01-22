import React, { FC, useContext } from 'react';
import { View, Text, TouchableOpacity, Linking, LayoutChangeEvent } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { ThemeContext } from '../context/ThemeContext';
import AnimatedSection from '../components/AnimatedSection';
import styles from '../styles/globalStyles';

interface ContactItem {
  type: string;
  value: string;
  link: string;
  icon: string;
  color: string;
}

const Contact: FC<{ onLayout: (event: LayoutChangeEvent) => void }> = ({ onLayout }) => {
  const { theme, isDarkMode } = useContext(ThemeContext)!;

  const contacts: ContactItem[] = [
    { type: 'Email', value: 'blanzalycos@gmail.com', link: 'mailto:blanzalycos@gmail.com', icon: 'envelope', color: '#ea4335' },
    { type: 'Instagram', value: '@lcs.blnza', link: 'https://instagram.com/lcs.blnza', icon: 'instagram', color: '#e4405f' },
    { type: 'LinkedIn', value: 'linkedin.com/in/lycos', link: 'https://linkedin.com/in/lycos', icon: 'linkedin', color: '#0077b5' },
    { type: 'GitHub', value: 'github.com/lycos-dev', link: 'https://github.com/lycos-devs', icon: 'github', color: isDarkMode ? '#ffffff' : '#000000' },
  ];

  return (
    <AnimatedSection onLayout={onLayout} delay={200}>
      <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionIconBox, { backgroundColor: theme.surface }]}>
            <FontAwesome name="paper-plane" size={18} color={theme.text} />
          </View>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Get In Touch</Text>
        </View>

        <View style={styles.contactGrid}>
          {contacts.map((contact, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => Linking.openURL(contact.link)}
              style={[styles.contactCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
              activeOpacity={0.7}
            >
              <View style={[styles.contactIconBox, { backgroundColor: contact.color }]}>
                <FontAwesome name={contact.icon} size={18} color="#ffffff" />
              </View>

              <View style={styles.contactInfo}>
                <Text style={[styles.contactType, { color: theme.textSecondary }]}>{contact.type}</Text>
                <Text style={[styles.contactValue, { color: theme.text }]} numberOfLines={1}>
                  {contact.value}
                </Text>
              </View>

              <FontAwesome name="external-link" size={12} color={theme.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </AnimatedSection>
  );
};

export default Contact;
