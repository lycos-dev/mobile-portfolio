import React, { FC, useContext, useRef, useEffect } from 'react';
import { View, Text, Image, Animated, Easing, LayoutChangeEvent } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import styles from '../styles/globalStyles';
import { ThemeContext } from '../context/ThemeContext';
import AnimatedSection from '../components/AnimatedSection';
import AnimatedCounter from '../components/AnimatedCounter';

const Profile: FC<{ onLayout: (event: LayoutChangeEvent) => void }> = ({ onLayout }) => {
  const { theme } = useContext(ThemeContext)!;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.03,
          duration: 2500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <AnimatedSection onLayout={onLayout}>
      <View style={[styles.profile, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <View style={[styles.profilePicContainer, { backgroundColor: theme.highlight }]}>
            <Image
              source={{ uri: 'https://img.sanishtech.com/u/7673c4616628bce802561f1f97eb7bc0.jpg' }}
              style={styles.profilePic}
            />
          </View>
        </Animated.View>

        <Text style={[styles.name, { color: theme.text }]}>Hi! I'm Lycos</Text>

        <View style={[styles.badge, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <FontAwesome name="graduation-cap" size={10} color={theme.textSecondary} style={{ marginRight: 6 }} />
          <Text style={[styles.badgeText, { color: theme.text }]}>Computer Science Student</Text>
        </View>

        <Text style={[styles.bio, { color: theme.textSecondary }]}>
          Aspiring Software Developer passionate about creating innovative solutions
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <AnimatedCounter end={6} suffix="+" />
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Skills</Text>
          </View>

          <View style={[styles.statDivider, { backgroundColor: theme.border }]} />

          <View style={styles.statItem}>
            <AnimatedCounter end={4} />
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Projects</Text>
          </View>

          <View style={[styles.statDivider, { backgroundColor: theme.border }]} />

          <View style={styles.statItem}>
            <AnimatedCounter end={100} suffix="%" />
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Passion</Text>
          </View>
        </View>
      </View>
    </AnimatedSection>
  );
};

export default Profile;
