import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Admin from '@/models/Admin';
import { signToken, setAuthCookie } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }
    await dbConnect();
    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin || !(await admin.comparePassword(password))) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }
    const token = signToken({ id: admin._id.toString(), email: admin.email });
    const res = NextResponse.json({ ok: true, admin: { email: admin.email, name: admin.name } });
    return setAuthCookie(res, token);
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Login failed.' }, { status: 500 });
  }
}
