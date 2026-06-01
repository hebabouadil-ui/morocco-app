import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  StatusBar,
  Dimensions,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: W, height: H } = Dimensions.get('window');

function FloatingParticle({ size = 3, color = '#ff4444' }) {
  const anim = useRef(new Animated.Value(0)).current;
  const x = useRef(Math.random() * W).current;
  const duration = useRef(4000 + Math.random() * 5000).current;
  const delay = useRef(Math.random() * 4000).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(anim, { toValue: 1, duration, delay, useNativeDriver: true })
    ).start();
  }, []);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [H + 10, -20] });
  const opacity = anim.interpolate({ inputRange: [0, 0.05, 0.9, 1], outputRange: [0, 0.7, 0.7, 0] });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: x,
        width: size,
        height: size * 4,
        borderRadius: size,
        backgroundColor: color,
        opacity,
        transform: [{ translateY }],
      }}
    />
  );
}

function BloodDrop({ index }) {
  const anim = useRef(new Animated.Value(0)).current;
  const x = useRef(20 + Math.random() * (W - 40)).current;
  const delay = useRef(index * 300 + Math.random() * 2000).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, { toValue: 1, duration: 2000 + Math.random() * 1000, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, H * 0.4] });
  const opacity = anim.interpolate({ inputRange: [0, 0.1, 0.8, 1], outputRange: [0, 1, 1, 0] });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: x,
        top: 0,
        width: 4,
        height: 12,
        borderRadius: 2,
        backgroundColor: '#880000',
        opacity,
        transform: [{ translateY }],
      }}
    />
  );
}

export default function HomeScreen({ navigate }) {
  const pulse = useRef(new Animated.Value(1)).current;
  const titleFade = useRef(new Animated.Value(0)).current;
  const titleScale = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(titleFade, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(titleScale, { toValue: 1, tension: 40, friction: 7, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.06, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar hidden />
      <LinearGradient
        colors={['#050510', '#0a0a1a', '#120510', '#0a0510']}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Particles */}
      {Array.from({ length: 18 }).map((_, i) => (
        <FloatingParticle key={`p${i}`} size={i % 3 === 0 ? 4 : 2} color={i % 4 === 0 ? '#ff6600' : '#ff2222'} />
      ))}
      {Array.from({ length: 8 }).map((_, i) => (
        <BloodDrop key={`b${i}`} index={i} />
      ))}

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header glitch lines */}
        <View style={styles.glitchLine} />
        <View style={[styles.glitchLine, { top: 44, opacity: 0.4, width: '60%' }]} />

        <Animated.View
          style={[
            styles.titleBlock,
            { opacity: titleFade, transform: [{ scale: titleScale }] },
          ]}
        >
          <Text style={styles.labelTop}>▓▓ 3DS SURVIVAL ▓▓</Text>

          <View style={styles.titleRow}>
            <Text style={styles.titleRed}>DEAD </Text>
            <Text style={styles.titleWhite}>ZONE</Text>
          </View>

          <Text style={styles.titleSub}>S H O O T E R</Text>

          <Text style={styles.tagline}>Kill or be devoured</Text>
        </Animated.View>

        {/* Zombie preview */}
        <View style={styles.previewRow}>
          <View style={styles.previewCard}>
            <Text style={styles.previewEmoji}>🧟‍♂️</Text>
            <Text style={styles.previewLabel}>ZOMBIE</Text>
          </View>
          <View style={[styles.previewCard, styles.previewCardCenter]}>
            <Text style={[styles.previewEmoji, { fontSize: 54 }]}>💀</Text>
            <Text style={[styles.previewLabel, { color: '#ff4444' }]}>VS</Text>
          </View>
          <View style={styles.previewCard}>
            <Text style={styles.previewEmoji}>🪖</Text>
            <Text style={styles.previewLabel}>SQUAD</Text>
          </View>
        </View>

        {/* Play button */}
        <Animated.View style={{ transform: [{ scale: pulse }] }}>
          <TouchableOpacity
            style={styles.playBtn}
            onPress={() => navigate('game')}
            activeOpacity={0.75}
          >
            <LinearGradient colors={['#ff3300', '#aa0000', '#880000']} style={styles.playGradient}>
              <Text style={styles.playText}>▶  START GAME</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Stats preview */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>∞</Text>
            <Text style={styles.statLabel}>WAVES</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>3x</Text>
            <Text style={styles.statLabel}>GUNNERS</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>10+</Text>
            <Text style={styles.statLabel}>ENEMY TYPES</Text>
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.instructions}>
          <Text style={styles.instrTitle}>— HOW TO PLAY —</Text>
          <InstrRow icon="👆" text="Drag left/right to move your squad" />
          <InstrRow icon="🔫" text="Auto-aim fires at nearest zombie" />
          <InstrRow icon="🌊" text="Survive waves — they get harder!" />
          <InstrRow icon="💀" text="Don't let zombies reach your squad" />
          <InstrRow icon="👹" text="BOSS zombies have extra HP!" />
        </View>

        <Text style={styles.footer}>Swipe to play  •  No ads  •  Free forever</Text>
      </ScrollView>
    </View>
  );
}

function InstrRow({ icon, text }) {
  return (
    <View style={styles.instrRow}>
      <Text style={styles.instrIcon}>{icon}</Text>
      <Text style={styles.instrText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#050510' },
  scrollContent: { alignItems: 'center', paddingBottom: 40, paddingTop: 20 },
  glitchLine: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,50,50,0.3)',
  },
  titleBlock: { alignItems: 'center', marginTop: 40, marginBottom: 24 },
  labelTop: {
    fontSize: 11,
    color: '#ff4444',
    letterSpacing: 4,
    fontWeight: '700',
    marginBottom: 8,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  titleRed: {
    fontSize: 58,
    fontWeight: '900',
    color: '#ff2222',
    letterSpacing: 2,
    textShadowColor: '#ff0000',
    textShadowRadius: 24,
    textShadowOffset: { width: 0, height: 0 },
  },
  titleWhite: {
    fontSize: 58,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 2,
    textShadowColor: '#ff0000',
    textShadowRadius: 12,
    textShadowOffset: { width: 0, height: 0 },
  },
  titleSub: {
    fontSize: 22,
    color: '#cc4444',
    letterSpacing: 10,
    fontWeight: '700',
    marginTop: 4,
  },
  tagline: {
    fontSize: 13,
    color: '#664444',
    letterSpacing: 3,
    marginTop: 10,
    fontStyle: 'italic',
  },
  previewRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
    paddingHorizontal: 20,
  },
  previewCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255,50,50,0.07)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,50,50,0.2)',
    paddingVertical: 14,
  },
  previewCardCenter: {
    backgroundColor: 'rgba(255,50,50,0.15)',
    borderColor: 'rgba(255,80,80,0.4)',
  },
  previewEmoji: { fontSize: 40 },
  previewLabel: {
    fontSize: 10,
    color: '#888899',
    letterSpacing: 3,
    fontWeight: '700',
    marginTop: 6,
  },
  playBtn: {
    borderRadius: 16,
    overflow: 'hidden',
    width: W * 0.78,
    elevation: 10,
    shadowColor: '#ff0000',
    shadowRadius: 18,
    shadowOpacity: 0.7,
    shadowOffset: { width: 0, height: 4 },
    marginBottom: 24,
  },
  playGradient: { paddingVertical: 20, alignItems: 'center' },
  playText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 12,
  },
  statNum: {
    fontSize: 22,
    fontWeight: '900',
    color: '#ff4444',
  },
  statLabel: {
    fontSize: 9,
    color: '#556',
    letterSpacing: 2,
    fontWeight: '700',
    marginTop: 2,
  },
  instructions: {
    width: W * 0.9,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,80,80,0.15)',
    marginBottom: 20,
    gap: 10,
  },
  instrTitle: {
    color: '#ff5555',
    fontSize: 11,
    letterSpacing: 4,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
  },
  instrRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  instrIcon: { fontSize: 20, width: 28 },
  instrText: { color: '#99aacc', fontSize: 13, flex: 1, lineHeight: 18 },
  footer: {
    color: '#334',
    fontSize: 11,
    letterSpacing: 2,
    marginTop: 8,
  },
});
