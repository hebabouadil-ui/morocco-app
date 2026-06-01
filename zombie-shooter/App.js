import React, { useState, useCallback } from 'react';
import HomeScreen from './src/HomeScreen';
import GameScreen from './src/GameScreen';
import GameOverScreen from './src/GameOverScreen';

export default function App() {
  const [screen, setScreen] = useState('home');
  const [result, setResult] = useState({ score: 0, kills: 0, wave: 1 });

  const navigate = useCallback((screenName, params = {}) => {
    if (Object.keys(params).length) setResult(prev => ({ ...prev, ...params }));
    setScreen(screenName);
  }, []);

  if (screen === 'home') return <HomeScreen navigate={navigate} />;
  if (screen === 'game') return <GameScreen navigate={navigate} />;
  if (screen === 'gameover') return <GameOverScreen navigate={navigate} result={result} />;
  return null;
}
