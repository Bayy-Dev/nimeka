import { NextRequest, NextResponse } from 'next/server';
import { db, watchlist } from '@/lib/db';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const items = await db.select().from(watchlist).where(eq(watchlist.userId, Number(session.user.id)));
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { animeId, animeTitle, animePoster, animeStatus } = await req.json();
  try {
    await db.insert(watchlist).values({
      userId: Number(session.user.id),
      animeId, animeTitle, animePoster, animeStatus,
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Already in watchlist' }, { status: 409 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { animeId } = await req.json();
  await db.delete(watchlist).where(
    and(eq(watchlist.userId, Number(session.user.id)), eq(watchlist.animeId, animeId))
  );
  return NextResponse.json({ success: true });
}
