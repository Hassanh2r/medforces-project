// src/app/api/revalidate/route.js
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export const runtime = 'edge';

export async function POST(request) {
  // اقرأ المفتاح السري من الـ Headers
  const secret = request.headers.get('x-revalidate-secret')

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
  }

  revalidatePath('/articles')
  return NextResponse.json({ revalidated: true, now: Date.now() })
}