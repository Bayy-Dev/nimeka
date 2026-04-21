'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Play, Plus, Check, Loader } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { use } from 'react';

export default function AnimeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: session } = useSession();
  const [anime, setAnime] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [wlLoading, setWlLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/anime/getAnime/${id}`)
      .then(r => r.json())
      .then(d => { setAnime(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!session) return;
    fetch('/api/user/watchlist')
      .then(r => r.json())
      .then((items: any[]) => {
        if (Array.isArray(items)) setInWatchlist(items.some(i => i.animeId === id));
      });
  }, [session, id]);

  const toggleWatchlist = async () => {
    if (!session) { window.location.href = '/login'; return; }
    setWlLoading(true);
    if (inWatchlist) {
      await fetch('/api/user/watchlist', { method: 'DELETE', body: JSON.stringify({ animeId: id }), headers: { 'Content-Type': 'application/json' } });
      setInWatchlist(false);
    } else {
      await fetch('/api/user/watchlist', {
        method: 'POST',
        body: JSON.stringify({ animeId: id, animeTitle: anime?.name || anime?.title, animePoster: anime?.image || anime?.poster, animeStatus: anime?.status }),
        headers: { 'Content-Type': 'application/json' },
      });
      setInWatchlist(true);
    }
    setWlLoading(false);
  };

  if (loading) return (
    <div style={{ padding: '6rem', textAlign: 'center' }}>
      <div className="spinner" />
    </div>
  );

  if (!anime) return (
    <div style={{ padding: '6rem', textAlign: 'center', color: 'var(--muted)' }}>
      Anime not found.
    </div>
  );

  const title = anime.name || anime.title || 'Unknown';
  const poster = anime.image || anime.poster || '';
  const desc = anime.description || anime.synopsis || '';
  const genres: string[] = anime.genres || anime.genre || [];
  const episodes: any[] = anime.episodes || anime.episodeList || anime.episode_id || [];
  const firstEp = episodes[0];
  const firstEpId = firstEp?.id || firstEp?.episodeId || (typeof firstEp === 'string' ? firstEp : null);

  return (
    <div className="detail-container">
      <div>
        <img src={poster} alt={title} className="detail-poster"
          onError={(e) => { (e.target as HTMLImageElement).src = '/files/images/no_poster.jpg'; }} />
      </div>
      <div>
        <h1 className="detail-title">{title}</h1>
        <div className="detail-genres">
          {genres.map((g: any) => (
            <span key={typeof g === 'string' ? g : g.name} className="genre-tag">
              {typeof g === 'string' ? g : g.name}
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          {anime.status && <span className="hero-tag">{anime.status}</span>}
          {anime.releaseDate && <span className="hero-tag">{anime.releaseDate}</span>}
          {anime.totalEpisodes && <span className="hero-tag">{anime.totalEpisodes} eps</span>}
          {anime.type && <span className="hero-tag">{anime.type}</span>}
        </div>
        {desc && <p className="detail-desc">{desc}</p>}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {firstEpId && (
            <Link href={`/watch/${firstEpId}`} className="btn btn-primary">
              <Play size={16} /> Watch EP 1
            </Link>
          )}
          <button className="btn btn-ghost" onClick={toggleWatchlist} disabled={wlLoading}>
            {wlLoading ? <Loader size={14} /> : inWatchlist ? <Check size={14} /> : <Plus size={14} />}
            {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
          </button>
        </div>
        {episodes.length > 0 && (
          <>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)', marginBottom: '0.75rem' }}>
              Episodes ({episodes.length})
            </h3>
            <div className="ep-grid">
              {episodes.map((ep: any, i: number) => {
                const epId = ep.id || ep.episodeId || (typeof ep === 'string' ? ep : null);
                const epNum = ep.number || ep.episode || ep.episodeNumber || (i + 1);
                return epId ? (
                  <Link key={epId} href={`/watch/${epId}`} className="ep-item">
                    EP {epNum}
                  </Link>
                ) : null;
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
