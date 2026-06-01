import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  StatusBar,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const { width: W, height: H } = Dimensions.get('window');

// ─── Road geometry ───────────────────────────────────────────────
const ROAD_TOP_Y    = H * 0.07;
const ROAD_BOT_Y    = H * 0.88;
const ROAD_CX       = W / 2;
const ROAD_TOP_HW   = W * 0.045;   // half-width at horizon
const ROAD_BOT_HW   = W * 0.44;    // half-width at player level
const ROAD_H        = ROAD_BOT_Y - ROAD_TOP_Y;
const ROAD_STRIPS   = 36;

// ─── Player ──────────────────────────────────────────────────────
const PLAYER_Y      = H * 0.79;
const PLAYER_RANGE  = W * 0.33;   // max offset from centre

// ─── Enemy ───────────────────────────────────────────────────────
const Z_BASE_SPD    = 1.3;
const Z_BASE_HP     = 3;
const SPAWN_MS      = 1700;
const KILLS_PER_WAVE = 10;

// ─── Bullets ─────────────────────────────────────────────────────
const B_SPEED       = 15;
const FIRE_MS       = 260;

let _zid = 0;
let _bid = 0;

// ─── Perspective helpers ─────────────────────────────────────────
function roadHW(y) {
  const t = Math.max(0, Math.min(1, (y - ROAD_TOP_Y) / ROAD_H));
  return ROAD_TOP_HW + (ROAD_BOT_HW - ROAD_TOP_HW) * t;
}

function scaleAt(y) {
  const t = Math.max(0, Math.min(1, (y - ROAD_TOP_Y) / ROAD_H));
  return 0.18 + 0.82 * t;
}

// ─── Road ────────────────────────────────────────────────────────
function RoadView() {
  const stripH = ROAD_H / ROAD_STRIPS + 1;
  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {/* Road surface strips */}
      {Array.from({ length: ROAD_STRIPS }).map((_, i) => {
        const t   = i / ROAD_STRIPS;
        const y   = ROAD_TOP_Y + t * ROAD_H;
        const hw  = roadHW(y);
        const brt = Math.floor(18 + t * 22);
        return (
          <View
            key={i}
            style={{
              position: 'absolute',
              top:  y,
              left: ROAD_CX - hw,
              width: hw * 2,
              height: stripH,
              backgroundColor: `rgb(${brt},${brt},${brt + 6})`,
            }}
          />
        );
      })}

      {/* Road edge lines */}
      {Array.from({ length: ROAD_STRIPS }).map((_, i) => {
        const t  = i / ROAD_STRIPS;
        const y  = ROAD_TOP_Y + t * ROAD_H;
        const hw = roadHW(y);
        const lw = Math.max(1, 3 * t);
        return (
          <React.Fragment key={i}>
            <View style={{ position: 'absolute', top: y, left: ROAD_CX - hw - lw, width: lw, height: stripH, backgroundColor: '#ffffff22' }} />
            <View style={{ position: 'absolute', top: y, left: ROAD_CX + hw,       width: lw, height: stripH, backgroundColor: '#ffffff22' }} />
          </React.Fragment>
        );
      })}

      {/* Centre dashes */}
      {Array.from({ length: 10 }).map((_, i) => {
        const t   = (i + 0.5) / 10;
        const y   = ROAD_TOP_Y + t * ROAD_H;
        const dh  = ROAD_H / 10 * 0.38;
        const dw  = Math.max(1, 5 * t);
        return (
          <View
            key={i}
            style={{
              position: 'absolute',
              top:  y,
              left: ROAD_CX - dw / 2,
              width: dw,
              height: dh,
              backgroundColor: `rgba(255,230,100,${0.15 + t * 0.25})`,
            }}
          />
        );
      })}

      {/* Horizon glow */}
      <View
        style={{
          position: 'absolute',
          top:   ROAD_TOP_Y - 30,
          left:  ROAD_CX - 80,
          width: 160,
          height: 60,
          backgroundColor: 'rgba(255,80,80,0.12)',
          borderRadius: 80,
        }}
      />
    </View>
  );
}

// ─── Zombie ───────────────────────────────────────────────────────
function ZombieView({ zombie }) {
  const sc   = scaleAt(zombie.y);
  const sz   = 44 * sc;
  const hpPct = zombie.hp / zombie.maxHp;
  const emoji = zombie.isBoss
    ? '👹'
    : hpPct <= 0.33
    ? '🤕'
    : '🧟';

  return (
    <View
      style={{
        position: 'absolute',
        left: zombie.x - sz / 2,
        top:  zombie.y - sz - 6,
        alignItems: 'center',
        opacity: zombie.hitFlash > 0 ? 0.35 : 1,
      }}
    >
      {/* HP bar */}
      <View style={{ width: sz, height: 3, backgroundColor: '#333', borderRadius: 2, marginBottom: 2 }}>
        <View
          style={{
            width: `${hpPct * 100}%`,
            height: 3,
            borderRadius: 2,
            backgroundColor:
              hpPct > 0.6 ? '#22ee44' : hpPct > 0.3 ? '#ffaa00' : '#ff2200',
          }}
        />
      </View>
      <Text style={{ fontSize: sz * 0.92, lineHeight: sz + 2 }}>{emoji}</Text>
      {zombie.isBoss && (
        <Text style={{ fontSize: 8, color: '#ff4444', fontWeight: '700', letterSpacing: 1 }}>BOSS</Text>
      )}
    </View>
  );
}

// ─── Player ───────────────────────────────────────────────────────
function PlayerView({ x }) {
  return (
    <View
      style={{
        position: 'absolute',
        top:  PLAYER_Y - 62,
        left: x - 72,
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 2,
      }}
    >
      <Text style={{ fontSize: 36 }}>🪖</Text>
      <Text style={{ fontSize: 46, marginBottom: 0 }}>🔫</Text>
      <Text style={{ fontSize: 36 }}>🪖</Text>
    </View>
  );
}

// ─── Bullet ───────────────────────────────────────────────────────
function BulletView({ x, y, vx, vy }) {
  const angle = Math.atan2(vy, vx) * (180 / Math.PI) + 90;
  return (
    <View
      style={{
        position: 'absolute',
        left:  x - 3,
        top:   y - 14,
        width: 6,
        height: 28,
        borderRadius: 3,
        backgroundColor: '#ff5500',
        shadowColor: '#ffaa00',
        shadowRadius: 8,
        shadowOpacity: 1,
        shadowOffset: { width: 0, height: 0 },
        elevation: 6,
        transform: [{ rotate: `${angle}deg` }],
      }}
    />
  );
}

// ─── HUD ──────────────────────────────────────────────────────────
const HUD = React.memo(function HUD({ score, health, wave, kills }) {
  const hpColor =
    health > 60 ? '#22ee44' : health > 30 ? '#ffaa00' : '#ff2200';
  return (
    <>
      {/* Score */}
      <View style={hudStyles.scoreBg}>
        <Text style={hudStyles.scoreText}>{score.toLocaleString()}</Text>
      </View>

      {/* Wave */}
      <View style={hudStyles.waveBg}>
        <Text style={hudStyles.waveText}>WAVE {wave}</Text>
      </View>

      {/* Kills */}
      <View style={hudStyles.killsBg}>
        <Text style={hudStyles.killsText}>💀 {kills}</Text>
      </View>

      {/* Health */}
      <View style={hudStyles.healthWrap}>
        <Text style={hudStyles.healthLabel}>❤️  {Math.ceil(health)}%</Text>
        <View style={hudStyles.healthBg}>
          <View
            style={[
              hudStyles.healthFill,
              { width: `${Math.max(0, health)}%`, backgroundColor: hpColor },
            ]}
          />
        </View>
      </View>
    </>
  );
});

const hudStyles = StyleSheet.create({
  scoreBg: {
    position: 'absolute',
    top: 36,
    alignSelf: 'center',
    left: 0,
    right: 0,
    alignItems: 'center',
    pointerEvents: 'none',
  },
  scoreText: {
    fontSize: 46,
    fontWeight: '900',
    color: '#fff',
    textShadowColor: '#ff4400',
    textShadowRadius: 14,
    textShadowOffset: { width: 0, height: 0 },
    letterSpacing: 2,
  },
  waveBg: {
    position: 'absolute',
    top: 44,
    right: 14,
    backgroundColor: 'rgba(200,40,40,0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,80,80,0.4)',
  },
  waveText: {
    color: '#ff9999',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 3,
  },
  killsBg: {
    position: 'absolute',
    top: 44,
    left: 14,
    backgroundColor: 'rgba(200,40,40,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,80,80,0.3)',
  },
  killsText: {
    color: '#ff9999',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  healthWrap: {
    position: 'absolute',
    bottom: 28,
    left: 16,
    right: 16,
  },
  healthLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 5,
  },
  healthBg: {
    height: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 7,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  healthFill: {
    height: 14,
    borderRadius: 7,
  },
});

// ─── Main screen ─────────────────────────────────────────────────
export default function GameScreen({ navigate }) {
  const [tick, setTick] = useState(0);
  const [hudScore, setHudScore]   = useState(0);
  const [hudHealth, setHudHealth] = useState(100);
  const [hudWave, setHudWave]     = useState(1);
  const [hudKills, setHudKills]   = useState(0);

  const active     = useRef(true);
  const score      = useRef(0);
  const health     = useRef(100);
  const wave       = useRef(1);
  const waveKills  = useRef(0);
  const totalKills = useRef(0);
  const zombies    = useRef([]);
  const bullets    = useRef([]);
  const playerX    = useRef(W / 2);
  const lastFire   = useRef(0);
  const lastSpawn  = useRef(0);
  const frameId    = useRef(null);
  const hudTimer   = useRef(null);
  const navigateRef = useRef(navigate);
  useEffect(() => { navigateRef.current = navigate; }, [navigate]);

  // Touch
  const touchStartX   = useRef(0);
  const playerStartX  = useRef(W / 2);

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder:  () => true,
      onPanResponderGrant: (e) => {
        touchStartX.current  = e.nativeEvent.pageX;
        playerStartX.current = playerX.current;
      },
      onPanResponderMove: (e) => {
        const dx = e.nativeEvent.pageX - touchStartX.current;
        playerX.current = Math.max(
          W / 2 - PLAYER_RANGE,
          Math.min(W / 2 + PLAYER_RANGE, playerStartX.current + dx)
        );
      },
    })
  ).current;

  const spawnZombie = useCallback(() => {
    const hw   = roadHW(ROAD_TOP_Y + 6);
    const x    = ROAD_CX + (Math.random() - 0.5) * 2 * hw * 0.8;
    const boss = Math.random() < 0.07 + wave.current * 0.013;
    const hp   = Z_BASE_HP + wave.current + (boss ? 7 : 0);
    zombies.current.push({
      id:     ++_zid,
      x,
      y:      ROAD_TOP_Y + 6,
      hp,
      maxHp:  hp,
      speed:  Z_BASE_SPD * (1 + (wave.current - 1) * 0.09) * (boss ? 0.6 : 1),
      isBoss: boss,
      hitFlash: 0,
    });
  }, []);

  const fireBullets = useCallback((now) => {
    if (now - lastFire.current < FIRE_MS) return;
    if (!zombies.current.length) return;
    lastFire.current = now;

    const px = playerX.current;
    const py = PLAYER_Y - 26;

    const target = zombies.current.reduce((best, z) => {
      const d = Math.hypot(z.x - px, z.y - py);
      return !best || d < Math.hypot(best.x - px, best.y - py) ? z : best;
    }, null);
    if (!target) return;

    const dx  = target.x - px;
    const dy  = target.y - py;
    const len = Math.hypot(dx, dy) || 1;
    const vx  = (dx / len) * B_SPEED;
    const vy  = (dy / len) * B_SPEED;

    [-25, 0, 25].forEach(off => {
      bullets.current.push({ id: ++_bid, x: px + off, y: py, vx, vy });
    });
  }, []);

  const loop = useCallback((ts) => {
    if (!active.current) return;
    const now = ts || Date.now();

    // Spawn
    const spawnInterval = Math.max(450, SPAWN_MS - (wave.current - 1) * 120);
    if (now - lastSpawn.current > spawnInterval) {
      spawnZombie();
      if (wave.current >= 3 && Math.random() < 0.45) spawnZombie();
      if (wave.current >= 5 && Math.random() < 0.3)  spawnZombie();
      lastSpawn.current = now;
    }

    // Fire
    fireBullets(now);

    // Move bullets
    bullets.current = bullets.current.filter(b => {
      b.x += b.vx;
      b.y += b.vy;
      return b.y > ROAD_TOP_Y - 50 && b.x > -30 && b.x < W + 30;
    });

    // Move zombies
    const px = playerX.current;
    zombies.current.forEach(z => {
      const dx  = px - z.x;
      const dy  = PLAYER_Y - z.y;
      const len = Math.hypot(dx, dy) || 1;
      z.x += (dx / len) * z.speed;
      z.y += (dy / len) * z.speed;
      if (z.hitFlash > 0) z.hitFlash--;
      const hw = roadHW(z.y);
      z.x = Math.max(ROAD_CX - hw, Math.min(ROAD_CX + hw, z.x));
    });

    // Bullet-zombie collision
    const deadSet = new Set();
    bullets.current = bullets.current.filter(b => {
      for (const z of zombies.current) {
        if (deadSet.has(z.id)) continue;
        const s = scaleAt(z.y);
        if (Math.hypot(b.x - z.x, b.y - z.y) < 24 * s) {
          z.hp--;
          z.hitFlash = 5;
          if (z.hp <= 0) {
            deadSet.add(z.id);
            score.current  += (z.isBoss ? 500 : 100) * wave.current;
            waveKills.current++;
            totalKills.current++;
          }
          return false;
        }
      }
      return true;
    });
    zombies.current = zombies.current.filter(z => !deadSet.has(z.id));

    // Wave progression
    if (waveKills.current >= KILLS_PER_WAVE * wave.current) {
      wave.current++;
      waveKills.current = 0;
    }

    // Zombie reaches player
    const reached = zombies.current.filter(z => z.y >= PLAYER_Y - 8);
    if (reached.length) {
      reached.forEach(z => {
        health.current -= z.isBoss ? 15 : 8;
      });
      zombies.current = zombies.current.filter(z => z.y < PLAYER_Y - 8);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
    }

    if (health.current <= 0) {
      health.current = 0;
      active.current = false;
      navigateRef.current('gameover', {
        score: score.current,
        kills: totalKills.current,
        wave:  wave.current,
      });
      return;
    }

    setTick(t => t + 1);
    frameId.current = requestAnimationFrame(loop);
  }, [spawnZombie, fireBullets]);

  // HUD refresh (decoupled from game loop for perf)
  useEffect(() => {
    hudTimer.current = setInterval(() => {
      setHudScore(score.current);
      setHudHealth(health.current);
      setHudWave(wave.current);
      setHudKills(totalKills.current);
    }, 100);
    return () => clearInterval(hudTimer.current);
  }, []);

  useEffect(() => {
    frameId.current = requestAnimationFrame(loop);
    return () => {
      active.current = false;
      if (frameId.current) cancelAnimationFrame(frameId.current);
    };
  }, [loop]);

  const sortedZombies = zombies.current.slice().sort((a, b) => a.y - b.y);

  return (
    <View style={styles.root} {...pan.panHandlers}>
      <StatusBar hidden />

      {/* Sky */}
      <LinearGradient
        colors={['#050510', '#0a0a22', '#101535']}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Road */}
      <RoadView />

      {/* Bullets */}
      {bullets.current.map(b => (
        <BulletView key={b.id} x={b.x} y={b.y} vx={b.vx} vy={b.vy} />
      ))}

      {/* Zombies (painter's order: far → near) */}
      {sortedZombies.map(z => (
        <ZombieView key={z.id} zombie={z} />
      ))}

      {/* Player */}
      <PlayerView x={playerX.current} />

      {/* HUD */}
      <HUD
        score={hudScore}
        health={hudHealth}
        wave={hudWave}
        kills={hudKills}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#050510',
    overflow: 'hidden',
  },
});
