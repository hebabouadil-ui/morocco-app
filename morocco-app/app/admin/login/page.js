'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr(''); setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErr(data.error || 'Login failed.');
        setLoading(false);
        return;
      }
      router.push('/admin');
      router.refresh();
    } catch (e) {
      setErr('Network error.');
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-charcoal p-4">
      <div className="w-full max-w-md bg-cream p-12 rounded-sm shadow-2xl">
        <div className="text-center mb-8">
          <div className="text-xs uppercase tracking-wide-3 text-terracotta mb-2">M · S · S</div>
          <h1 className="font-display text-3xl mb-1">Admin Dashboard</h1>
          <p className="text-sm text-muted">Sign in to continue.</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="field-label">Email</label>
            <input type="email" required value={email}
              onChange={e => setEmail(e.target.value)} className="field-input" autoFocus />
          </div>
          <div>
            <label className="field-label">Password</label>
            <input type="password" required value={password}
              onChange={e => setPassword(e.target.value)} className="field-input" />
          </div>
          {err && <div className="text-sm text-terracotta">{err}</div>}
          <button type="submit" disabled={loading} className="btn btn-primary w-full justify-center">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        <p className="text-xs text-muted text-center mt-6">
          Default: admin@moroccoskys.com / admin123<br />
          (Change with the seed script.)
        </p>
      </div>
    </main>
  );
}
