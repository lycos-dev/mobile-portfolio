import React, { useState, createContext, useContext, FC, ReactNode, useRef, useEffect, useCallback } from 'react';
import { View, Text, Image, ScrollView, FlatList, Switch, StyleSheet, Linking, TouchableOpacity, LayoutChangeEvent, Dimensions, Animated, Easing, Modal, RefreshControl } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Theme interface
interface Theme {
  background: string;
  text: string;
  textSecondary: string;
  accent: string;
  card: string;
  gradient: string[];
  primary: string;
  secondary: string;
  surface: string;
  border: string;
  highlight: string;
}

interface ThemeContextType {
  theme: Theme;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const theme: Theme = isDarkMode
    ? {
        background: '#000000',
        text: '#ffffff',
        textSecondary: '#9ca3af',
        accent: '#374151',
        card: '#111111',
        gradient: ['#1a1a1a', '#000000'],
        primary: '#2d2d2d',
        secondary: '#1f1f1f',
        surface: '#1a1a1a',
        border: '#2a2a2a',
        highlight: '#3f3f3f',
      }
    : {
        background: '#ffffff',
        text: '#111827',
        textSecondary: '#6b7280',
        accent: '#d1d5db',
        card: '#f9fafb',
        gradient: ['#ffffff', '#f3f4f6'],
        primary: '#e5e7eb',
        secondary: '#f3f4f6',
        surface: '#f9fafb',
        border: '#e5e7eb',
        highlight: '#d1d5db',
      };

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Floating Particles Component
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

// Animated Counter Component
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

// Nav Items with icons
const navItems = [
  { name: 'Profile', icon: 'user' },
  { name: 'Skills', icon: 'code' },
  { name: 'Contact', icon: 'envelope' },
  { name: 'Projects', icon: 'folder-open' },
];

// Sidebar Menu Component
const SidebarMenu: FC<{ 
  visible: boolean; 
  onClose: () => void; 
  onNavPress: (section: string) => void; 
  activeSection: string;
}> = ({ visible, onClose, onNavPress, activeSection }) => {
  const { theme, isDarkMode } = useContext(ThemeContext)!;
  const slideAnim = useRef(new Animated.Value(-300)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: visible ? 0 : -300,
      tension: 65,
      friction: 11,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const handleNavPress = (section: string) => {
    onNavPress(section);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.modalOverlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <Animated.View 
          style={[
            styles.sidebar, 
            { 
              backgroundColor: theme.card,
              borderRightColor: theme.border,
              transform: [{ translateX: slideAnim }]
            }
          ]}
        >
          <View style={styles.sidebarHeader}>
            <Text style={[styles.sidebarTitle, { color: theme.text }]}>Menu</Text>
            <TouchableOpacity onPress={onClose} style={[styles.closeButton, { backgroundColor: theme.surface }]}>
              <FontAwesome name="times" size={18} color={theme.text} />
            </TouchableOpacity>
          </View>

          {navItems.map((item, index) => {
            const isActive = activeSection === item.name;
            return (
              <TouchableOpacity
                key={item.name}
                onPress={() => handleNavPress(item.name)}
                style={[
                  styles.sidebarItem,
                  { backgroundColor: isActive ? theme.primary : 'transparent' },
                ]}
              >
                <View style={[styles.sidebarIconBox, { backgroundColor: isActive ? theme.highlight : theme.surface }]}>
                  <FontAwesome 
                    name={item.icon} 
                    size={18} 
                    color={isActive ? theme.text : theme.textSecondary} 
                  />
                </View>
                <Text style={[
                  styles.sidebarText, 
                  { color: isActive ? theme.text : theme.textSecondary }
                ]}>
                  {item.name}
                </Text>
                {isActive && (
                  <View style={[styles.activeIndicator, { backgroundColor: theme.text }]} />
                )}
              </TouchableOpacity>
            );
          })}
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

// Animated Section Wrapper
const AnimatedSection: FC<{ 
  children: ReactNode; 
  onLayout: (event: LayoutChangeEvent) => void; 
  delay?: number 
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
      })
    ]).start();
  }, []);

  const translateY = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [30, 0],
  });

  return (
    <Animated.View 
      style={{ 
        transform: [{ translateY }, { scale: scaleValue }], 
        opacity: animValue 
      }} 
      onLayout={onLayout}
    >
      {children}
    </Animated.View>
  );
};

// Profile Component
const Profile: FC<{ onLayout: (event: LayoutChangeEvent) => void }> = ({ onLayout }) => {
  const { theme, isDarkMode } = useContext(ThemeContext)!;
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
              source={{ uri: 'https://cdn.discordapp.com/avatars/901724726148362300/bff114eb6685fd4ec97e8642a4304930.png?size=1024' }}
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

// Individual Skill Card with Animation
const SkillCard: FC<{ 
  skill: { name: string; level: number; icon: string }; 
  index: number;
  inView: boolean;
}> = ({ skill, index, inView }) => {
  const { theme, isDarkMode } = useContext(ThemeContext)!;
  const barWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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
                backgroundColor: isDarkMode ? '#ffffff' : '#000000'
              }
            ]} 
          />
        </View>
      </View>
    </View>
  );
};

// Skills Component
const Skills: FC<{ onLayout: (event: LayoutChangeEvent) => void }> = ({ onLayout }) => {
  const { theme } = useContext(ThemeContext)!;
  const [inView, setInView] = useState(false);
  
  const skills: Array<{ name: string; level: number; icon: string }> = [
    { name: 'C++', level: 85, icon: 'code' },
    { name: 'Java', level: 80, icon: 'coffee' },
    { name: 'Javascript', level: 90, icon: 'code' },
    { name: 'Python', level: 75, icon: 'code' },
    { name: 'CSS', level: 88, icon: 'paint-brush' },
    { name: 'Node.js', level: 82, icon: 'server' },
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

// Contact Component
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

// Projects Component
interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
}

const Projects: FC<{ onLayout: (event: LayoutChangeEvent) => void }> = ({ onLayout }) => {
  const { theme, isDarkMode } = useContext(ThemeContext)!;
  const projects: Project[] = [
    { id: '1', title: 'Tap The Box Game', description: 'A Simple Mobile Application', tags: ['Mobile', 'Game'] },
    { id: '2', title: 'Web Project', description: 'Full-stack web app using React and Node.js', tags: ['Web', 'Full-Stack'] },
    { id: '3', title: 'Expo Demo', description: 'Demo app showcasing Expo features', tags: ['Mobile', 'React Native'] },
    { id: '4', title: 'Portfolio App', description: 'This very app!', tags: ['Mobile', 'Portfolio'] },
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
          {projects.map((item, index) => (
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

// Theme Toggle Component
const ThemeToggle: FC = () => {
  const { theme, isDarkMode, toggleTheme } = useContext(ThemeContext)!;
  return (
    <TouchableOpacity 
      onPress={toggleTheme}
      style={[styles.toggleContainer, { backgroundColor: theme.card, borderColor: theme.border }]}
      activeOpacity={0.8}
    >
      <View style={styles.toggleLeft}>
        <View style={[styles.toggleIconBox, { backgroundColor: theme.surface }]}>
          <FontAwesome 
            name={isDarkMode ? "moon-o" : "sun-o"} 
            size={16} 
            color={theme.text} 
          />
        </View>
        <Text style={[styles.toggleText, { color: theme.text }]}>
          {isDarkMode ? 'Dark' : 'Light'} Mode
        </Text>
      </View>
      <Switch
        trackColor={{ false: theme.accent, true: theme.accent }}
        thumbColor={isDarkMode ? '#ffffff' : '#000000'}
        onValueChange={toggleTheme}
        value={isDarkMode}
      />
    </TouchableOpacity>
  );
};

const App: FC = () => {
  const scrollRef = useRef<ScrollView>(null);
  const [sectionPositions, setSectionPositions] = useState<Record<string, number>>({});
  const [activeSection, setActiveSection] = useState('Profile');
  const [menuVisible, setMenuVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const handleLayout = (section: string) => (event: LayoutChangeEvent) => {
    const { y } = event.nativeEvent.layout;
    setSectionPositions((prev) => ({ ...prev, [section]: y }));
  };

  const handleNavPress = (section: string) => {
    const position = sectionPositions[section];
    if (position !== undefined && scrollRef.current) {
      // Subtract a small offset to account for navbar and get closer to the section
      const offset = 5; // 5px margin from the top
      scrollRef.current.scrollTo({ y: position - offset, animated: true });
    }
  };

  const handleScroll = useCallback(({ nativeEvent }: { nativeEvent: any }) => {
    const { contentOffset } = nativeEvent;
    const currentY = contentOffset.y;
    let closestSection = 'Profile';
    let minDiff = Infinity;

    // Add a small threshold to detect section transitions more accurately
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
        <ThemeContext.Consumer>
          {(value) => {
            if (value === undefined) {
              throw new Error('ThemeContext must be used within a ThemeProvider');
            }
            const { theme } = value;
            
            // Calculate scroll progress (0 to 1)
            const scrollProgress = scrollY.interpolate({
              inputRange: [0, 1000],
              outputRange: [0, 1],
              extrapolate: 'clamp',
            });

            const progressWidth = scrollProgress.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            });

            return (
              <View style={[styles.container, { backgroundColor: theme.background }]}>
                <FloatingParticles />
                
                {/* Scroll Progress Bar */}
                <View style={[styles.progressBarContainer, { backgroundColor: theme.border }]}>
                  <Animated.View 
                    style={[
                      styles.progressBar, 
                      { 
                        width: progressWidth,
                        backgroundColor: theme.text 
                      }
                    ]} 
                  />
                </View>

                <SafeAreaView style={{ flex: 1 }}>
                  <View style={[styles.navbar, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
                    {navItems.map((item) => {
                      const isActive = activeSection === item.name;
                      return (
                        <TouchableOpacity
                          key={item.name}
                          onPress={() => handleNavPress(item.name)}
                          style={[
                            styles.navButton,
                            { backgroundColor: isActive ? theme.text : 'transparent' }
                          ]}
                          activeOpacity={0.7}
                        >
                          <FontAwesome 
                            name={item.icon} 
                            size={20} 
                            color={isActive ? theme.background : theme.textSecondary} 
                          />
                        </TouchableOpacity>
                      );
                    })}
                    <TouchableOpacity 
                      onPress={() => {
                        const { toggleTheme } = value;
                        toggleTheme();
                      }}
                      style={styles.navButton}
                      activeOpacity={0.7}
                    >
                      <FontAwesome 
                        name={value.isDarkMode ? "moon-o" : "sun-o"} 
                        size={20} 
                        color={theme.textSecondary} 
                      />
                    </TouchableOpacity>
                  </View>

                  <ScrollView
                    ref={scrollRef}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    onScroll={Animated.event(
                      [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                      { 
                        useNativeDriver: false,
                        listener: handleScroll
                      }
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
                    bounces={true}
                    bouncesZoom={true}
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

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  particlesContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  particle: {
    position: 'absolute',
    borderRadius: 50,
  },
  menuButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  sidebar: {
    width: 280,
    height: '100%',
    paddingTop: 60,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    borderRightWidth: 1,
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  sidebarTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 8,
    position: 'relative',
  },
  sidebarIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sidebarText: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  activeIndicator: {
    width: 4,
    height: 20,
    borderRadius: 2,
    position: 'absolute',
    right: 0,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 5,
  },
  contentWrapper: {
    width: '100%',
    paddingHorizontal: 16,
    alignItems: 'stretch',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  navIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  navActiveIndicator: {
    width: 24,
    height: 3,
    borderRadius: 2,
    position: 'absolute',
    bottom: 0,
  },
  profile: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    width: '100%',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  profilePicContainer: {
    padding: 4,
    borderRadius: 45,
    marginBottom: 12,
  },
  profilePic: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bio: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 30,
  },
  section: {
    width: '100%',
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  sectionIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  skillsGrid: {
    gap: 10,
  },
  skillItem: {
    width: '100%',
  },
  skillCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  skillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  skillNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skillName: {
    fontSize: 15,
    fontWeight: '700',
  },
  skillBarContainer: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  skillBar: {
    height: '100%',
    borderRadius: 3,
  },
  skillLevel: {
    fontSize: 12,
    fontWeight: '700',
  },
  contactGrid: {
    gap: 10,
  },
  contactCard: {
    width: '100%',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactType: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  contactInfo: {
    flex: 1,
  },
  projectsGrid: {
    gap: 10,
  },
  projectCard: {
    width: '100%',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  projectIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  projectDesc: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  projectTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '600',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    padding: 14,
    borderRadius: 14,
    width: '100%',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  toggleIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '700',
  },
});

export default App;