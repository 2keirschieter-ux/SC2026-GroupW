import { NextResponse } from 'next/server';
export function errorResponse(status: number, code: string, message: string, details?: unknown) { return NextResponse.json({ error: { code, message, details } }, { status }); }
export function parseJson<T>(value: unknown): T { return value as T; }
