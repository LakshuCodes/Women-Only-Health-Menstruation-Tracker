import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert, Modal, KeyboardAvoidingView, Platform,
  StatusBar, Dimensions, Image, Switch, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Rect, Line, Circle, Ellipse } from 'react-native-svg';
import { getUserName, setUserName } from './HomeScreen';

const { width } = Dimensions.get('window');
const Ico = ({ name, size = 20, color = '#E8748A' }) => <Ionicons name={name} size={size} color={color} />;

// ── Soft rose palette matching dashboard ──
const C = {
  bg:         '#FDF0F3',
  card:       '#FFFFFF',
  rose:       '#E8748A',
  roseDark:   '#C95470',
  roseLight:  '#F5A8B8',
  roseFog:    '#FAD4DC',
  roseMist:   '#FDE8ED',
  roseCircle: '#FADADF',
  purple:     '#A78FD0',
  green:      '#5BBF87',
  text:       '#2C1A20',
  sub:        '#8F6470',
  faint:      '#BFA0AA',
  white:      '#FFFFFF',
  error:      '#E05555',
};

const cardShadow = {
  shadowColor: '#D06070',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.08,
  shadowRadius: 12,
  elevation: 3,
};

// ── Shared email store ──
let _userEmail = 'maya@example.com';
export const getUserEmail = () => _userEmail;
export const setUserEmail = (e) => { _userEmail = e; };

// ─────────────────────────────────────────
// SUB-SCREEN: Notifications
// ─────────────────────────────────────────
function NotificationsSubScreen({ onBack }) {
  const [settings, setSettings] = useState({
    personalAdvice: true, periodSoon: true, ovulation: false,
    periodEnd: false, periodStart: true, contraception: false,
    waterReminder: false, sleepReminder: true, exerciseReminder: false,
  });
  const toggle = (k) => setSettings(p => ({ ...p, [k]: !p[k] }));

  const SectionHead = ({ title }) => (
    <Text style={nS.sHead}>{title}</Text>
  );
  const Row = ({ label, sub, k }) => (
    <View style={nS.row}>
      <View style={{ flex: 1 }}>
        <Text style={nS.rowLbl}>{label}</Text>
        {sub ? <Text style={nS.rowSub}>{sub}</Text> : null}
      </View>
      <Switch value={settings[k]} onValueChange={() => toggle(k)}
        trackColor={{ false: C.roseFog, true: C.rose }}
        thumbColor={C.white} ios_backgroundColor={C.roseFog}
      />
    </View>
  );

  return (
    <SafeAreaView style={S.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      <SubHeader title="Notifications" onBack={onBack} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 48, paddingTop: 8 }}>
        {[
          { title: 'Content', rows: [{ label: 'Personal advice', sub: 'On', k: 'personalAdvice' }] },
          { title: 'Cycle', rows: [
            { label: 'Period in a couple of days', sub: '10:00 AM', k: 'periodSoon' },
            { label: 'Ovulation', sub: 'Off', k: 'ovulation' },
            { label: 'Period end', sub: 'Off', k: 'periodEnd' },
            { label: 'Period start', sub: '10:00 AM', k: 'periodStart' },
          ]},
          { title: 'Medication', rows: [{ label: 'Contraception', sub: 'Off', k: 'contraception' }] },
          { title: 'Lifestyle', rows: [
            { label: 'Daily water reminder', k: 'waterReminder' },
            { label: 'Sleep reminder', k: 'sleepReminder' },
            { label: 'Exercise reminder', k: 'exerciseReminder' },
          ]},
        ].map((sec, si) => (
          <View key={si} style={nS.card}>
            <SectionHead title={sec.title} />
            {sec.rows.map((r, ri) => (
              <View key={ri}>
                <Row {...r} />
                {ri < sec.rows.length - 1 && <View style={nS.div} />}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
const nS = StyleSheet.create({
  card: { backgroundColor: C.white, marginHorizontal: 18, marginTop: 14, borderRadius: 20, overflow: 'hidden', ...cardShadow },
  sHead: { fontSize: 11, fontWeight: '800', color: C.rose, paddingHorizontal: 18, paddingTop: 16, paddingBottom: 6, letterSpacing: 0.8, textTransform: 'uppercase' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingVertical: 14 },
  rowLbl: { fontSize: 15, fontWeight: '600', color: C.text },
  rowSub: { fontSize: 12, color: C.sub, marginTop: 2 },
  div: { height: 1, backgroundColor: C.roseMist, marginHorizontal: 18 },
});

// ─────────────────────────────────────────
// SUB-SCREEN: Privacy & Security
// ─────────────────────────────────────────
function PrivacySubScreen({ onBack }) {
  const [showModal, setShowModal] = useState(false);
  const items = [
    { icon: 'shield-checkmark', title: 'Ovia Privacy Explained', sub: 'How Ovia keeps your data safe', onPress: () => setShowModal(true) },
    { icon: 'information-circle', title: 'Request Information', sub: 'Find out what data we hold about you', onPress: () => Alert.alert('Data Request', 'A report will be sent to your email within 48 hours.', [{ text: 'Request' }, { text: 'Cancel', style: 'cancel' }]) },
    { icon: 'person', title: 'Change Account Details', sub: 'Update your name or email address', onPress: () => Alert.alert('Account Details', 'Contact support@oviahealth.com to update your email.', [{ text: 'OK' }]) },
    { icon: 'document-text', title: 'Manage Your Consents', sub: 'Choose and control your privacy options', onPress: () => Alert.alert('Manage Consents', 'You can opt out of analytics and personalised content at any time.', [{ text: 'Manage' }, { text: 'Cancel', style: 'cancel' }]) },
    { icon: 'trash', title: 'Delete My Account', sub: 'Permanently delete account and all data', danger: true, onPress: () => Alert.alert('Delete Account', 'This will permanently delete your account and ALL health data. This cannot be undone.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete Forever', style: 'destructive', onPress: () => Alert.alert('Account Deleted', 'Your account has been scheduled for deletion.') }]) },
  ];

  return (
    <SafeAreaView style={S.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      <SubHeader title="Privacy & Security" onBack={onBack} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 48, paddingTop: 8 }}>
        <View style={[pS.card, { marginTop: 14 }]}>
          {items.map((item, idx) => (
            <View key={idx}>
              <TouchableOpacity style={pS.row} onPress={item.onPress} activeOpacity={0.7}>
                <View style={[pS.badge, item.danger && { backgroundColor: '#FFECEC' }]}>
                  <Ico name={item.icon} size={19} color={item.danger ? C.error : C.rose} />
                </View>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={[pS.rowT, item.danger && { color: C.error }]}>{item.title}</Text>
                  <Text style={pS.rowS}>{item.sub}</Text>
                </View>
                <Ico name="chevron-forward" size={16} color={C.roseFog} />
              </TouchableOpacity>
              {idx < items.length - 1 && <View style={pS.div} />}
            </View>
          ))}
        </View>
        <View style={pS.protCard}>
          <View style={pS.lockRing}><Ico name="lock-closed" size={30} color={C.rose} /></View>
          <Text style={pS.protT}>Your data is protected</Text>
          <Text style={pS.protS}>We never sell your data and you can delete it at any time.</Text>
          <TouchableOpacity style={pS.learnBtn} onPress={() => setShowModal(true)}>
            <Text style={pS.learnTxt}>Learn more</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Modal visible={showModal} animationType="slide" transparent onRequestClose={() => setShowModal(false)}>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <View style={pS.modal}>
            <View style={pS.modalHandle} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={pS.modalT}>Ovia Privacy Explained</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}><Ico name="close" size={22} color={C.sub} /></TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {[
                { t: 'Your data stays yours', b: 'All your cycle, health, and personal data belongs to you alone. Ovia never sells or rents your data to third parties.' },
                { t: 'Health data is sensitive', b: "We treat menstrual and health data with the highest level of care. It's encrypted end-to-end and never shared without your explicit consent." },
                { t: 'Analytics are anonymous', b: 'If you opt into analytics, all data is anonymised and aggregated. We use it only to improve app features.' },
                { t: 'Right to deletion', b: 'You can permanently delete your account and all associated data at any time from Privacy Settings.' },
                { t: 'GDPR & DPDP compliant', b: "Ovia complies with GDPR (Europe) and India's Digital Personal Data Protection Act." },
              ].map((item, i) => (
                <View key={i} style={pS.point}>
                  <Text style={pS.pointT}>{item.t}</Text>
                  <Text style={pS.pointB}>{item.b}</Text>
                </View>
              ))}
              <View style={{ height: 20 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
const pS = StyleSheet.create({
  card: { backgroundColor: C.white, marginHorizontal: 18, borderRadius: 22, overflow: 'hidden', ...cardShadow },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16 },
  badge: { width: 44, height: 44, borderRadius: 22, backgroundColor: C.roseMist, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  rowT: { fontSize: 15, fontWeight: '700', color: C.text, marginBottom: 2 },
  rowS: { fontSize: 12, color: C.sub, lineHeight: 16 },
  div: { height: 1, backgroundColor: C.roseMist, marginHorizontal: 16 },
  protCard: { backgroundColor: C.white, marginHorizontal: 18, marginTop: 18, borderRadius: 22, padding: 24, alignItems: 'center', ...cardShadow },
  lockRing: { width: 64, height: 64, borderRadius: 32, backgroundColor: C.roseMist, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  protT: { fontSize: 16, fontWeight: '800', color: C.text, marginBottom: 8 },
  protS: { fontSize: 13, color: C.sub, textAlign: 'center', lineHeight: 20, marginBottom: 16 },
  learnBtn: { borderWidth: 1.5, borderColor: C.rose, borderRadius: 20, paddingHorizontal: 24, paddingVertical: 10 },
  learnTxt: { fontSize: 13, fontWeight: '700', color: C.rose },
  modal: { backgroundColor: C.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 22, maxHeight: '85%' },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: C.roseFog, alignSelf: 'center', marginBottom: 18 },
  modalT: { fontSize: 17, fontWeight: '800', color: C.text },
  point: { backgroundColor: C.roseMist, borderRadius: 14, padding: 16, marginBottom: 10 },
  pointT: { fontSize: 14, fontWeight: '800', color: C.text, marginBottom: 5 },
  pointB: { fontSize: 13, color: C.sub, lineHeight: 20 },
});

// ─────────────────────────────────────────
// SUB-SCREEN: Help & Features
// ─────────────────────────────────────────
function HelpSubScreen({ onBack }) {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);

  const CATS = [
    { icon: 'rocket',        title: 'Getting Started',    bg: '#FFF3E0' },
    { icon: 'person',        title: 'Account & Data',     bg: '#E8F5E9' },
    { icon: 'flower',        title: 'Using Ovia',         bg: '#FDE8ED' },
    { icon: 'card',          title: 'Subscriptions',      bg: '#E3F2FD' },
    { icon: 'construct',     title: 'Troubleshooting',    bg: '#F3E5F5' },
    { icon: 'lock-closed',   title: 'Privacy',            bg: '#E0F7FA' },
    { icon: 'help-circle',   title: 'General',            bg: '#FFF8E1' },
    { icon: 'people',        title: 'For Partners',       bg: '#FDE8ED' },
  ];

  const FAQ = [
    { q: 'How does Ovia track my cycle?', a: 'Ovia uses the dates you log to predict your next period, fertile window, and ovulation day. The more you log, the more accurate your predictions become.' },
    { q: 'How do I log my period?', a: 'Tap the Calendar tab → select the start date → tap "+ Add Task" → add a Period entry.' },
    { q: 'What is the Chatbot for?', a: "The Ovia AI chatbot answers women's health questions — periods, PCOS, pregnancy, nutrition, and mental health." },
    { q: 'How do I set reminders?', a: 'Go to the Reminders section from the Home screen → tap "+ Add". You can set pill reminders, appointment reminders, and more.' },
    { q: 'How do I find exercises for PCOS?', a: 'Go to Exercise Modules → filter by PCOS. You\'ll see yoga and workout videos specifically for PCOS management.' },
    { q: 'Can I see doctors in the app?', a: 'Yes! The Doctor tab shows recommended specialists — gynecologists, therapists, nutritionists, and fertility experts.' },
    { q: 'What does the Shop section do?', a: 'The Shop tab shows curated period & wellness products. Tapping Amazon or Flipkart opens product search directly.' },
    { q: 'How do I delete my account?', a: 'Go to Profile → Privacy & Security → Delete My Account. This permanently removes all your data.' },
    { q: 'Is my health data private?', a: 'Yes. Your data is encrypted and never sold. Read our full policy in Profile → Privacy & Security.' },
    { q: 'How does Daily Tasks reset work?', a: 'Daily tasks reset every midnight. Your previous tasks are saved — tap any past date to review them.' },
  ];

  const filtered = FAQ.filter(f => !search || f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()));

  return (
    <SafeAreaView style={S.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      <SubHeader title="Help & Features" onBack={onBack} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 48 }}>
        <View style={hS.hero}>
          <Text style={hS.heroT}>How can Ovia help?</Text>
          <View style={hS.searchBar}>
            <Ico name="search" size={16} color={C.sub} />
            <TextInput style={hS.searchIn} placeholder="Search questions…" placeholderTextColor={C.faint} value={search} onChangeText={setSearch} />
            {search.length > 0 && <TouchableOpacity onPress={() => setSearch('')}><Ico name="close-circle" size={18} color={C.sub} /></TouchableOpacity>}
          </View>
        </View>
        {!search && (
          <>
            <Text style={hS.secT}>Browse by Topic</Text>
            <View style={hS.grid}>
              {CATS.map((cat, i) => (
                <TouchableOpacity key={i} style={[hS.gridCard, { backgroundColor: cat.bg }]} activeOpacity={0.75}
                  onPress={() => Alert.alert(cat.title, `Tap an FAQ below for more about "${cat.title}".`)}>
                  <Ico name={cat.icon} size={28} color={C.rose} />
                  <Text style={hS.gridLbl}>{cat.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
        <Text style={hS.secT}>{search ? `Results for "${search}"` : 'Frequently Asked Questions'}</Text>
        {filtered.length === 0 && (
          <View style={hS.empty}><Ico name="help-circle-outline" size={44} color={C.roseFog} /><Text style={hS.emptyT}>No results. Try different keywords.</Text></View>
        )}
        <View style={hS.faqCard}>
          {filtered.map((item, idx) => (
            <View key={idx}>
              <TouchableOpacity style={hS.faqRow} onPress={() => setExpanded(expanded === idx ? null : idx)} activeOpacity={0.75}>
                <Text style={hS.faqQ} numberOfLines={expanded === idx ? 0 : 2}>{item.q}</Text>
                <Ico name={expanded === idx ? 'chevron-up' : 'chevron-down'} size={14} color={C.rose} />
              </TouchableOpacity>
              {expanded === idx && <View style={hS.faqA}><Text style={hS.faqAT}>{item.a}</Text></View>}
              {idx < filtered.length - 1 && <View style={hS.div} />}
            </View>
          ))}
        </View>
        <View style={hS.supportCard}>
          <View style={hS.supportIco}><Ico name="chatbubbles" size={30} color={C.rose} /></View>
          <Text style={hS.supportT}>Still need help?</Text>
          <Text style={hS.supportS}>Our support team is here for you.</Text>
          <TouchableOpacity style={hS.supportBtn} onPress={() => Alert.alert('Contact Support', 'Email us at support@oviahealth.com\nWe respond within 24 hours.')}>
            <Text style={hS.supportBT}>Contact Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const hS = StyleSheet.create({
  hero: { backgroundColor: C.roseMist, margin: 18, borderRadius: 22, padding: 20 },
  heroT: { fontSize: 20, fontWeight: '800', color: C.text, marginBottom: 14 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.white, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 11, gap: 10 },
  searchIn: { flex: 1, fontSize: 14, color: C.text },
  secT: { fontSize: 15, fontWeight: '800', color: C.text, marginHorizontal: 18, marginTop: 20, marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: 14, gap: 10 },
  gridCard: { width: (width - 46) / 2, borderRadius: 18, padding: 18, alignItems: 'center', gap: 8, ...cardShadow },
  gridLbl: { fontSize: 12, fontWeight: '700', color: C.text, textAlign: 'center' },
  faqCard: { backgroundColor: C.white, marginHorizontal: 18, borderRadius: 22, overflow: 'hidden', ...cardShadow },
  faqRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingVertical: 16 },
  faqQ: { flex: 1, fontSize: 14, fontWeight: '700', color: C.text, marginRight: 10 },
  faqA: { backgroundColor: C.roseMist, paddingHorizontal: 18, paddingVertical: 14 },
  faqAT: { fontSize: 13, color: C.sub, lineHeight: 20 },
  div: { height: 1, backgroundColor: C.roseMist, marginHorizontal: 18 },
  empty: { alignItems: 'center', paddingVertical: 30, gap: 8 },
  emptyT: { fontSize: 13, color: C.sub, textAlign: 'center' },
  supportCard: { backgroundColor: C.white, marginHorizontal: 18, marginTop: 18, borderRadius: 22, padding: 24, alignItems: 'center', ...cardShadow },
  supportIco: { width: 60, height: 60, borderRadius: 30, backgroundColor: C.roseMist, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  supportT: { fontSize: 16, fontWeight: '800', color: C.text, marginBottom: 6 },
  supportS: { fontSize: 13, color: C.sub, marginBottom: 16 },
  supportBtn: { backgroundColor: C.rose, borderRadius: 20, paddingHorizontal: 28, paddingVertical: 12, shadowColor: C.rose, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 5 },
  supportBT: { color: C.white, fontSize: 14, fontWeight: '800' },
});

// ─────────────────────────────────────────
// Shared Sub-Header component
// ─────────────────────────────────────────
function SubHeader({ title, onBack }) {
  return (
    <View style={S.subHead}>
      <TouchableOpacity style={S.subBack} onPress={onBack} activeOpacity={0.75}>
        <Ico name="chevron-back" size={20} color={C.rose} />
      </TouchableOpacity>
      <Text style={S.subTitle}>{title}</Text>
      <View style={{ width: 38 }} />
    </View>
  );
}

// ═══════════════════════════════════════════════
// MAIN PROFILE SCREEN
// ═══════════════════════════════════════════════
export default function ProfileScreen({ navigation }) {
  const [userName,     setLocalName]  = useState(getUserName());
  const [userEmail]                   = useState(getUserEmail());
  const [profileImage, setProfileImage] = useState(null);
  const [showEdit,     setShowEdit]   = useState(false);
  const [editName,     setEditName]   = useState(getUserName());
  const [editErr,      setEditErr]    = useState('');
  const [subScreen,    setSubScreen]  = useState(null);
  const [pickerError,  setPickerError] = useState(false);

  // Entrance animation
  const fadeA  = useRef(new Animated.Value(0)).current;
  const slideA = useRef(new Animated.Value(20)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeA,  { toValue: 1, duration: 550, useNativeDriver: true }),
      Animated.timing(slideA, { toValue: 0, duration: 450, useNativeDriver: true }),
    ]).start();
  }, []);

  const initials = userName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  // ── Gallery photo picker ──
  const handleAvatarPress = () => {
    const options = [
      { text: 'Choose from Gallery', onPress: pickFromGallery },
      { text: 'Take Photo', onPress: takePhoto },
    ];
    if (profileImage) options.push({ text: 'Remove Photo', style: 'destructive', onPress: () => setProfileImage(null) });
    options.push({ text: 'Cancel', style: 'cancel' });
    Alert.alert('Profile Photo', 'Update your profile picture', options);
  };

  const pickFromGallery = async () => {
    let IP;
    try { IP = require('expo-image-picker'); } catch { IP = null; }
    if (!IP) {
      setPickerError(true);
      return;
    }
    try {
      const { status } = await IP.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please allow access to your photo library in Settings.');
        return;
      }
      const result = await IP.launchImageLibraryAsync({
        mediaTypes: IP.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });
      if (!result.canceled && result.assets?.[0]?.uri) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (e) {
      Alert.alert('Error', 'Could not open gallery. Please try again.');
    }
  };

  const takePhoto = async () => {
    let IP;
    try { IP = require('expo-image-picker'); } catch { IP = null; }
    if (!IP) {
      setPickerError(true);
      return;
    }
    try {
      const { status } = await IP.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please allow camera access in Settings.');
        return;
      }
      const result = await IP.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.85 });
      if (!result.canceled && result.assets?.[0]?.uri) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (e) {
      Alert.alert('Error', 'Could not open camera. Please try again.');
    }
  };

  const handleSave = () => {
    if (!editName.trim()) { setEditErr('Name cannot be empty'); return; }
    const n = editName.trim();
    setLocalName(n);
    setUserName(n);
    setShowEdit(false);
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Login' }] }) },
    ]);
  };

  // ── Sub-screen routing ──
  if (subScreen === 'notifications') return <NotificationsSubScreen onBack={() => setSubScreen(null)} />;
  if (subScreen === 'privacy')       return <PrivacySubScreen       onBack={() => setSubScreen(null)} />;
  if (subScreen === 'help')          return <HelpSubScreen          onBack={() => setSubScreen(null)} />;

  const SETTINGS = [
    { key: 'notifications', icon: 'notifications', label: 'Notifications',    sub: 'Cycle, medication & lifestyle alerts', onPress: () => setSubScreen('notifications') },
    { key: 'privacy',       icon: 'shield-checkmark', label: 'Privacy & Security', sub: 'Account details, data & deletion',   onPress: () => setSubScreen('privacy') },
    { key: 'subscription',  icon: 'card',          label: 'My Subscription',  sub: 'Manage your Ovia Premium plan',       onPress: () => Alert.alert('Subscription', 'Premium plan is active ✨') },
    { key: 'help',          icon: 'help-circle',   label: 'Help & Features',  sub: 'FAQs, how-to guides, contact support', onPress: () => setSubScreen('help') },
  ];

  return (
    <SafeAreaView style={S.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={S.scrollContent}>

        {/* ════════ HERO SECTION ════════ */}
        <View style={S.hero}>
          {/* Decorative soft blobs */}
          <View style={S.heroBlob1} />
          <View style={S.heroBlob2} />
          <View style={S.heroBlob3} />

          {/* Back button */}
          <TouchableOpacity style={S.heroBack} onPress={() => navigation.goBack()} activeOpacity={0.75}>
            <Ico name="chevron-back" size={20} color={C.rose} />
          </TouchableOpacity>

          {/* Title */}
          <Text style={S.heroTitle}>My Profile</Text>

          {/* ── Avatar with gallery tap ── */}
          <TouchableOpacity style={S.avatarWrap} onPress={handleAvatarPress} activeOpacity={0.88}>
            <View style={S.avatarRing}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={S.avatarImg} />
              ) : (
                <View style={S.avatarFallback}>
                  <Text style={S.avatarIni}>{initials}</Text>
                </View>
              )}
            </View>
            {/* Camera badge */}
            <View style={S.camBadge}>
              <Ico name="camera" size={13} color={C.white} />
            </View>
          </TouchableOpacity>

          {/* Gallery tap hint */}
          <Text style={S.avatarHint}>Tap to change photo</Text>
        </View>

        {/* ════════ INFO CARD ════════ */}
        <Animated.View style={[S.infoCard, { opacity: fadeA, transform: [{ translateY: slideA }] }]}>
          <Text style={S.infoName}>{userName}</Text>
          <Text style={S.infoEmail}>{userEmail}</Text>

          {/* Premium badge */}
          <View style={S.premBadge}>
            <View style={S.premDot} />
            <Text style={S.premTxt}>Premium Status: Active</Text>
          </View>

          {/* Action buttons */}
          <View style={S.actionRow}>
            <TouchableOpacity
              style={S.editBtn}
              onPress={() => { setEditName(userName); setEditErr(''); setShowEdit(true); }}
              activeOpacity={0.85}
            >
              <Ico name="create-outline" size={16} color={C.white} />
              <Text style={S.editBtnTxt}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={S.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
              <Ico name="log-out-outline" size={16} color={C.sub} />
              <Text style={S.logoutBtnTxt}>Logout</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* ════════ SETTINGS ════════ */}
        <Animated.View style={[S.settingsWrap, { opacity: fadeA }]}>
          <Text style={S.secTitle}>Settings</Text>
          <View style={S.settingsCard}>
            {SETTINGS.map((item, idx) => (
              <TouchableOpacity
                key={item.key}
                style={[S.settRow, idx < SETTINGS.length - 1 && S.settRowBorder]}
                activeOpacity={0.7}
                onPress={item.onPress}
              >
                <View style={S.settIcoBg}>
                  <Ico name={item.icon} size={19} color={C.rose} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={S.settLabel}>{item.label}</Text>
                  <Text style={S.settSub}>{item.sub}</Text>
                </View>
                <Ico name="chevron-forward" size={16} color={C.roseFog} />
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* ════════ FOOTER ════════ */}
        <Animated.View style={[S.footer, { opacity: fadeA }]}>
          <Text style={S.footerTxt}>Ovia Health · Version 1.0.0</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Ico name="heart" size={12} color={C.roseLight} />
            <Text style={S.footerTxt}>Made with love</Text>
          </View>
        </Animated.View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ════════ INSTALL BANNER MODAL ════════ */}
      <Modal visible={pickerError} animationType="fade" transparent onRequestClose={() => setPickerError(false)}>
        <View style={S.installOverlay}>
          <View style={S.installCard}>
            <View style={S.installIconWrap}>
              <Ico name="image-outline" size={32} color={C.rose} />
            </View>
            <Text style={S.installTitle}>One-time setup needed</Text>
            <Text style={S.installDesc}>
              To enable gallery & camera access, run this command in your project terminal:
            </Text>
            <View style={S.installCmd}>
              <Text style={S.installCmdTxt}>npx expo install expo-image-picker</Text>
            </View>
            <Text style={S.installStep}>Then restart your Expo dev server and try again.</Text>
            <TouchableOpacity style={S.installBtn} onPress={() => setPickerError(false)} activeOpacity={0.85}>
              <Text style={S.installBtnTxt}>Got it</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ════════ EDIT PROFILE MODAL ════════ */}
      <Modal visible={showEdit} animationType="slide" transparent onRequestClose={() => setShowEdit(false)}>
        <KeyboardAvoidingView style={{ flex: 1, justifyContent: 'flex-end' }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <TouchableOpacity style={S.modalBg} activeOpacity={1} onPress={() => setShowEdit(false)} />
          <View style={[S.modalSheet, { paddingBottom: Platform.OS === 'ios' ? 40 : 28 }]}>
            <View style={S.modalHandle} />
            <View style={S.modalHead}>
              <TouchableOpacity onPress={() => setShowEdit(false)}>
                <Text style={S.modalCancel}>Cancel</Text>
              </TouchableOpacity>
              <Text style={S.modalTitle}>Edit Profile</Text>
              <TouchableOpacity style={S.modalSaveBtn} onPress={handleSave}>
                <Text style={S.modalSaveTxt}>Save</Text>
              </TouchableOpacity>
            </View>
            <View style={S.modalBody}>

              {/* Avatar preview in modal */}
              <TouchableOpacity style={S.modalAvatar} onPress={handleAvatarPress} activeOpacity={0.85}>
                <View style={S.modalAvatarRing}>
                  {profileImage
                    ? <Image source={{ uri: profileImage }} style={{ width: '100%', height: '100%', borderRadius: 36 }} />
                    : <View style={S.modalAvatarFb}><Text style={S.modalAvatarIni}>{initials}</Text></View>
                  }
                </View>
                <View style={S.modalCamBadge}><Ico name="images-outline" size={14} color={C.rose} /></View>
                <Text style={S.modalAvatarHint}>Tap to change from gallery</Text>
              </TouchableOpacity>

              <Text style={S.fieldLbl}>Display Name</Text>
              <View style={[S.inputWrap, !!editErr && S.inputWrapErr]}>
                <Ico name="person-outline" size={16} color={C.sub} />
                <TextInput
                  style={S.input}
                  value={editName}
                  onChangeText={t => { setEditName(t); if (t.trim()) setEditErr(''); }}
                  placeholder="Your name"
                  placeholderTextColor={C.faint}
                  autoCapitalize="words"
                  autoFocus
                />
              </View>
              {!!editErr && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 6 }}>
                  <Ico name="warning" size={13} color={C.error} />
                  <Text style={S.errTxt}>{editErr}</Text>
                </View>
              )}

              <Text style={S.fieldLbl}>Email</Text>
              <View style={[S.inputWrap, { opacity: 0.55 }]}>
                <Ico name="mail-outline" size={16} color={C.sub} />
                <TextInput style={S.input} value={userEmail} editable={false} />
              </View>
              <Text style={S.hintTxt}>Email can be changed via Privacy & Security → Change Account Details.</Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

// ═══════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════
const S = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scrollContent: { paddingBottom: 24 },

  // ── Sub-screen header ──
  subHead:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.roseMist, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 3 },
  subBack:  { width: 38, height: 38, borderRadius: 19, backgroundColor: C.roseMist, alignItems: 'center', justifyContent: 'center' },
  subTitle: { fontSize: 17, fontWeight: '800', color: C.text },

  // ── Hero ──
  hero: {
    backgroundColor: C.roseMist,
    paddingTop: 14,
    paddingBottom: 54,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  heroBlob1: { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: C.roseFog, opacity: 0.7, top: -80, right: -60 },
  heroBlob2: { position: 'absolute', width: 140, height: 140, borderRadius: 70,  backgroundColor: C.roseCircle, opacity: 0.5, bottom: -30, left: -30 },
  heroBlob3: { position: 'absolute', width: 80,  height: 80,  borderRadius: 40,  backgroundColor: C.roseFog, opacity: 0.6, top: 10, left: 30 },
  heroBack:  { position: 'absolute', top: 16, left: 18, width: 38, height: 38, borderRadius: 19, backgroundColor: C.white, alignItems: 'center', justifyContent: 'center', zIndex: 10, ...cardShadow },
  heroTitle: { fontSize: 18, fontWeight: '800', color: C.roseDark, letterSpacing: 0.2, marginBottom: 24 },

  // Avatar
  avatarWrap:    { position: 'relative', marginBottom: 8 },
  avatarRing:    { width: 102, height: 102, borderRadius: 51, borderWidth: 4, borderColor: C.white, overflow: 'hidden', shadowColor: C.rose, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 14, elevation: 10 },
  avatarImg:     { width: '100%', height: '100%', resizeMode: 'cover' },
  avatarFallback:{ width: '100%', height: '100%', backgroundColor: C.rose, alignItems: 'center', justifyContent: 'center' },
  avatarIni:     { color: C.white, fontSize: 34, fontWeight: '800' },
  camBadge:      { position: 'absolute', bottom: 2, right: 2, width: 30, height: 30, borderRadius: 15, backgroundColor: C.rose, alignItems: 'center', justifyContent: 'center', borderWidth: 2.5, borderColor: C.white, shadowColor: C.rose, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.4, shadowRadius: 4, elevation: 5 },
  avatarHint:    { fontSize: 11, color: C.sub, fontWeight: '600' },

  // Info card
  infoCard: {
    backgroundColor: C.white,
    marginHorizontal: 20,
    marginTop: -32,
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    zIndex: 10,
    ...cardShadow,
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 8,
  },
  infoName:  { fontSize: 22, fontWeight: '800', color: C.text, marginBottom: 4 },
  infoEmail: { fontSize: 13, color: C.sub, marginBottom: 16 },
  premBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: C.roseMist, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7, marginBottom: 22 },
  premDot:   { width: 7, height: 7, borderRadius: 3.5, backgroundColor: C.green },
  premTxt:   { fontSize: 12, color: C.rose, fontWeight: '700' },
  actionRow: { flexDirection: 'row', gap: 12, width: '100%' },
  editBtn:   { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: C.rose, borderRadius: 16, paddingVertical: 14, shadowColor: C.rose, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.28, shadowRadius: 8, elevation: 5 },
  editBtnTxt:{ color: C.white, fontSize: 14, fontWeight: '800' },
  logoutBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: C.white, borderRadius: 16, paddingVertical: 14, borderWidth: 1.5, borderColor: C.roseFog },
  logoutBtnTxt:{ color: C.sub, fontSize: 14, fontWeight: '700' },

  // Settings
  settingsWrap: { marginHorizontal: 20, marginTop: 30 },
  secTitle:     { fontSize: 17, fontWeight: '800', color: C.text, marginBottom: 14 },
  settingsCard: { backgroundColor: C.white, borderRadius: 24, overflow: 'hidden', ...cardShadow },
  settRow:      { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 17, gap: 14 },
  settRowBorder:{ borderBottomWidth: 1, borderBottomColor: C.roseMist },
  settIcoBg:    { width: 44, height: 44, borderRadius: 22, backgroundColor: C.roseMist, alignItems: 'center', justifyContent: 'center' },
  settLabel:    { fontSize: 15, fontWeight: '700', color: C.text, marginBottom: 2 },
  settSub:      { fontSize: 11, color: C.sub },

  // Footer
  footer:    { alignItems: 'center', marginTop: 28, gap: 5 },
  footerTxt: { fontSize: 12, color: C.faint, fontWeight: '500' },

  // Install banner
  installOverlay:  { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', padding: 28 },
  installCard:     { backgroundColor: C.white, borderRadius: 28, padding: 28, width: '100%', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.18, shadowRadius: 24, elevation: 16 },
  installIconWrap: { width: 68, height: 68, borderRadius: 34, backgroundColor: C.roseMist, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  installTitle:    { fontSize: 18, fontWeight: '800', color: C.text, marginBottom: 10, textAlign: 'center' },
  installDesc:     { fontSize: 13, color: C.sub, textAlign: 'center', lineHeight: 20, marginBottom: 16 },
  installCmd:      { backgroundColor: '#1E1E2E', borderRadius: 14, paddingHorizontal: 18, paddingVertical: 14, width: '100%', marginBottom: 12 },
  installCmdTxt:   { fontSize: 13, color: '#F5A8B8', fontWeight: '700', fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace', textAlign: 'center' },
  installStep:     { fontSize: 12, color: C.sub, textAlign: 'center', marginBottom: 22, lineHeight: 18 },
  installBtn:      { backgroundColor: C.rose, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 40, shadowColor: C.rose, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.28, shadowRadius: 8, elevation: 5 },
  installBtnTxt:   { color: C.white, fontSize: 15, fontWeight: '800' },

  // Edit modal     { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)' },
  modalSheet:  { backgroundColor: C.white, borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingHorizontal: 22 },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: C.roseFog, alignSelf: 'center', marginTop: 14, marginBottom: 6 },
  modalHead:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.roseMist, marginBottom: 8 },
  modalCancel: { fontSize: 15, color: C.sub, fontWeight: '600' },
  modalTitle:  { fontSize: 17, fontWeight: '800', color: C.text },
  modalSaveBtn:{ backgroundColor: C.rose, borderRadius: 18, paddingHorizontal: 20, paddingVertical: 8 },
  modalSaveTxt:{ color: C.white, fontWeight: '800', fontSize: 14 },
  modalBody:   { paddingTop: 10 },

  // Modal avatar picker
  modalAvatar:    { alignItems: 'center', marginBottom: 22, paddingTop: 8 },
  modalAvatarRing:{ width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: C.roseFog, overflow: 'hidden', marginBottom: 8 },
  modalAvatarFb:  { width: '100%', height: '100%', backgroundColor: C.rose, alignItems: 'center', justifyContent: 'center' },
  modalAvatarIni: { color: C.white, fontSize: 26, fontWeight: '800' },
  modalCamBadge:  { position: 'absolute', bottom: 28, right: (width / 2) - 58, width: 26, height: 26, borderRadius: 13, backgroundColor: C.roseMist, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: C.white },
  modalAvatarHint:{ fontSize: 12, color: C.rose, fontWeight: '700' },

  // Fields
  fieldLbl:   { fontSize: 13, fontWeight: '700', color: C.text, marginBottom: 8, marginTop: 16 },
  inputWrap:  { flexDirection: 'row', alignItems: 'center', backgroundColor: C.roseMist, borderRadius: 14, borderWidth: 1.5, borderColor: C.roseFog, paddingHorizontal: 14, gap: 10 },
  inputWrapErr:{ borderColor: C.error },
  input:      { flex: 1, fontSize: 15, color: C.text, paddingVertical: 13 },
  errTxt:     { fontSize: 12, color: C.error, fontWeight: '500' },
  hintTxt:    { fontSize: 11, color: C.sub, marginTop: 7, lineHeight: 16 },
});