import { NextRequest, NextResponse } from 'next/server';
import { db, users } from '@/lib/db';
import { eq, or } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password)
      return NextResponse.json({ error: 'All fields required' }, { status: 400 });
    if (password.length < 6)
      return NextResponse.json({ error: 'Password min 6 characters' }, { status: 400 });

    const existing = await db
      .select()
      .from(users)
      .where(or(eq(users.email, email), eq(users.name, name)))
      .limit(1);

    if (existing.length > 0)
      return NextResponse.json({ error: 'Username or email already taken' }, { status: 409 });

    const hashed = await bcrypt.hash(password, 10);
    await db.insert(users).values({ name, email, password: hashed });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
