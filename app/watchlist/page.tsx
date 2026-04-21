'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import AnimeCard from '@/components/AnimeCard';
import { Bookmark } from 'lucide-react';

export default function WatchlistPage() {
  const { data: session, status } = useSession();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) { window.location.href = '/login'; return; }
    fetch('/api/user/watchlist')
      .then(r => r.json())
      .then(d => { setItems(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [session, status]);

  if (status === 'loading' || loading) return (
    <div style={{ textAlign: 'center', padding: '6rem' }}>
      <div className="spinner" />
    </div>
  );

  return (
    <div className="section" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="section-header">
        <h1 className="section-title"><Bookmark size={18} /> My Watchlist</h1>
        <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{items.length} anime</span>
      </div>

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--muted)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
          <p style={{ marginBottom: '1rem' }}>Your watchlist is empty</p>
          <Link href="/" className="btn btn-primary">Browse Anime</Link>
        </div>
      ) : (
        <div className="anime-grid">
          {items.map(item => (
            <AnimeCard
              key={item.animeId}
              id={item.animeId}
              title={item.animeTitle}
              poster={item.animePoster}
              status={item.animeStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}
