import React, { FC, useContext } from 'react';
import { View, Text, LayoutChangeEvent } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import styles from '../styles/globalStyles';
import { ThemeContext } from '../context/ThemeContext';
import AnimatedSection from '../components/AnimatedSection';

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
}

const Projects: FC<{ onLayout: (event: LayoutChangeEvent) => void }> = ({ onLayout }) => {
  const { theme } = useContext(ThemeContext)!;

  const projects: Project[] = [
    { id: '1', title: 'Tap The Box Game', description: 'A reaction type game', tags: ['Mobile', 'Game'] },
    { id: '2', title: 'Pinoy Recipe Finder', description: 'Search tool for finding recipes', tags: ['Web', 'Front-end'] },
    { id: '3', title: 'Restaurant Reservation System', description: 'System with table reservation for customers', tags: ['Web', 'Full-Stack Native'] },
    { id: '4', title: 'Motor Driving Game', description: 'Simple straight line driving simulator', tags: ['Web', 'Game'] },
  ];

  return (
    <AnimatedSection onLayout={onLayout} delay={300}>
      <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionIconBox, { backgroundColor: theme.surface }]}>
            <FontAwesome name="rocket" size={18} color={theme.text} />
          </View>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Featured Projects</Text>
        </View>

        <View style={styles.projectsGrid}>
          {projects.map((item) => (
            <View
              key={item.id}
              style={[styles.projectCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
            >
              <View style={styles.projectHeader}>
                <View style={[styles.projectIconBox, { backgroundColor: theme.primary }]}>
                  <FontAwesome name="folder-open" size={16} color={theme.text} />
                </View>
                <FontAwesome name="external-link" size={12} color={theme.textSecondary} />
              </View>

              <Text style={[styles.projectTitle, { color: theme.text }]}>{item.title}</Text>
              <Text style={[styles.projectDesc, { color: theme.textSecondary }]}>{item.description}</Text>

              <View style={styles.projectTags}>
                {item.tags.map((tag, idx) => (
                  <View key={idx} style={[styles.tag, { backgroundColor: theme.primary, borderColor: theme.border }]}>
                    <Text style={[styles.tagText, { color: theme.textSecondary }]}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      </View>
    </AnimatedSection>
  );
};

export default Projects;
