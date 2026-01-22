import React, { FC, useRef, useState, useCallback } from 'react';
import { View, ScrollView, RefreshControl, Animated, LayoutChangeEvent } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import styles from './src/styles/globalStyles';

import { ThemeProvider, ThemeContext } from './src/context/ThemeContext';
import FloatingParticles from './src/components/FloatingParticles';
import Navbar from './src/components/Navbar';

import Profile from './src/screens/Profile';
import Skills from './src/screens/Skills';
import Contact from './src/screens/Contact';
import Projects from './src/screens/Projects';

const App: FC = () => {
  const scrollRef = useRef<ScrollView>(null);
  const [sectionPositions, setSectionPositions] = useState<Record<string, number>>({});
  const [activeSection, setActiveSection] = useState('Profile');
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const handleLayout = (section: string) => (event: LayoutChangeEvent) => {
    const { y } = event.nativeEvent.layout;
    setSectionPositions((prev) => ({ ...prev, [section]: y }));
  };

  const handleNavPress = (section: string) => {
    const position = sectionPositions[section];
    if (position !== undefined && scrollRef.current) {
      scrollRef.current.scrollTo({ y: position - 5, animated: true });
    }
  };

  const handleScroll = ({ nativeEvent }: { nativeEvent: any }) => {
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
  };

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ThemeContext.Consumer>
          {(value) => {
            if (!value) return null;
            const { theme } = value;

            return (
              <View style={[styles.container, { backgroundColor: theme.background }]}>
                <FloatingParticles />

                <SafeAreaView style={{ flex: 1 }}>
                  <Navbar activeSection={activeSection} onNavPress={handleNavPress} />

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
                      <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={theme.text}
                        colors={[theme.text]}
                      />
                    }
                  >
                    <View style={styles.contentWrapper}>
                      <Profile onLayout={handleLayout('Profile')} />
                      <Skills onLayout={handleLayout('Skills')} />
                      <Contact onLayout={handleLayout('Contact')} />
                      <Projects onLayout={handleLayout('Projects')} />
                      <View style={{ height: 40 }} />
                    </View>
                  </ScrollView>
                </SafeAreaView>
              </View>
            );
          }}
        </ThemeContext.Consumer>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App;
