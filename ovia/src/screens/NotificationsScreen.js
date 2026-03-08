import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
// ── Vector Icon helper ──
const Ico = ({ name, size = 20, color = '#E8748A' }) => (
  <Ionicons name={name} size={size} color={color} />
);

// ── Bell SVG Icon ──
const BellIcon = ({ color = '#E8748A', size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M13.73 21a2 2 0 0 1-3.46 0" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

const COLORS = {
  bg:          '#FDF0F3',
  card:        '#FFFFFF',
  rose:        '#E8748A',
  roseDark:    '#C95470',
  roseLight:   '#F5A8B8',
  roseFog:     '#FAD4DC',
  roseMist:    '#FDE8ED',
  roseCircle:  '#FDE8ED',
  purple:      '#A78FD0',
  green:       '#5BBF87',
  text:        '#2C1A20',
  sub:         '#8F6470',
  faint:       '#BFA0AA',
  white:       '#FFFFFF',
  // legacy aliases (keep for backward compat)
  lavenderBlush:  '#FDE8ED',
  pastelPink:     '#F5A8B8',
  lightPink:      '#F5A8B8',
  pinkChampagne:  '#FAD4DC',
  watermelon:     '#E8748A',
  deepPink:       '#C95470',
  darkText:       '#2C1A20',
  mutedText:      '#8F6470',
  navInactive:    '#BFA0AA',
  tickGreen:      '#5BBF87',
  crossRed:       '#F44336',
  error:          '#E05555',
};

// ── Notification type config ──
const TYPE_CONFIG = {
  reminder:   { icon: 'alarm', color: '#E8748A', bg: '#FDE8ED', label: 'Reminder' },
  cycle:      { icon: 'flower', color: '#E91E63', bg: '#FCE4EC', label: 'Cycle' },
  exercise:   { icon: 'body', color: '#AB47BC', bg: '#F3E5F5', label: 'Exercise' },
  health:     { icon: 'medical', color: '#4CAF50', bg: '#E8F5E9', label: 'Health' },
  community:  { icon: 'chatbubbles', color: '#1E88E5', bg: '#E3F2FD', label: 'Community' },
  tip:        { icon: 'bulb', color: '#FF9800', bg: '#FFF3E0', label: 'Tip' },
  doctor:     { icon: 'pulse', color: '#00ACC1', bg: '#E0F7FA', label: 'Doctor' },
};

const INITIAL_NOTIFICATIONS = [
  {
    id: '1',
    type: 'cycle',
    title: 'Ovulation Phase Starting',
    body: 'Your peak fertility window opens today. Track your symptoms and stay hydrated!',
    time: 'Just now',
    timeMs: Date.now(),
    read: false,
  },
  {
    id: '2',
    type: 'reminder',
    title: 'Iron Supplement',
    body: "Don't forget your 8:00 AM iron supplement. Consistency is key for your health.",
    time: '30 mins ago',
    timeMs: Date.now() - 30 * 60 * 1000,
    read: false,
  },
  {
    id: '3',
    type: 'exercise',
    title: 'New Exercise Module Added',
    body: 'Check out "Endometriosis Care" — a new low-impact routine added to your Exercise Modules.',
    time: '1 hour ago',
    timeMs: Date.now() - 60 * 60 * 1000,
    read: false,
  },
  {
    id: '4',
    type: 'community',
    title: 'Maya liked your post',
    body: 'Your story in the Community Feed received 12 new likes and 3 comments today.',
    time: '2 hours ago',
    timeMs: Date.now() - 2 * 60 * 60 * 1000,
    read: false,
  },
  {
    id: '5',
    type: 'tip',
    title: 'Hydration Reminder',
    body: "You've logged 1.2L of water today. Try to reach your 2L goal before bedtime.",
    time: '3 hours ago',
    timeMs: Date.now() - 3 * 60 * 60 * 1000,
    read: true,
  },
  {
    id: '6',
    type: 'cycle',
    title: 'Period in 5 Days',
    body: 'Your next period is predicted to start in 5 days. Stock up on your essentials!',
    time: 'Yesterday',
    timeMs: Date.now() - 24 * 60 * 60 * 1000,
    read: true,
  },
  {
    id: '7',
    type: 'doctor',
    title: 'Appointment Tomorrow',
    body: 'Dr. Appointment is scheduled for tomorrow. Prepare your cycle log to share.',
    time: 'Yesterday',
    timeMs: Date.now() - 26 * 60 * 60 * 1000,
    read: true,
  },
  {
    id: '8',
    type: 'health',
    title: 'Weekly Health Summary',
    body: 'You logged 5 of 7 days this week. Sleep average: 7h 20m. Mood trend: Positive',
    time: '2 days ago',
    timeMs: Date.now() - 2 * 24 * 60 * 60 * 1000,
    read: true,
  },
  {
    id: '9',
    type: 'exercise',
    title: 'Morning Yoga Streak',
    body: "You've completed yoga 3 days in a row! Keep it up to maintain your streak.",
    time: '2 days ago',
    timeMs: Date.now() - 2 * 24 * 60 * 60 * 1000,
    read: true,
  },
  {
    id: '10',
    type: 'tip',
    title: 'Cycle Insight',
    body: 'Based on your last 3 cycles, your average length is 28 days with a 5-day period.',
    time: '3 days ago',
    timeMs: Date.now() - 3 * 24 * 60 * 60 * 1000,
    read: true,
  },
];

const FILTER_TABS = [
  { key: 'all',    label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'cycle',  label: 'Cycle' },
  { key: 'health', label: 'Health' },
  { key: 'reminder', label: 'Reminders' },
];

export default function NotificationsScreen({ navigation }) {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState('all');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const filtered = notifications.filter(n => {
    if (activeFilter === 'all')    return true;
    if (activeFilter === 'unread') return !n.read;
    return n.type === activeFilter;
  });

  // Group by day
  const groups = [];
  const seen = new Set();
  filtered.forEach(n => {
    const group = n.time.includes('ago') || n.time === 'Just now' ? 'Today' : n.time;
    if (!seen.has(group)) { seen.add(group); groups.push(group); }
  });

  const handleMarkRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleDelete = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClearAll = () => {
    Alert.alert('Clear All', 'Remove all notifications?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: () => setNotifications([]) },
    ]);
  };

  const renderNotification = (notif) => {
    const cfg = TYPE_CONFIG[notif.type] || TYPE_CONFIG.tip;
    const slideIn = new Animated.Value(0);

    return (
      <TouchableOpacity
        key={notif.id}
        style={[
          styles.notifCard,
          !notif.read && styles.notifCardUnread,
          { borderLeftColor: cfg.color },
        ]}
        onPress={() => handleMarkRead(notif.id)}
        activeOpacity={0.8}
      >
        {/* Unread dot */}
        {!notif.read && <View style={[styles.unreadDot, { backgroundColor: cfg.color }]} />}

        {/* Icon */}
        <View style={[styles.notifIconBadge, { backgroundColor: cfg.bg }]}>
          <Ico name={cfg.icon} size={22} color={cfg.color} />
        </View>

        {/* Content */}
        <View style={styles.notifContent}>
          <View style={styles.notifTopRow}>
            <Text style={[styles.notifTitle, !notif.read && styles.notifTitleUnread]}>
              {notif.title}
            </Text>
            <View style={[styles.typeBadge, { backgroundColor: cfg.bg }]}>
              <Text style={[styles.typeBadgeText, { color: cfg.color }]}>{cfg.label}</Text>
            </View>
          </View>
          <Text style={styles.notifBody} numberOfLines={2}>{notif.body}</Text>
          <View style={styles.notifFooter}>
            <Text style={styles.notifTime}>{notif.time}</Text>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => handleDelete(notif.id)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
  <Ico name="close" size={16} color={COLORS.mutedText} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg || '#FDF0F3'} />

      {/* Decorative blobs */}
      <View style={styles.blob1} />
      <View style={styles.blob2} />

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <View style={styles.headerTitleRow}>
            <Text style={styles.headerTitle}>Notifications</Text>
            {unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </View>
          <Text style={styles.headerSub}>
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.moreBtn}
          onPress={() => Alert.alert(
            'Options',
            '',
            [
              { text: 'Mark all as read', onPress: handleMarkAllRead },
              { text: 'Clear all', style: 'destructive', onPress: handleClearAll },
              { text: 'Cancel', style: 'cancel' },
            ]
          )}
        >
          <Ico name="ellipsis-horizontal" size={18} color={COLORS.mutedText} />
        </TouchableOpacity>
      </View>

      {/* ── FILTER TABS ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterScrollContent}
      >
        {FILTER_TABS.map(tab => {
          const isActive = activeFilter === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
              onPress={() => setActiveFilter(tab.key)}
              activeOpacity={0.75}
            >
              <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                {tab.label}
              </Text>
              {/* Unread count badge on the 'unread' tab */}
              {tab.key === 'unread' && unreadCount > 0 && (
                <View style={[styles.filterCountBadge, isActive && styles.filterCountBadgeActive]}>
                  <Text style={[styles.filterCountText, isActive && styles.filterCountTextActive]}>{unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ── NOTIFICATIONS LIST ── */}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        style={{ opacity: fadeAnim }}
      >
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <BellIcon color='#F5A8B8' size={52} />
            <Text style={styles.emptyTitle}>
              {activeFilter === 'unread' ? 'All caught up!' : 'No notifications'}
            </Text>
            <Text style={styles.emptySub}>
              {activeFilter === 'unread'
                ? "You've read all your notifications"
                : 'Check back later for updates'}
            </Text>
          </View>
        ) : (
          groups.map(group => {
            const groupNotifs = filtered.filter(n => {
              const g = n.time.includes('ago') || n.time === 'Just now' ? 'Today' : n.time;
              return g === group;
            });
            return (
              <View key={group}>
                {/* Day divider */}
                <View style={styles.groupHeader}>
                  <View style={styles.groupLine} />
                  <Text style={styles.groupLabel}>{group}</Text>
                  <View style={styles.groupLine} />
                </View>
                {groupNotifs.map(n => renderNotification(n))}
              </View>
            );
          })
        )}

        {/* Mark all read CTA */}
        {unreadCount > 0 && (
          <TouchableOpacity style={styles.markAllBtn} onPress={handleMarkAllRead}>
            <View style={{flexDirection:"row",alignItems:"center",gap:4}}><Ico name="checkmark-done" size={14} color={COLORS.watermelon}/><Text style={styles.markAllBtnText}>Mark all as read</Text></View>
          </TouchableOpacity>
        )}

        <View style={{ height: 40 }} />
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bg || '#FDF0F3' },
  blob1: { position: 'absolute', width: 220, height: 220, borderRadius: 110, backgroundColor: '#FAD4DC', opacity: 0.35, top: -70, right: -70 },
  blob2: { position: 'absolute', width: 150, height: 150, borderRadius: 75, backgroundColor: COLORS.pastelPink, opacity: 0.2, bottom: 80, left: -50 },

  // ── Header ──
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14,
  },
  backBtn: {
    backgroundColor: COLORS.white, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1.5, borderColor: '#FAD4DC',
  },
  backArrow: { fontSize: 13, color: '#E8748A', fontWeight: '700' },
  headerCenter: { alignItems: 'center' },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 19, fontWeight: '800', color: COLORS.darkText },
  unreadBadge: {
    backgroundColor: '#E8748A', borderRadius: 12,
    paddingHorizontal: 8, paddingVertical: 2, minWidth: 22, alignItems: 'center',
  },
  unreadBadgeText: { color: COLORS.white, fontSize: 11, fontWeight: '800' },
  headerSub: { fontSize: 11, color: COLORS.mutedText, fontWeight: '500', marginTop: 2 },
  moreBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: '#FAD4DC',
  },
  moreBtnText: { fontSize: 18, color: COLORS.darkText, fontWeight: '800', lineHeight: 22 },

  // ── Filter chips ──
  filterScroll: { flexGrow: 0, marginBottom: 14 },
  filterScrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    paddingRight: 30,
    alignItems: 'center',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 34,
    paddingHorizontal: 16,
    borderRadius: 17,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: '#F5A8B8',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: COLORS.rose || '#E8748A', borderColor: COLORS.rose || '#E8748A',
    shadowColor: '#D06070', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3, shadowRadius: 6, elevation: 4,
  },
  filterChipText: { fontSize: 13, fontWeight: '600', color: COLORS.mutedText, lineHeight: 18 },
  filterChipTextActive: { color: COLORS.white, fontWeight: '700' },
  filterCountBadge: {
    backgroundColor: '#FDE8ED',
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 5,
    marginLeft: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterCountBadgeActive: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  filterCountText: { fontSize: 11, color: '#E8748A', fontWeight: '800', lineHeight: 14 },
  filterCountTextActive: { color: COLORS.white },

  // ── List ──
  listContent: { paddingHorizontal: 20, paddingTop: 4 },

  // ── Group header ──
  groupHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12, marginTop: 6 },
  groupLine: { flex: 1, height: 1, backgroundColor: '#FAD4DC' },
  groupLabel: { fontSize: 11, fontWeight: '700', color: COLORS.mutedText, letterSpacing: 0.8, textTransform: 'uppercase' },

  // ── Notification card ──
  notifCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.readBg,
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#FAD4DC',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  notifCardUnread: {
    backgroundColor: COLORS.unreadBg,
    borderColor: '#F5A8B8',
    shadowOpacity: 0.1,
    elevation: 3,
  },
  unreadDot: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  notifIconBadge: {
    width: 46, height: 46, borderRadius: 23,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 12, flexShrink: 0,
  },
  notifIconEmoji: { fontSize: 22 },
  notifContent: { flex: 1 },
  notifTopRow: {
    flexDirection: 'row', alignItems: 'flex-start',
    justifyContent: 'space-between', marginBottom: 4, gap: 8,
  },
  notifTitle: {
    fontSize: 14, fontWeight: '600', color: COLORS.mutedText,
    flex: 1, lineHeight: 19,
  },
  notifTitleUnread: { fontWeight: '800', color: COLORS.darkText },
  typeBadge: {
    borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3,
    flexShrink: 0,
  },
  typeBadgeText: { fontSize: 9, fontWeight: '700', letterSpacing: 0.3 },
  notifBody: {
    fontSize: 13, color: COLORS.mutedText,
    lineHeight: 18, marginBottom: 8,
  },
  notifFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  notifTime: { fontSize: 11, color: COLORS.pastelPink, fontWeight: '600' },
  deleteBtn: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: '#FDE8ED',
    alignItems: 'center', justifyContent: 'center',
  },
  deleteBtnText: { fontSize: 10, color: COLORS.mutedText, fontWeight: '700' },

  // Mark all CTA
  markAllBtn: {
    backgroundColor: COLORS.white, borderRadius: 16,
    paddingVertical: 13, alignItems: 'center',
    borderWidth: 2, borderColor: '#F5A8B8',
    marginTop: 4,
  },
  markAllBtnText: { fontSize: 14, color: '#E8748A', fontWeight: '700' },

  // Empty state
  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyEmoji: { fontSize: 52, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: COLORS.darkText, marginBottom: 8 },
  emptySub: { fontSize: 14, color: COLORS.mutedText, textAlign: 'center', lineHeight: 20 },
});