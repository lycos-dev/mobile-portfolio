import React, { FC, useEffect, useState, useContext } from 'react';
import { Text } from 'react-native';
import styles from '../styles/globalStyles';
import { ThemeContext } from '../context/ThemeContext';

const AnimatedCounter: FC<{ end: number; duration?: number; suffix?: string }> = ({ 
  end, 
  duration = 2000,
  suffix = '' 
}) => {
  const { theme } = useContext(ThemeContext)!;
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      const easeOut = 1 - Math.pow(1 - percentage, 3);
      const currentCount = Math.floor(easeOut * end);
      
      setCount(currentCount);

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return (
    <Text style={[styles.statNumber, { color: theme.text }]}>
      {count}{suffix}
    </Text>
  );
};

export default AnimatedCounter;
