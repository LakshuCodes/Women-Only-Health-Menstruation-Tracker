import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Image,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

// 🎨 Pink Color Palette
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

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;
  const textFade = useRef(new Animated.Value(0)).current;
  const taglineFade = useRef(new Animated.Value(0)).current;
  const blob1Anim = useRef(new Animated.Value(0)).current;
  const blob2Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Blobs fade in
    Animated.timing(blob1Anim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    Animated.timing(blob2Anim, {
      toValue: 1,
      duration: 800,
      delay: 200,
      useNativeDriver: true,
    }).start();

    // Logo pops in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 70,
        useNativeDriver: true,
      }),
    ]).start();

    // App name fades in
    setTimeout(() => {
      Animated.timing(textFade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 500);

    // Tagline fades in
    setTimeout(() => {
      Animated.timing(taglineFade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 800);

    // Spinner loop
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1400,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Navigate after 3 seconds
    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>

      {/* Decorative blobs */}
      <Animated.View style={[styles.blobTopRight, { opacity: blob1Anim }]} />
      <Animated.View style={[styles.blobBottomLeft, { opacity: blob2Anim }]} />
      <Animated.View style={[styles.blobTopLeft, { opacity: blob1Anim }]} />
      <Animated.View style={[styles.blobBottomRight, { opacity: blob2Anim }]} />

      {/* Logo container with pink layered glow rings */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Glow ring 3 - outermost */}
        <View style={styles.glowRing3} />
        {/* Glow ring 2 */}
        <View style={styles.glowRing2} />
        {/* Glow ring 1 - innermost */}
        <View style={styles.glowRing1} />

        {/* Logo image - tinted to watermelon pink */}
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      {/* App name - hidden since logo already has "ovia" text */}
      <Animated.Text style={[styles.tagline, { opacity: taglineFade }]}>
        Your private space, secured 🌸
      </Animated.Text>

      {/* Spinner */}
      <View style={styles.spinnerWrapper}>
        <Animated.View
          style={[styles.spinnerRingOuter, { transform: [{ rotate: spin }] }]}
        />
        <View style={styles.spinnerDot} />
      </View>

      <Text style={styles.preparingText}>PREPARING YOUR SPACE</Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF0F3',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Blobs
  blobTopRight: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: COLORS.pinkChampagne,
    opacity: 0.5,
    top: -80,
    right: -80,
  },
  blobBottomLeft: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.pastelPink,
    opacity: 0.35,
    bottom: 60,
    left: -60,
  },
  blobTopLeft: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.lightPink,
    opacity: 0.15,
    top: 80,
    left: -30,
  },
  blobBottomRight: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#E8748A',
    opacity: 0.1,
    bottom: 120,
    right: -40,
  },

  // Logo with glow rings
  logoContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  glowRing3: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.pinkChampagne,
    opacity: 0.25,
  },
  glowRing2: {
    position: 'absolute',
    width: 168,
    height: 168,
    borderRadius: 84,
    backgroundColor: COLORS.pastelPink,
    opacity: 0.3,
  },
  glowRing1: {
    position: 'absolute',
    width: 138,
    height: 138,
    borderRadius: 69,
    backgroundColor: '#FDF0F3',
    opacity: 0.9,
  },
  logo: {
    width: 160,
    height: 100,
    // tintColor: COLORS.watermelon, // Uncomment this to force single-color tint
  },

  // Text
  tagline: {
    fontSize: 15,
    color: '#8F6470',
    fontWeight: '400',
    letterSpacing: 0.3,
    marginBottom: 70,
    marginTop: 8,
  },

  // Spinner
  spinnerWrapper: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  spinnerRingOuter: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2.5,
    borderColor: COLORS.lightPink,
    borderTopColor: COLORS.watermelon,
    borderRightColor: COLORS.pastelPink,
  },
  spinnerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E8748A',
  },

  preparingText: {
    fontSize: 9,
    color: COLORS.lightPink,
    letterSpacing: 3,
    fontWeight: '600',
  },
});