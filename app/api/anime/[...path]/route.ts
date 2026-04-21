import { NextRequest, NextResponse } from 'next/server';

const API = process.env.ANIME_API_URL || 'https://gogo-api-topaz.vercel.app';

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const pathStr = path.join('/');
  const url = new URL(req.url);
  const query = url.search;
  try {
    const res = await fetch(`${API}/${pathStr}${query}`, { next: { revalidate: 60 } });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'API error' }, { status: 500 });
  }
}
