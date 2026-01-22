import React, { useRef, useState, useCallback } from 'react';
import { View, ScrollView, Animated, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';

import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import FloatingParticles from './src/components/FloatingParticles';
import SidebarMenu from './src/components/SidebarMenu';
import Profile from './src/screens/Profile';
import Skills from './src/screens/Skills';
import Contact from './src/screens/Contact';
import Projects from './src/screens/Projects';
import styles from './src/styles/globalStyles';

const navItems = [
  { name: 'Profile', icon: 'user' },
  { name: 'Skills', icon: 'code' },
  { name: 'Contact', icon: 'envelope' },
  { name: 'Projects', icon: 'folder-open' },
];

const App = () => {
  const scrollRef = useRef<ScrollView>(null);
  const [sectionPositions, setSectionPositions] = useState<Record<string, number>>({});
  const [activeSection, setActiveSection] = useState('Profile');
  const [menuVisible, setMenuVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const handleLayout = (section: string) => (event: any) => {
    const { y } = event.nativeEvent.layout;
    setSectionPositions(prev => ({ ...prev, [section]: y }));
  };

  const handleNavPress = (section: string) => {
    const position = sectionPositions[section];
    if (position !== undefined && scrollRef.current) {
      scrollRef.current.scrollTo({ y: position - 5, animated: true });
    }
  };

  const handleScroll = useCallback(({ nativeEvent }: { nativeEvent: any }) => {
    const currentY = nativeEvent.contentOffset.y;
    let closestSection = 'Profile';
    let minDiff = Infinity;
    const threshold = 50;

    Object.entries(sectionPositions).forEach(([section, pos]) => {
      const diff = Math.abs(currentY - pos);
      if (diff < minDiff && currentY >= pos - threshold) {
        minDiff = diff;
        closestSection = section;
      }
    });

    setActiveSection(closestSection);
  }, [sectionPositions]);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false, listener: handleScroll }
          )}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <FloatingParticles />
          <Profile onLayout={handleLayout('Profile')} />
          <Skills onLayout={handleLayout('Skills')} />
          <Contact onLayout={handleLayout('Contact')} />
          <Projects onLayout={handleLayout('Projects')} />
        </ScrollView>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App;
