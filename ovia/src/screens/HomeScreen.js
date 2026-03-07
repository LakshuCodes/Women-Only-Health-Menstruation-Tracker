import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Animated, Dimensions, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Rect, Path, Line } from 'react-native-svg';

const { width } = Dimensions.get('window');

const COLORS = {
  lavenderBlush: '#FFE5EC',
  pastelPink: '#FFB3C6',
  lightPink: '#FF8FAB',
  pinkChampagne: '#FFC2D1',
  watermelon: '#FB6F92',
  white: '#FFFFFF',
  darkText: '#2D1B1E',
  mutedText: '#9B6B78',
  navInactive: '#A0A0B0',
};

const TODAY = 'TUESDAY, JUNE 14';
const CYCLE_DAY = 14;
const CYCLE_TOTAL = 28;

const MOODS = [
  { emoji: '😢', label: 'Sad' },
  { emoji: '😕', label: 'Down' },
  { emoji: '😐', label: 'Neutral' },
  { emoji: '😊', label: 'Good' },
  { emoji: '😄', label: 'Great' },
];

const EXERCISE_MODULES = [
  { id: '1', title: 'Period Relief',    subtitle: 'Ease cramps & bloating',     emoji: '🩸', bg: '#FFE5EC', accent: '#FB6F92', videoCount: 8,  category: 'Period',    searchQuery: 'period cramps relief yoga exercises' },
  { id: '2', title: 'PCOS & PCOD Yoga', subtitle: 'Balance hormones naturally', emoji: '🧘', bg: '#F3E5F5', accent: '#AB47BC', videoCount: 12, category: 'PCOS',      searchQuery: 'PCOS PCOD yoga workout exercises hormone balance' },
  { id: '3', title: 'Pregnancy Safe',   subtitle: 'Gentle prenatal workouts',   emoji: '🤰', bg: '#E8F5E9', accent: '#4CAF50', videoCount: 10, category: 'Pregnancy', searchQuery: 'pregnancy safe prenatal yoga exercises workout' },
];

// ── Nav Icons ──
const DashboardIcon = ({ color, size = 28 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="3" width="7" height="7" rx="1.5" fill={color} />
    <Rect x="14" y="3" width="7" height="7" rx="1.5" fill={color} />
    <Rect x="3" y="14" width="7" height="7" rx="1.5" fill={color} />
    <Rect x="14" y="14" width="7" height="7" rx="1.5" fill={color} />
  </Svg>
);
const CalendarIcon = ({ color, size = 28 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="5" width="18" height="16" rx="2" stroke={color} strokeWidth="2" />
    <Line x1="3" y1="10" x2="21" y2="10" stroke={color} strokeWidth="2" />
    <Line x1="8" y1="3" x2="8" y2="7" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Line x1="16" y1="3" x2="16" y2="7" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Rect x="7" y="13" width="3" height="3" rx="0.5" fill={color} />
    <Rect x="11" y="13" width="3" height="3" rx="0.5" fill={color} />
  </Svg>
);
const DoctorIcon = ({ color, size = 28 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="4" y="3" width="16" height="18" rx="2" stroke={color} strokeWidth="2" />
    <Line x1="12" y1="8" x2="12" y2="14" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Line x1="9" y1="11" x2="15" y2="11" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Line x1="8" y1="17" x2="16" y2="17" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </Svg>
);
const SocialIcon = ({ color, size = 28 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Line x1="8" y1="9" x2="16" y2="9" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Line x1="8" y1="13" x2="13" y2="13" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </Svg>
);

// ── Ovia Bot Face SVG ──
// ── Animated Speech Bubble Heart FAB ──
const ChatBubbleHeart = ({ size = 44, heartScale = 1 }) => (
  <Svg width={size} height={size * 0.88} viewBox="0 0 120 106" fill="none">
    {/* Bubble body - glossy pink ellipse */}
    <Path
      d="M60 4 C28 4, 4 22, 4 46 C4 67, 24 82, 50 85 C52 85, 53 88, 52 98 C52 100, 54 101, 55 99 C62 90, 68 87, 72 85 C97 82, 116 66, 116 46 C116 22, 92 4, 60 4 Z"
      fill="#FB6F92"
    />
    {/* Gloss highlight */}
    <Path
      d="M30 14 C38 10, 50 8, 62 9 C74 10, 84 14, 88 20 C80 16, 68 13, 56 13 C44 13, 34 16, 30 14 Z"
      fill="rgba(255,255,255,0.35)"
    />
    {/* Heart shape */}
    <Path
      d="M60 68 C60 68, 36 54, 36 40 C36 32, 42 26, 50 28 C54 29, 58 32, 60 36 C62 32, 66 29, 70 28 C78 26, 84 32, 84 40 C84 54, 60 68, 60 68 Z"
      fill="rgba(255,200,215,0.85)"
    />
    {/* Inner heart glow */}
    <Path
      d="M60 62 C60 62, 42 50, 42 40 C42 35, 46 31, 51 33 C55 34, 58 37, 60 40 C62 37, 65 34, 69 33 C74 31, 78 35, 78 40 C78 50, 60 62, 60 62 Z"
      fill="rgba(255,230,235,0.6)"
    />
  </Svg>
);

// ── Shared stores ──
let _reminders = [
  { id: '1', icon: '💊', title: 'Iron Supplement', time: '8:00 AM',  color: COLORS.pastelPink },
  { id: '2', icon: '🩺', title: 'Dr. Appointment', time: 'Tomorrow', color: COLORS.pinkChampagne },
  { id: '3', icon: '🏃', title: 'Evening Walk',     time: '6:00 PM', color: COLORS.lightPink },
];
let _remindersListeners = [];
export const getReminders       = () => _reminders;
export const setReminders       = (r) => { _reminders = r; _remindersListeners.forEach(fn => fn(r)); };
export const subscribeReminders = (fn) => {
  _remindersListeners.push(fn);
  return () => { _remindersListeners = _remindersListeners.filter(f => f !== fn); };
};

let _userName = 'Maya';
let _userNameListeners = [];
export const getUserName        = () => _userName;
export const setUserName        = (n) => { _userName = n; _userNameListeners.forEach(fn => fn(n)); };
export const subscribeUserName  = (fn) => {
  _userNameListeners.push(fn);
  return () => { _userNameListeners = _userNameListeners.filter(f => f !== fn); };
};

const ShopIcon = ({ color, size = 28 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Line x1="3" y1="6" x2="21" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <Path d="M16 10a4 4 0 01-8 0" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const NAV_TABS = [
  { key: 'Dashboard', label: 'Dashboard', Icon: DashboardIcon },
  { key: 'Calendar',  label: 'Calendar',  Icon: CalendarIcon },
  { key: 'Doctor',    label: 'Doctor',    Icon: DoctorIcon },
  { key: 'Social',    label: 'Social',    Icon: SocialIcon },
  { key: 'Shop',      label: 'Shop',      Icon: ShopIcon },
];

export default function HomeScreen({ navigation, route }) {
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const ringAnim  = useRef(new Animated.Value(0)).current;
  const botPulse  = useRef(new Animated.Value(1)).current;
  const ripple1   = useRef(new Animated.Value(1)).current;
  const ripple2   = useRef(new Animated.Value(1)).current;
  const botWiggle   = useRef(new Animated.Value(0)).current;
  const heartBeat   = useRef(new Animated.Value(1)).current;
  const bubbleFloat = useRef(new Animated.Value(0)).current;

  const [activeTab,       setActiveTab]       = useState('Dashboard');
  const [selectedMood,    setSelectedMood]    = useState(3);
  const [reminders,       setLocalReminders]  = useState(_reminders);
  const [userName,        setLocalUserName]   = useState(_userName);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
    Animated.timing(ringAnim, { toValue: 1, duration: 1200, delay: 400, useNativeDriver: false }).start();

    // Gentle pulse on bot FAB
    Animated.loop(
      Animated.sequence([
        Animated.timing(botPulse, { toValue: 1.08, duration: 1400, useNativeDriver: true }),
        Animated.timing(botPulse, { toValue: 1.00, duration: 1400, useNativeDriver: true }),
      ])
    ).start();

    // Expanding ripple rings
    const startRipple = (anim, delay, toVal, dur) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, { toValue: toVal, duration: dur, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 1,     duration: 0,   useNativeDriver: true }),
        ])
      ).start();
    };
    startRipple(ripple1, 0,    1.6, 1600);
    startRipple(ripple2, 700,  1.9, 1600);

    // Head wiggle every few seconds
    const wiggle = () => {
      Animated.sequence([
        Animated.delay(3000),
        Animated.timing(botWiggle, { toValue:  1, duration: 100, useNativeDriver: true }),
        Animated.timing(botWiggle, { toValue: -1, duration: 100, useNativeDriver: true }),
        Animated.timing(botWiggle, { toValue:  1, duration: 100, useNativeDriver: true }),
        Animated.timing(botWiggle, { toValue:  0, duration: 100, useNativeDriver: true }),
      ]).start(wiggle);
    };
    wiggle();

    // Heartbeat animation — double-pump like a real heartbeat
    Animated.loop(
      Animated.sequence([
        Animated.timing(heartBeat, { toValue: 1.28, duration: 120, useNativeDriver: true }),
        Animated.timing(heartBeat, { toValue: 1.0,  duration: 100, useNativeDriver: true }),
        Animated.timing(heartBeat, { toValue: 1.18, duration: 100, useNativeDriver: true }),
        Animated.timing(heartBeat, { toValue: 1.0,  duration: 120, useNativeDriver: true }),
        Animated.delay(1100),
      ])
    ).start();

    // Gentle vertical float
    Animated.loop(
      Animated.sequence([
        Animated.timing(bubbleFloat, { toValue: -5, duration: 1200, useNativeDriver: true }),
        Animated.timing(bubbleFloat, { toValue:  0, duration: 1200, useNativeDriver: true }),
      ])
    ).start();

    const unsubR = subscribeReminders((r) => setLocalReminders([...r]));
    const unsubU = subscribeUserName((n)  => setLocalUserName(n));
    return () => { unsubR(); unsubU(); };
  }, []);

  useEffect(() => { setLocalUserName(getUserName()); }, [route]);

  const cycleProgress = (CYCLE_DAY / CYCLE_TOTAL) * 100;
  const currentMood   = MOODS[selectedMood];
  const firstName     = userName.split(' ')[0] || userName;
  const initials      = userName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const hour          = new Date().getHours();
  const greeting      = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.lavenderBlush} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.blobTop} />
        <View style={styles.blobRight} />

        {/* ── TOP BAR ── */}
        <Animated.View style={[styles.topBar, { opacity: fadeAnim }]}>
          <View style={styles.avatarRow}>
            <TouchableOpacity style={styles.avatar} onPress={() => navigation.navigate('Profile')} activeOpacity={0.85}>
              <Text style={styles.avatarText}>{initials}</Text>
              <View style={styles.avatarEditDot} />
            </TouchableOpacity>
            <View>
              <Text style={styles.greeting}>{greeting}, {firstName} 👋</Text>
              <Text style={styles.dateText}>{TODAY}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.bellBtn}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Text style={styles.bellIcon}>🔔</Text>
            <View style={styles.bellDot} />
          </TouchableOpacity>
        </Animated.View>

        {/* ── CYCLE CARD ── */}
        <Animated.View style={[styles.cycleCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.cycleLeft}>
            <View style={styles.cyclePhaseBadge}>
              <Text style={styles.cyclePhaseBadgeText}>🌕 Ovulation Phase</Text>
            </View>
            <Text style={styles.cycleDayText}>Day {CYCLE_DAY}</Text>
            <Text style={styles.cycleDesc}>Your peak fertility window is open.</Text>
            <TouchableOpacity style={styles.insightBtn} onPress={() => navigation.navigate('Calendar')} activeOpacity={0.7}>
              <Text style={styles.insightBtnText}>View Insights →</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cycleRingWrapper}>
            <View style={styles.cycleRingOuter}>
              <View style={styles.cycleRingInner}>
                <Text style={styles.cycleRingNumber}>{CYCLE_DAY}</Text>
                <Text style={styles.cycleRingLabel}>of {CYCLE_TOTAL}</Text>
              </View>
            </View>
            <View style={styles.progressDotsRow}>
              {Array.from({ length: 7 }).map((_, i) => (
                <View key={i} style={[styles.progressDot, i < 3 ? styles.progressDotFilled : styles.progressDotEmpty]} />
              ))}
            </View>
          </View>
        </Animated.View>

        {/* ── CYCLE PROGRESS BAR ── */}
        <Animated.View style={[styles.progressBarCard, { opacity: fadeAnim }]}>
          <View style={styles.progressBarRow}>
            <Text style={styles.progressBarLabel}>Cycle Progress</Text>
            <Text style={styles.progressBarPct}>Day {CYCLE_DAY}/{CYCLE_TOTAL}</Text>
          </View>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, {
              width: ringAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', `${cycleProgress}%`] }),
            }]} />
            <View style={[styles.phaseMarker, { left: '25%' }]} />
            <View style={[styles.phaseMarker, { left: '50%' }]} />
            <View style={[styles.phaseMarker, { left: '75%' }]} />
          </View>
          <View style={styles.phaseLabelsRow}>
            {['Period', 'Follicular', 'Ovulation', 'Luteal'].map(p => (
              <Text key={p} style={styles.phaseLabel}>{p}</Text>
            ))}
          </View>
        </Animated.View>

        {/* ── QUICK STATS ── */}
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <Text style={styles.sectionTitle}>Quick Stats</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, styles.statCardPink]}>
              <View style={styles.statTopRow}><Text style={styles.statIcon}>💧</Text><Text style={styles.statPct}>80%</Text></View>
              <Text style={styles.statValue}>1.8L</Text>
              <Text style={styles.statLabel}>WATER</Text>
              <View style={styles.statBar}><View style={[styles.statBarFill, { width: '80%', backgroundColor: COLORS.watermelon }]} /></View>
            </View>
            <View style={[styles.statCard, styles.statCardPurple]}>
              <View style={styles.statTopRow}><Text style={styles.statIcon}>🌙</Text><Text style={styles.statPct}>+29</Text></View>
              <Text style={styles.statValue}>7h 20m</Text>
              <Text style={styles.statLabel}>SLEEP</Text>
              <View style={styles.statBar}><View style={[styles.statBarFill, { width: '74%', backgroundColor: COLORS.lightPink }]} /></View>
            </View>
            {/* Mood card */}
            <View style={[styles.statCard, styles.statCardMood]}>
              <Text style={styles.moodCardIcon}>{currentMood.emoji}</Text>
              <View style={styles.moodCardMiddle}>
                <Text style={styles.moodLabel}>MOOD</Text>
                <Text style={styles.moodValue}>{currentMood.label}</Text>
              </View>
              <View style={styles.moodDots}>
                {MOODS.map((m, i) => (
                  <TouchableOpacity key={i} style={[styles.moodDot, i === selectedMood && styles.moodDotActive]} onPress={() => setSelectedMood(i)} activeOpacity={0.75}>
                    <Text style={[styles.moodDotEmoji, i === selectedMood && styles.moodDotEmojiActive]}>{m.emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </Animated.View>

        {/* ── REMINDERS ── */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Reminders</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Reminders')}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          {reminders.length === 0 ? (
            <TouchableOpacity style={styles.emptyReminders} onPress={() => navigation.navigate('Reminders')}>
              <Text style={styles.emptyRemindersText}>＋ Add your first reminder</Text>
            </TouchableOpacity>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.remindersScroll}>
              {reminders.slice(0, 6).map(r => (
                <View key={r.id} style={[styles.reminderChip, { backgroundColor: r.color || COLORS.pastelPink }]}>
                  <Text style={styles.reminderIcon}>{r.icon}</Text>
                  <Text style={styles.reminderTitle}>{r.title}</Text>
                  <Text style={styles.reminderTime}>{r.time}</Text>
                </View>
              ))}
              <TouchableOpacity style={styles.addReminderChip} onPress={() => navigation.navigate('Reminders')}>
                <Text style={styles.addReminderIcon}>＋</Text>
                <Text style={styles.addReminderText}>Add</Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </Animated.View>

        {/* ── EXERCISE MODULES ── */}
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Exercise Modules</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Exercise')}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          {EXERCISE_MODULES.map((mod) => (
            <TouchableOpacity
              key={mod.id}
              style={[styles.exerciseCard, { backgroundColor: mod.bg, borderColor: mod.accent + '40' }]}
              onPress={() => navigation.navigate('ExerciseDetail', { module: mod })}
              activeOpacity={0.85}
            >
              <View style={[styles.exerciseAccentStrip, { backgroundColor: mod.accent }]} />
              <View style={[styles.exerciseIconCircle, { backgroundColor: mod.accent + '22' }]}>
                <Text style={styles.exerciseEmoji}>{mod.emoji}</Text>
              </View>
              <View style={styles.exerciseInfo}>
                <Text style={[styles.exerciseTitle, { color: mod.accent }]}>{mod.title}</Text>
                <Text style={styles.exerciseSubtitle}>{mod.subtitle}</Text>
                <Text style={[styles.exerciseCount, { color: mod.accent }]}>▶ {mod.videoCount} videos</Text>
              </View>
              <View style={[styles.exerciseArrow, { backgroundColor: mod.accent }]}>
                <Text style={styles.exerciseArrowText}>›</Text>
              </View>
            </TouchableOpacity>
          ))}
        </Animated.View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* ── CHATBOT FLOATING BUTTON ── */}
      {/* Ripple rings */}
      <Animated.View pointerEvents="none" style={[
        styles.chatFabRipple,
        { transform: [{ scale: ripple1 }],
          opacity: ripple1.interpolate({ inputRange: [1, 1.6], outputRange: [0.4, 0] }) }
      ]} />
      <Animated.View pointerEvents="none" style={[
        styles.chatFabRipple,
        { transform: [{ scale: ripple2 }],
          opacity: ripple2.interpolate({ inputRange: [1, 1.9], outputRange: [0.22, 0] }) }
      ]} />
      {/* FAB button */}
      <Animated.View style={[styles.chatFabWrapper, { transform: [{ scale: botPulse }] }]}>
        <TouchableOpacity
          style={styles.chatFab}
          onPress={() => navigation.navigate('Chatbot')}
          activeOpacity={0.85}
        >
          {/* Float wrapper */}
          <Animated.View style={{ transform: [{ translateY: bubbleFloat }] }}>
            {/* Wiggle wrapper */}
            <Animated.View style={{ transform: [{ rotate: botWiggle.interpolate({ inputRange: [-1, 0, 1], outputRange: ['-6deg', '0deg', '6deg'] }) }] }}>
              <ChatBubbleHeart size={46} />
            </Animated.View>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>

      {/* ── BOTTOM NAV ── */}
      <View style={styles.bottomNav}>
        {NAV_TABS.map(tab => {
          const isActive = activeTab === tab.key;
          const color = isActive ? COLORS.watermelon : COLORS.navInactive;
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.navTab}
              onPress={() => {
                setActiveTab(tab.key);
                if (tab.key === 'Calendar') navigation.navigate('Calendar');
                if (tab.key === 'Doctor')   navigation.navigate('Doctor');
                if (tab.key === 'Social')   navigation.navigate('Social');
                if (tab.key === 'Shop')     navigation.navigate('Shop');
              }}
              activeOpacity={0.7}
            >
              {isActive && <View style={styles.navActivePill} />}
              {isActive && <View style={styles.navActiveCircle} />}
              <tab.Icon color={color} size={26} />
              <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.lavenderBlush },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 12 },
  blobTop: { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: COLORS.pinkChampagne, opacity: 0.4, top: -60, right: -60 },
  blobRight: { position: 'absolute', width: 140, height: 140, borderRadius: 70, backgroundColor: COLORS.pastelPink, opacity: 0.25, top: 200, left: -40 },

  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: COLORS.watermelon, alignItems: 'center', justifyContent: 'center', shadowColor: COLORS.watermelon, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.35, shadowRadius: 8, elevation: 6, borderWidth: 2.5, borderColor: COLORS.white, position: 'relative' },
  avatarText: { color: COLORS.white, fontSize: 16, fontWeight: '800' },
  avatarEditDot: { position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.pinkChampagne, borderWidth: 1.5, borderColor: COLORS.white },
  greeting: { fontSize: 15, fontWeight: '700', color: COLORS.darkText },
  dateText: { fontSize: 11, color: COLORS.mutedText, letterSpacing: 0.8, fontWeight: '500' },
  bellBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: COLORS.pinkChampagne },
  bellIcon: { fontSize: 18 },
  bellDot: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.watermelon, borderWidth: 1.5, borderColor: COLORS.white },

  cycleCard: { backgroundColor: COLORS.white, borderRadius: 24, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, borderWidth: 1.5, borderColor: COLORS.pastelPink, shadowColor: COLORS.watermelon, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.12, shadowRadius: 16, elevation: 5 },
  cycleLeft: { flex: 1, paddingRight: 12 },
  cyclePhaseBadge: { backgroundColor: COLORS.lavenderBlush, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start', marginBottom: 8, borderWidth: 1, borderColor: COLORS.pastelPink },
  cyclePhaseBadgeText: { fontSize: 11, color: COLORS.watermelon, fontWeight: '700' },
  cycleDayText: { fontSize: 26, fontWeight: '800', color: COLORS.darkText, marginBottom: 4 },
  cycleDesc: { fontSize: 12, color: COLORS.mutedText, lineHeight: 18, marginBottom: 12 },
  insightBtn: { alignSelf: 'flex-start', paddingVertical: 6, paddingHorizontal: 12, backgroundColor: COLORS.lavenderBlush, borderRadius: 20, borderWidth: 1, borderColor: COLORS.pastelPink },
  insightBtnText: { fontSize: 13, color: COLORS.watermelon, fontWeight: '800' },
  cycleRingWrapper: { alignItems: 'center', gap: 8 },
  cycleRingOuter: { width: 80, height: 80, borderRadius: 40, borderWidth: 5, borderColor: COLORS.pastelPink, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.lavenderBlush },
  cycleRingInner: { alignItems: 'center' },
  cycleRingNumber: { fontSize: 24, fontWeight: '800', color: COLORS.watermelon, lineHeight: 28 },
  cycleRingLabel: { fontSize: 9, color: COLORS.mutedText, fontWeight: '600' },
  progressDotsRow: { flexDirection: 'row', gap: 3 },
  progressDot: { width: 6, height: 6, borderRadius: 3 },
  progressDotFilled: { backgroundColor: COLORS.watermelon },
  progressDotEmpty: { backgroundColor: COLORS.pinkChampagne },

  progressBarCard: { backgroundColor: COLORS.white, borderRadius: 18, padding: 16, marginBottom: 20, borderWidth: 1.5, borderColor: COLORS.pastelPink, shadowColor: COLORS.lightPink, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 2 },
  progressBarRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressBarLabel: { fontSize: 12, fontWeight: '700', color: COLORS.darkText },
  progressBarPct: { fontSize: 12, color: COLORS.mutedText, fontWeight: '600' },
  progressTrack: { height: 8, backgroundColor: COLORS.lavenderBlush, borderRadius: 4, overflow: 'hidden', marginBottom: 8, position: 'relative' },
  progressFill: { height: '100%', backgroundColor: COLORS.watermelon, borderRadius: 4 },
  phaseMarker: { position: 'absolute', top: 0, bottom: 0, width: 2, backgroundColor: COLORS.white, opacity: 0.8 },
  phaseLabelsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  phaseLabel: { fontSize: 9, color: COLORS.mutedText, fontWeight: '600' },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: COLORS.darkText, marginBottom: 12 },
  seeAll: { fontSize: 13, color: COLORS.watermelon, fontWeight: '700', marginBottom: 12 },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  statCard: { borderRadius: 20, padding: 16, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.12, shadowRadius: 8, elevation: 3 },
  statCardPink: { backgroundColor: COLORS.pinkChampagne, width: (width - 52) / 2, shadowColor: COLORS.lightPink },
  statCardPurple: { backgroundColor: '#EDE7F6', width: (width - 52) / 2, shadowColor: '#B39DDB' },
  statCardMood: { backgroundColor: COLORS.white, width: '100%', flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1.5, borderColor: COLORS.pastelPink, shadowColor: COLORS.lightPink, paddingVertical: 14 },
  moodCardIcon: { fontSize: 28, width: 36, textAlign: 'center' },
  moodCardMiddle: { width: 105 },
  moodLabel: { fontSize: 10, color: COLORS.mutedText, fontWeight: '700', letterSpacing: 1, marginBottom: 2 },
  moodValue: { fontSize: 14, fontWeight: '700', color: COLORS.darkText },
  moodDots: { flex: 1, flexDirection: 'row', justifyContent: 'flex-end', gap: 4 },
  moodDot: { width: 34, height: 34, borderRadius: 17, backgroundColor: COLORS.lavenderBlush, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'transparent' },
  moodDotActive: { backgroundColor: COLORS.watermelon, borderColor: COLORS.watermelon, shadowColor: COLORS.watermelon, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.4, shadowRadius: 6, elevation: 4 },
  moodDotEmoji: { fontSize: 16 },
  moodDotEmojiActive: { fontSize: 18 },
  statTopRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  statIcon: { fontSize: 20 },
  statPct: { fontSize: 11, color: COLORS.mutedText, fontWeight: '700' },
  statValue: { fontSize: 24, fontWeight: '800', color: COLORS.darkText, marginBottom: 2 },
  statLabel: { fontSize: 10, color: COLORS.mutedText, fontWeight: '700', letterSpacing: 1, marginBottom: 8 },
  statBar: { height: 4, backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 2, overflow: 'hidden' },
  statBarFill: { height: '100%', borderRadius: 2 },

  remindersScroll: { marginBottom: 24 },
  reminderChip: { borderRadius: 20, padding: 14, marginRight: 12, width: 120 },
  reminderIcon: { fontSize: 22, marginBottom: 6 },
  reminderTitle: { fontSize: 12, fontWeight: '700', color: COLORS.darkText, marginBottom: 3 },
  reminderTime: { fontSize: 11, color: COLORS.mutedText, fontWeight: '500' },
  addReminderChip: { borderRadius: 20, padding: 14, marginRight: 12, width: 90, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.white, borderWidth: 2, borderColor: COLORS.pastelPink, borderStyle: 'dashed' },
  addReminderIcon: { fontSize: 22, color: COLORS.watermelon, marginBottom: 4 },
  addReminderText: { fontSize: 11, color: COLORS.watermelon, fontWeight: '700' },
  emptyReminders: { backgroundColor: COLORS.white, borderRadius: 16, padding: 18, alignItems: 'center', borderWidth: 2, borderColor: COLORS.pastelPink, borderStyle: 'dashed', marginBottom: 24 },
  emptyRemindersText: { fontSize: 14, color: COLORS.watermelon, fontWeight: '700' },

  exerciseCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 1.5, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 3, overflow: 'hidden', position: 'relative' },
  exerciseAccentStrip: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 5 },
  exerciseIconCircle: { width: 54, height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center', marginRight: 14, marginLeft: 6 },
  exerciseEmoji: { fontSize: 26 },
  exerciseInfo: { flex: 1 },
  exerciseTitle: { fontSize: 15, fontWeight: '800', marginBottom: 3 },
  exerciseSubtitle: { fontSize: 12, color: COLORS.mutedText, marginBottom: 5 },
  exerciseCount: { fontSize: 12, fontWeight: '700' },
  exerciseArrow: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  exerciseArrowText: { color: COLORS.white, fontSize: 20, fontWeight: '300', lineHeight: 24 },


  // ── Chatbot FAB ──
  chatFabWrapper: {
    position: 'absolute',
    bottom: 118,
    right: 20,
    zIndex: 200,
  },
  chatFab: {
    width: 68, height: 68, borderRadius: 34,
    backgroundColor: COLORS.lavenderBlush,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2.5, borderColor: COLORS.pinkChampagne,
    shadowColor: COLORS.watermelon,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 14,
  },
  chatFabRipple: {
    position: 'absolute',
    bottom: 118, right: 20,
    width: 68, height: 68, borderRadius: 34,
    backgroundColor: COLORS.watermelon,
    zIndex: 198,
  },

  // Bottom nav
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingBottom: 28,       // generous bottom for home indicator
    paddingTop: 10,
    paddingHorizontal: 4,
    borderTopWidth: 1,
    borderTopColor: COLORS.pinkChampagne,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 16,
    minHeight: 72,           // ensures consistent height across devices
  },
  navTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,      // breathing room above/below icon+label
    paddingHorizontal: 2,
    position: 'relative',
    gap: 4,
  },
  navActivePill: {
    position: 'absolute',
    top: -10,
    width: 28,
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.watermelon,
  },
  navActiveCircle: {
    position: 'absolute',
    top: 2,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.lavenderBlush,
    zIndex: -1,
  },
  navLabel: {
    fontSize: 10,
    color: COLORS.navInactive,
    fontWeight: '500',
    marginTop: 1,
    letterSpacing: 0.2,
  },
  navLabelActive: { color: COLORS.watermelon, fontWeight: '700' },
});