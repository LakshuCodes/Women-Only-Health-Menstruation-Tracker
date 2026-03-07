import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getUserName, setUserName } from './HomeScreen';

const { width } = Dimensions.get('window');

const COLORS = {
  lavenderBlush: '#FFE5EC',
  pastelPink: '#FFB3C6',
  lightPink: '#FF8FAB',
  pinkChampagne: '#FFC2D1',
  watermelon: '#FB6F92',
  deepPink: '#E8487A',
  white: '#FFFFFF',
  darkText: '#2D1B1E',
  mutedText: '#9B6B78',
  error: '#E53935',
};

const SETTINGS_ITEMS = [
  { key: 'notifications', icon: '🔔', label: 'Notifications' },
  { key: 'security',      icon: '🔒', label: 'Security' },
  { key: 'privacy',       icon: '🛡️', label: 'Privacy' },
  { key: 'subscription',  icon: '💳', label: 'My Subscription' },
];

let _userEmail = 'maya@example.com';
export const getUserEmail = () => _userEmail;
export const setUserEmail = (e) => { _userEmail = e; };

export default function ProfileScreen({ navigation }) {
  const [userName, setLocalName] = useState(getUserName());
  const [userEmail] = useState(getUserEmail());
  const [profileImage, setProfileImage] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(getUserName());
  const [editNameError, setEditNameError] = useState('');

  const initials = userName
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // ── Image picker using React Native's built-in approach ──
  const handleAvatarPress = () => {
    // expo-image-picker requires installation; show instructions
    Alert.alert(
      'Profile Photo',
      'Choose how to update your photo',
      [
        {
          text: 'Choose from Library',
          onPress: () => pickImageFromLibrary(),
        },
        {
          text: 'Take Photo',
          onPress: () => takePhoto(),
        },
        profileImage
          ? { text: 'Remove Photo', style: 'destructive', onPress: () => setProfileImage(null) }
          : null,
        { text: 'Cancel', style: 'cancel' },
      ].filter(Boolean)
    );
  };

  const pickImageFromLibrary = async () => {
    try {
      // Try expo-image-picker if available, otherwise show install tip
      const ImagePicker = require('expo-image-picker');
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please allow access to your photo library.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });
      if (!result.canceled && result.assets?.[0]?.uri) {
        setProfileImage(result.assets[0].uri);
      }
    } catch {
      Alert.alert(
        'Install required',
        'Run this command in your project:\n\nnpx expo install expo-image-picker\n\nThen reload the app.',
        [{ text: 'OK' }]
      );
    }
  };

  const takePhoto = async () => {
    try {
      const ImagePicker = require('expo-image-picker');
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please allow camera access.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });
      if (!result.canceled && result.assets?.[0]?.uri) {
        setProfileImage(result.assets[0].uri);
      }
    } catch {
      Alert.alert(
        'Install required',
        'Run this command in your project:\n\nnpx expo install expo-image-picker\n\nThen reload the app.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleSaveProfile = () => {
    if (!editName.trim()) { setEditNameError('Name cannot be empty'); return; }
    setEditNameError('');
    const newName = editName.trim();
    setLocalName(newName);
    setUserName(newName);
    setShowEditModal(false);
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Login' }] }),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.watermelon} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* ── HERO HEADER ── */}
        <View style={styles.heroSection}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.heroTitle}>My Profile</Text>
          <View style={styles.heroBlob1} />
          <View style={styles.heroBlob2} />

          {/* Avatar */}
          <TouchableOpacity style={styles.avatarWrapper} onPress={handleAvatarPress} activeOpacity={0.85}>
            <View style={styles.avatarOuter}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatarFallback}>
                  <Text style={styles.avatarInitials}>{initials}</Text>
                </View>
              )}
            </View>
            <View style={styles.cameraBadge}>
              <Text style={styles.cameraBadgeIcon}>📷</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ── INFO CARD ── */}
        <View style={styles.infoCard}>
          <Text style={styles.infoName}>{userName}</Text>
          <Text style={styles.infoEmail}>{userEmail}</Text>

          <View style={styles.premiumBadge}>
            <Text style={styles.premiumDot}>●</Text>
            <Text style={styles.premiumText}>Premium Status: Active</Text>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.editProfileBtn}
              onPress={() => { setEditName(userName); setShowEditModal(true); }}
              activeOpacity={0.85}
            >
              <Text style={styles.editProfileBtnText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
              <Text style={styles.logoutBtnText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── SETTINGS ── */}
        <View style={styles.settingsSection}>
          <Text style={styles.settingsTitle}>Settings</Text>
          <View style={styles.settingsCard}>
            {SETTINGS_ITEMS.map((item, idx) => (
              <TouchableOpacity
                key={item.key}
                style={[styles.settingsRow, idx < SETTINGS_ITEMS.length - 1 && styles.settingsRowBorder]}
                activeOpacity={0.7}
                onPress={() => Alert.alert(item.label, `${item.label} settings coming soon!`)}
              >
                <View style={styles.settingsLeft}>
                  <View style={styles.settingsIconBadge}>
                    <Text style={styles.settingsIcon}>{item.icon}</Text>
                  </View>
                  <Text style={styles.settingsLabel}>{item.label}</Text>
                </View>
                <Text style={styles.settingsChevron}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── APP INFO ── */}
        <View style={styles.appInfoRow}>
          <Text style={styles.appInfoText}>Ovia Health · Version 1.0.0</Text>
          <Text style={styles.appInfoText}>🌸 Made with love</Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ── EDIT PROFILE MODAL ── */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowEditModal(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setShowEditModal(false)}
          />
          <View style={styles.modalSheet}>
            <View style={styles.sheetHandle} />
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity style={styles.modalSaveBtn} onPress={handleSaveProfile}>
                <Text style={styles.modalSaveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.fieldLabel}>Display Name</Text>
              <View style={[styles.inputWrapper, !!editNameError && styles.inputWrapperError]}>
                <TextInput
                  style={styles.input}
                  value={editName}
                  onChangeText={(t) => { setEditName(t); if (t.trim()) setEditNameError(''); }}
                  placeholder="Your name"
                  placeholderTextColor={COLORS.pastelPink}
                  autoCapitalize="words"
                  autoFocus
                />
              </View>
              {!!editNameError && <Text style={styles.errorText}>⚠ {editNameError}</Text>}

              <Text style={styles.fieldLabel}>Email</Text>
              <View style={[styles.inputWrapper, { opacity: 0.6 }]}>
                <TextInput
                  style={styles.input}
                  value={userEmail}
                  editable={false}
                  placeholderTextColor={COLORS.pastelPink}
                />
              </View>
              <Text style={styles.fieldHint}>Email cannot be changed here. Contact support for email updates.</Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.lavenderBlush },
  scrollContent: { paddingBottom: 20 },

  heroSection: {
    backgroundColor: COLORS.watermelon,
    paddingTop: 10,
    paddingBottom: 60,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  backBtn: {
    position: 'absolute', top: 10, left: 18,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center', justifyContent: 'center', zIndex: 10,
  },
  backArrow: { color: COLORS.white, fontSize: 26, fontWeight: '300', lineHeight: 30 },
  heroTitle: { fontSize: 18, fontWeight: '800', color: COLORS.white, letterSpacing: 0.3, marginBottom: 20 },
  heroBlob1: { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.1)', top: -80, right: -60 },
  heroBlob2: { position: 'absolute', width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.08)', bottom: -30, left: -20 },

  avatarWrapper: { position: 'relative', marginBottom: 4 },
  avatarOuter: {
    width: 100, height: 100, borderRadius: 50,
    borderWidth: 4, borderColor: COLORS.white,
    overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 12, elevation: 10,
  },
  avatarImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  avatarFallback: { width: '100%', height: '100%', backgroundColor: COLORS.deepPink, alignItems: 'center', justifyContent: 'center' },
  avatarInitials: { color: COLORS.white, fontSize: 34, fontWeight: '800' },
  cameraBadge: {
    position: 'absolute', bottom: 2, right: 2,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: COLORS.watermelon,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 5,
  },
  cameraBadgeIcon: { fontSize: 13 },

  infoCard: {
    backgroundColor: COLORS.white, marginHorizontal: 20, marginTop: -36,
    borderRadius: 24, padding: 22, alignItems: 'center',
    shadowColor: COLORS.watermelon, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.12, shadowRadius: 16, elevation: 8,
    borderWidth: 1.5, borderColor: COLORS.pinkChampagne, zIndex: 10,
  },
  infoName: { fontSize: 22, fontWeight: '800', color: COLORS.darkText, marginBottom: 4 },
  infoEmail: { fontSize: 13, color: COLORS.mutedText, marginBottom: 14 },
  premiumBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: COLORS.lavenderBlush, borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 6, marginBottom: 20,
    borderWidth: 1, borderColor: COLORS.pastelPink,
  },
  premiumDot: { fontSize: 10, color: COLORS.watermelon },
  premiumText: { fontSize: 12, color: COLORS.watermelon, fontWeight: '700' },
  actionRow: { flexDirection: 'row', gap: 12, width: '100%' },
  editProfileBtn: {
    flex: 1, backgroundColor: COLORS.watermelon, borderRadius: 14,
    paddingVertical: 13, alignItems: 'center',
    shadowColor: COLORS.watermelon, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
  },
  editProfileBtnText: { color: COLORS.white, fontSize: 14, fontWeight: '800' },
  logoutBtn: {
    flex: 1, backgroundColor: COLORS.white, borderRadius: 14,
    paddingVertical: 13, alignItems: 'center',
    borderWidth: 2, borderColor: COLORS.pastelPink,
  },
  logoutBtnText: { color: COLORS.darkText, fontSize: 14, fontWeight: '700' },

  settingsSection: { marginHorizontal: 20, marginTop: 28 },
  settingsTitle: { fontSize: 17, fontWeight: '800', color: COLORS.watermelon, marginBottom: 14 },
  settingsCard: {
    backgroundColor: COLORS.white, borderRadius: 20,
    borderWidth: 1.5, borderColor: COLORS.pinkChampagne, overflow: 'hidden',
    shadowColor: COLORS.lightPink, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 3,
  },
  settingsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingVertical: 16 },
  settingsRowBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.lavenderBlush },
  settingsLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  settingsIconBadge: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.lavenderBlush, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.pinkChampagne,
  },
  settingsIcon: { fontSize: 18 },
  settingsLabel: { fontSize: 15, fontWeight: '600', color: COLORS.darkText },
  settingsChevron: { fontSize: 20, color: COLORS.pastelPink },

  appInfoRow: { alignItems: 'center', marginTop: 24, gap: 4 },
  appInfoText: { fontSize: 12, color: COLORS.mutedText },

  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalBackdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.45)' },
  modalSheet: {
    backgroundColor: COLORS.white, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: -6 }, shadowOpacity: 0.12, shadowRadius: 20, elevation: 20,
  },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: COLORS.pinkChampagne, alignSelf: 'center', marginTop: 12, marginBottom: 4 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.lavenderBlush },
  modalCancelText: { fontSize: 15, color: COLORS.mutedText, fontWeight: '600' },
  modalTitle: { fontSize: 17, fontWeight: '800', color: COLORS.darkText },
  modalSaveBtn: { backgroundColor: COLORS.watermelon, borderRadius: 20, paddingHorizontal: 20, paddingVertical: 8 },
  modalSaveBtnText: { color: COLORS.white, fontWeight: '800', fontSize: 14 },
  modalBody: { paddingHorizontal: 20, paddingTop: 16 },
  fieldLabel: { fontSize: 13, fontWeight: '700', color: COLORS.darkText, marginBottom: 8, marginTop: 14 },
  inputWrapper: { backgroundColor: COLORS.lavenderBlush, borderRadius: 14, borderWidth: 1.5, borderColor: COLORS.pastelPink, paddingHorizontal: 14 },
  inputWrapperError: { borderColor: COLORS.error },
  input: { fontSize: 15, color: COLORS.darkText, paddingVertical: 12 },
  errorText: { fontSize: 12, color: COLORS.error, marginTop: 4, fontWeight: '500' },
  fieldHint: { fontSize: 11, color: COLORS.mutedText, marginTop: 6, lineHeight: 16 },
});