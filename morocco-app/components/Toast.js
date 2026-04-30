'use client';
import { useState, useCallback, useEffect } from 'react';

let _setMessage = null;

export function showToast(msg, type = 'success') {
  if (_setMessage) _setMessage({ msg, type, key: Date.now() });
}

export function ToastHost() {
  const [state, setState] = useState(null);
  useEffect(() => {
    _setMessage = setState;
    return () => { _setMessage = null; };
  }, []);
  useEffect(() => {
    if (!state) return;
    const t = setTimeout(() => setState(null), 3500);
    return () => clearTimeout(t);
  }, [state]);
  if (!state) return null;
  const color = state.type === 'error' ? 'bg-terracotta' : state.type === 'warn' ? 'bg-gold-dark' : 'bg-charcoal';
  return (
    <div className={`fixed bottom-6 right-6 z-[200] ${color} text-white px-5 py-3 rounded-sm shadow-2xl text-sm font-medium animate-fade-up`}>
      {state.msg}
    </div>
  );
}
