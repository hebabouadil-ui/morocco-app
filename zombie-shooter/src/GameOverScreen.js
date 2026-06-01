import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  StatusBar,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: W } = Dimensions.get('window');

function StatRow({ icon, label, value, highlight }) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, highlight && styles.statHighlight]}>
        {value}
      </Text>
    </View>
  );
}

export default function GameOverScreen({ navigate, result }) {
  const { score = 0, kills = 0, wave = 1 } = result || {};

  const fade    = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(60)).current;
  const skullSpin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fade, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.parallel([
        Animated.spring(slideUp, { toValue: 0, tension: 45, friction: 8, useNativeDriver: true }),
        Animated.spring(skullSpin, { toValue: 1, tension: 30, friction: 6, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const skullScale = skullSpin.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] });
  const skullRotate = skullSpin.interpolate({ inputRange: [0, 1], outputRange: ['-20deg', '0deg'] });

  const rankLabel = () => {
    if (wave >= 10) return { emoji: '🏆', text: 'LEGENDARY SURVIVOR' };
    if (wave >= 7)  return { emoji: '🥇', text: 'ELITE SOLDIER' };
    if (wave >= 4)  return { emoji: '🥈', text: 'VETERAN FIGHTER' };
    return { emoji: '🥉', text: 'ROOKIE SURVIVOR' };
  };
  const rank = rankLabel();

  return (
    <View style={styles.root}>
      <StatusBar hidden />
      <LinearGradient
        colors={['#050510', '#120508', '#200505']}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Blood drip top border */}
      <View style={styles.bloodBar} />

      <Animated.View style={[styles.content, { opacity: fade }]}>
        {/* Skull */}
        <Animated.Text
          style={[
            styles.skull,
            { transform: [{ scale: skullScale }, { rotate: skullRotate }] },
          ]}
        >
          💀
        </Animated.Text>

        <Animated.View style={{ transform: [{ translateY: slideUp }] }}>
          <Text style={styles.title}>GAME OVER</Text>
          <Text style={styles.subtitle}>You have been overrun</Text>

          {/* Rank */}
          <View style={styles.rankBadge}>
            <Text style={styles.rankEmoji}>{rank.emoji}</Text>
            <Text style={styles.rankText}>{rank.text}</Text>
          </View>

          {/* Stats */}
          <View style={styles.statsCard}>
            <StatRow icon="🏆" label="FINAL SCORE" value={score.toLocaleString()} highlight />
            <View style={styles.divider} />
            <StatRow icon="💀" label="TOTAL KILLS" value={kills.toLocaleString()} />
            <StatRow icon="🌊" label="WAVES SURVIVED" value={(wave - 1).toString()} />
            <StatRow icon="⭐" label="SCORE/KILL" value={kills > 0 ? Math.floor(score / kills).toLocaleString() : '0'} />
          </View>

          {/* Buttons */}
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => navigate('game')}
            activeOpacity={0.75}
          >
            <LinearGradient colors={['#cc2200', '#880000']} style={styles.btnGrad}>
              <Text style={styles.retryText}>🔄  PLAY AGAIN</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.homeBtn}
            onPress={() => navigate('home')}
            activeOpacity={0.75}
          >
            <Text style={styles.homeText}>🏠  MAIN MENU</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#050510', justifyContent: 'center', alignItems: 'center' },
  bloodBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#880000',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 28,
    width: '100%',
  },
  skull: {
    fontSize: 86,
    marginBottom: 4,
  },
  title: {
    fontSize: 50,
    fontWeight: '900',
    color: '#ff2222',
    letterSpacing: 4,
    textAlign: 'center',
    textShadowColor: '#ff0000',
    textShadowRadius: 22,
    textShadowOffset: { width: 0, height: 0 },
  },
  subtitle: {
    fontSize: 15,
    color: '#663333',
    letterSpacing: 3,
    textAlign: 'center',
    marginBottom: 18,
    fontStyle: 'italic',
  },
  rankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,200,50,0.1)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,200,50,0.3)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 10,
    alignSelf: 'center',
    marginBottom: 22,
  },
  rankEmoji: { fontSize: 24 },
  rankText: {
    color: '#ffcc44',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 2,
  },
  statsCard: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,80,80,0.18)',
    marginBottom: 24,
    gap: 10,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: { fontSize: 20, width: 34 },
  statLabel: {
    flex: 1,
    color: '#556677',
    fontSize: 12,
    letterSpacing: 3,
    fontWeight: '700',
  },
  statValue: {
    color: '#aabbcc',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 1,
  },
  statHighlight: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '900',
    textShadowColor: '#ff4400',
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,80,80,0.15)',
    marginVertical: 4,
  },
  retryBtn: {
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 12,
    elevation: 8,
    shadowColor: '#ff0000',
    shadowRadius: 14,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 4 },
  },
  btnGrad: { paddingVertical: 18, alignItems: 'center' },
  retryText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 3,
  },
  homeBtn: { paddingVertical: 14, paddingHorizontal: 40 },
  homeText: {
    color: '#445566',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 2,
  },
});
