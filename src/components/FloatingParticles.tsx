import React, { FC, useRef, useEffect, useContext } from 'react';
import { View, Dimensions, Animated, Easing } from 'react-native';
import styles from '../styles/globalStyles';
import { ThemeContext } from '../context/ThemeContext';

const FloatingParticles: FC = () => {
  const { theme } = useContext(ThemeContext)!;
  const particles = useRef(
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: new Animated.Value(Math.random() * Dimensions.get('window').width),
      y: new Animated.Value(Math.random() * Dimensions.get('window').height),
      opacity: new Animated.Value(Math.random() * 0.5 + 0.2),
      size: Math.random() * 3 + 1,
    }))
  ).current;

  useEffect(() => {
    particles.forEach((particle) => {
      const animateParticle = () => {
        const duration = Math.random() * 10000 + 15000;
        Animated.parallel([
          Animated.timing(particle.x, {
            toValue: Math.random() * Dimensions.get('window').width,
            duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(particle.y, {
            toValue: Math.random() * Dimensions.get('window').height,
            duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(particle.opacity, {
              toValue: Math.random() * 0.5 + 0.3,
              duration: duration / 2,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(particle.opacity, {
              toValue: Math.random() * 0.3 + 0.1,
              duration: duration / 2,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
        ]).start(() => animateParticle());
      };
      animateParticle();
    });
  }, []);

  return (
    <View style={styles.particlesContainer} pointerEvents="none">
      {particles.map((particle) => (
        <Animated.View
          key={particle.id}
          style={[
            styles.particle,
            {
              width: particle.size,
              height: particle.size,
              backgroundColor: theme.text,
              opacity: particle.opacity,
              transform: [
                { translateX: particle.x },
                { translateY: particle.y },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
};

export default FloatingParticles;
