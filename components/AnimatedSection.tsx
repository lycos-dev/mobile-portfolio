import React, { FC, ReactNode, useEffect, useRef } from 'react';
import { Animated, Easing, LayoutChangeEvent } from 'react-native';

const AnimatedSection: FC<{
  children: ReactNode;
  onLayout: (event: LayoutChangeEvent) => void;
  delay?: number;
}> = ({ children, onLayout, delay = 0 }) => {
  const animValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animValue, {
        toValue: 1,
        duration: 600,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(scaleValue, {
        toValue: 1,
        delay,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const translateY = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [30, 0],
  });

  return (
    <Animated.View
      style={{ transform: [{ translateY }, { scale: scaleValue }], opacity: animValue }}
      onLayout={onLayout}
    >
      {children}
    </Animated.View>
  );
};

export default AnimatedSection;
