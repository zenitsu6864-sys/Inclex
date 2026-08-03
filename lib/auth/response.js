// Response helpers for the App Router API.
import { NextResponse } from 'next/server';

export const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
};

export function json(data, status = 200, extraHeaders = {}) {
  return NextResponse.json(data, { status, headers: { ...CORS, ...extraHeaders } });
}

export function optionsResponse() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export function parsePath(request) {
  const url = new URL(request.url);
  const parts = url.pathname.replace(/^\/api\/?/, '').split('/').filter(Boolean);
  return { parts, url };
}

export function withCookie(res, name, value, maxAge) {
  const attrs = [`${name}=${value}`, 'Path=/', 'HttpOnly', 'SameSite=Lax'];
  attrs.push(`Max-Age=${maxAge ?? 0}`);
  res.headers.append('Set-Cookie', attrs.join('; '));
  return res;
}
