import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const SECRET = process.env.JWT_SECRET;
const COOKIE_NAME = 'mss_admin_token';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

if (!SECRET) {
  throw new Error('JWT_SECRET is not defined in .env.local');
}

export function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: MAX_AGE });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (e) {
    return null;
  }
}

/** Set the auth cookie on a NextResponse */
export function setAuthCookie(response, token) {
  response.cookies.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE,
  });
  return response;
}

export function clearAuthCookie(response) {
  response.cookies.set({
    name: COOKIE_NAME,
    value: '',
    httpOnly: true,
    path: '/',
    maxAge: 0,
  });
  return response;
}

/** Read the current admin from the request cookie (server components / route handlers) */
export function getCurrentAdmin() {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

/** Wrapper for protected route handlers. Returns 401 JSON or admin payload. */
export function requireAdmin() {
  const admin = getCurrentAdmin();
  if (!admin) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }
  return { ok: true, admin };
}
