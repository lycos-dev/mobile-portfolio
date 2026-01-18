import React, {
  useState,
  createContext,
  useContext,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
  Switch,
  StyleSheet,
  Linking,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  const theme = isDarkMode
    ? {
        background: '#000000',
        text: '#FFFFFF',
        accent: '#808080',
        card: '#1A1A1A',
        gradient: ['#1A1A1A', '#000000'],
      }
    : {
        background: '#FFFFFF',
        text: '#000000',
        accent: '#808080',
        card: '#F0F0F0',
        gradient: ['#F0F0F0', '#FFFFFF'],
      };

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const navItems = [
  { name: 'Profile', icon: 'user' },
  { name: 'Skills', icon: 'code' },
  { name: 'Contact', icon: 'envelope' },
  { name: 'Projects', icon: 'folder-open' },
];

const LeftNavbar = ({ onNavPress, activeSection }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <LinearGradient colors={theme.gradient} style={styles.leftNav}>
      {navItems.map(item => (
        <TouchableOpacity
          key={item.name}
          onPress={() => onNavPress(item.name)}
          style={[
            styles.navItem,
            activeSection === item.name && {
              backgroundColor: theme.accent,
              borderRadius: 8,
            },
          ]}
        >
          <FontAwesome name={item.icon} size={20} color={theme.text} />
          <Text style={[styles.navText, { color: theme.text }]}>
            {item.name}
          </Text>
        </TouchableOpacity>
      ))}
    </LinearGradient>
  );
};

const AnimatedSection = ({ children, onLayout }) => {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: 1,
      duration: 800,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, [animValue]);

  return (
    <Animated.View
      onLayout={onLayout}
      style={{
        opacity: animValue,
        transform: [
          {
            translateY: animValue.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0],
            }),
          },
        ],
      }}
    >
      {children}
    </Animated.View>
  );
};

const Profile = ({ onLayout }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <AnimatedSection onLayout={onLayout}>
      <LinearGradient
        colors={theme.gradient}
        style={[styles.profile, { borderColor: theme.accent }]}
      >
        <Image
          source={{
            uri: 'https://cdn.discordapp.com/avatars/901724726148362300/bff114eb6685fd4ec97e8642a4304930.png?size=1024',
          }}
          style={styles.profilePic}
        />
        <Text style={[styles.name, { color: theme.text }]}>
          Hi! My Name is Lycos
        </Text>
        <Text style={[styles.bio, { color: theme.accent }]}>
          A Computer Science Student aspiring to be a Software Developer.
        </Text>
      </LinearGradient>
    </AnimatedSection>
  );
};

const Skills = ({ onLayout }) => {
  const { theme } = useContext(ThemeContext);
  const skills = ['C++', 'Java', 'JavaScript', 'Python', 'CSS', 'Node.js'];

  return (
    <AnimatedSection onLayout={onLayout}>
      <LinearGradient
        colors={theme.gradient}
        style={[styles.section, { borderColor: theme.accent }]}
      >
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Skills
        </Text>
        <View style={styles.skillsList}>
          {skills.map(skill => (
            <Text
              key={skill}
              style={[
                styles.skill,
                { backgroundColor: theme.accent, color: theme.background },
              ]}
            >
              {skill}
            </Text>
          ))}
        </View>
      </LinearGradient>
    </AnimatedSection>
  );
};

const Contact = ({ onLayout }) => {
  const { theme } = useContext(ThemeContext);

  const contacts = [
    {
      type: 'Email',
      value: 'blanzalycos@gmail.com',
      link: 'mailto:blanzalycos@gmail.com',
      icon: 'envelope',
    },
    {
      type: 'Instagram',
      value: '@lcs.blnza',
      link: 'https://instagram.com/lcs.blnza',
      icon: 'instagram',
    },
    {
      type: 'GitHub',
      value: 'github.com/lycos-devs',
      link: 'https://github.com/lycos-devs',
      icon: 'github',
    },
  ];

  return (
    <AnimatedSection onLayout={onLayout}>
      <LinearGradient
        colors={theme.gradient}
        style={[styles.section, { borderColor: theme.accent }]}
      >
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Contact
        </Text>
        {contacts.map(item => (
          <TouchableOpacity
            key={item.type}
            style={styles.contactRow}
            onPress={() => Linking.openURL(item.link)}
          >
            <FontAwesome name={item.icon} size={20} color={theme.accent} />
            <Text style={[styles.contactItem, { color: theme.text }]}>
              {item.type}:{' '}
              <Text style={{ color: theme.accent }}>{item.value}</Text>
            </Text>
          </TouchableOpacity>
        ))}
      </LinearGradient>
    </AnimatedSection>
  );
};

const Projects = ({ onLayout }) => {
  const { theme } = useContext(ThemeContext);

  const projects = [
    { id: '1', title: 'Tap The Box Game', description: 'Mobile Game' },
    { id: '2', title: 'Web Project', description: 'React + Node App' },
    { id: '3', title: 'Expo Demo', description: 'Expo Showcase' },
    { id: '4', title: 'Portfolio App', description: 'This App' },
  ];

  return (
    <AnimatedSection onLayout={onLayout}>
      <LinearGradient
        colors={theme.gradient}
        style={[styles.section, { borderColor: theme.accent }]}
      >
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Projects
        </Text>
        <FlatList
          data={projects}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <LinearGradient
              colors={theme.gradient}
              style={[styles.projectItem, { borderColor: theme.accent }]}
            >
              <Text style={[styles.projectTitle, { color: theme.text }]}>
                {item.title}
              </Text>
              <Text style={[styles.projectDesc, { color: theme.accent }]}>
                {item.description}
              </Text>
            </LinearGradient>
          )}
        />
      </LinearGradient>
    </AnimatedSection>
  );
};

const ThemeToggle = () => {
  const { theme, isDarkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <View style={styles.toggleContainer}>
      <Text style={[styles.toggleText, { color: theme.text }]}>
        Dark Mode
      </Text>
      <Switch value={isDarkMode} onValueChange={toggleTheme} />
    </View>
  );
};

const App = () => {
  const scrollRef = useRef(null);
  const [positions, setPositions] = useState({});
  const [active, setActive] = useState('Profile');

  const handleLayout = name => e => {
    setPositions(prev => ({ ...prev, [name]: e.nativeEvent.layout.y }));
  };

  const handleScroll = useCallback(
    e => {
      const y = e.nativeEvent.contentOffset.y;
      let closest = 'Profile';
      let min = Infinity;

      Object.entries(positions).forEach(([key, value]) => {
        const diff = Math.abs(y - value);
        if (diff < min) {
          min = diff;
          closest = key;
        }
      });

      setActive(closest);
    },
    [positions]
  );

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <LinearGradient
          colors={useContext(ThemeContext).theme.gradient}
          style={{ flex: 1 }}
        >
          <SafeAreaView style={styles.container}>
            <View style={styles.mainRow}>
              <LeftNavbar
                onNavPress={section =>
                  scrollRef.current.scrollTo({
                    y: positions[section] || 0,
                    animated: true,
                  })
                }
                activeSection={active}
              />

              <ScrollView
                ref={scrollRef}
                contentContainerStyle={styles.scrollContent}
                onScroll={handleScroll}
                scrollEventThrottle={16}
              >
                <ThemeToggle />
                <Profile onLayout={handleLayout('Profile')} />
                <Skills onLayout={handleLayout('Skills')} />
                <Contact onLayout={handleLayout('Contact')} />
                <Projects onLayout={handleLayout('Projects')} />
              </ScrollView>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App;

const { width } = Dimensions.get('window');
const leftNavWidth = width > 600 ? 120 : 80;

const styles = StyleSheet.create({
  container: { flex: 1 },
  mainRow: { flex: 1, flexDirection: 'row' },
  leftNav: { width: leftNavWidth, padding: 10 },
  navItem: { paddingVertical: 15, alignItems: 'center' },
  navText: { marginTop: 5, fontWeight: '600' },
  scrollContent: { padding: 20 },
  profile: { padding: 30, borderRadius: 20, marginBottom: 30, borderWidth: 1 },
  profilePic: { width: 160, height: 160, borderRadius: 80, marginBottom: 15 },
  name: { fontSize: 26, fontWeight: 'bold' },
  bio: { marginTop: 10, textAlign: 'center' },
  section: { padding: 20, borderRadius: 20, marginBottom: 30, borderWidth: 1 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  skillsList: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  skill: { padding: 10, margin: 6, borderRadius: 20 },
  contactRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 6 },
  contactItem: { marginLeft: 10 },
  projectItem: { padding: 15, borderRadius: 15, marginVertical: 8, borderWidth: 1 },
  projectTitle: { fontWeight: 'bold' },
  projectDesc: {},
  toggleContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  toggleText: { marginRight: 10 },
});
