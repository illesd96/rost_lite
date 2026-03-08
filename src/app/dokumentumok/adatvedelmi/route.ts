import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.redirect(new URL('/documents/ROSTI – ADATKEZELÉSI.pdf', 'https://www.rosti.hu'));
}
