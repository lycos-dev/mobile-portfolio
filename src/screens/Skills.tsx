import React, { FC, useContext, useState } from 'react';
import { View, Text, LayoutChangeEvent, Animated } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import styles from '../styles/globalStyles';
import { ThemeContext } from '../context/ThemeContext';
import AnimatedSection from '../components/AnimatedSection';

interface Skill {
  name: string;
  level: number;
  icon: string;
}

const SkillCard: FC<{ skill: Skill; index: number; inView: boolean }> = ({ skill, index, inView }) => {
  const { theme, isDarkMode } = useContext(ThemeContext)!;
  const barWidth = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (inView) {
      Animated.spring(barWidth, {
        toValue: skill.level,
        delay: index * 100,
        tension: 40,
        friction: 8,
        useNativeDriver: false,
      }).start();
    }
  }, [inView]);

  const widthInterpolation = barWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.skillItem}>
      <View style={[styles.skillCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.skillHeader}>
          <View style={styles.skillNameRow}>
            <FontAwesome name={skill.icon} size={14} color={theme.textSecondary} style={{ marginRight: 8 }} />
            <Text style={[styles.skillName, { color: theme.text }]}>{skill.name}</Text>
          </View>
          <Text style={[styles.skillLevel, { color: theme.textSecondary }]}>{skill.level}%</Text>
        </View>
        <View style={[styles.skillBarContainer, { backgroundColor: theme.accent }]}>
          <Animated.View
            style={[
              styles.skillBar,
              {
                width: widthInterpolation,
                backgroundColor: isDarkMode ? '#ffffff' : '#000000',
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const Skills: FC<{ onLayout: (event: LayoutChangeEvent) => void }> = ({ onLayout }) => {
  const { theme } = useContext(ThemeContext)!;
  const [inView, setInView] = useState(false);

  const skills: Skill[] = [
    { name: 'C++', level: 85, icon: 'code' },
    { name: 'Java', level: 85, icon: 'coffee' },
    { name: 'Javascript', level: 90, icon: 'code' },
    { name: 'Python', level: 25, icon: 'code' },
    { name: 'CSS', level: 88, icon: 'paint-brush' },
    { name: 'Node.js', level: 76, icon: 'server' },
  ];

  const handleLayout = (event: LayoutChangeEvent) => {
    onLayout(event);
    setInView(true);
  };

  return (
    <AnimatedSection onLayout={handleLayout} delay={100}>
      <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionIconBox, { backgroundColor: theme.surface }]}>
            <FontAwesome name="code" size={18} color={theme.text} />
          </View>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Skills & Expertise</Text>
        </View>

        <View style={styles.skillsGrid}>
          {skills.map((skill, index) => (
            <SkillCard key={index} skill={skill} index={index} inView={inView} />
          ))}
        </View>
      </View>
    </AnimatedSection>
  );
};

export default Skills;
