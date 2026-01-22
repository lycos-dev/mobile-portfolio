import React, { FC, useContext, useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, View } from 'react-native';
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
    <View style={styles.container} pointerEvents="none">
      {particles.map(p => (
        <Animated.View
          key={p.id}
          style={[
            styles.particle,
            {
              width: p.size,
              height: p.size,
              backgroundColor: theme.text,
              opacity: p.opacity,
              transform: [{ translateX: p.x }, { translateY: p.y }],
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  particle: {
    position: 'absolute',
    borderRadius: 50,
  },
});

export default FloatingParticles;
