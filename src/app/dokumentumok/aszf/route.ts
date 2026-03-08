import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.redirect(new URL('/documents/ROSTI – ÁSZF.pdf', 'https://www.rosti.hu'));
}
