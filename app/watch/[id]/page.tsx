'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, List } from 'lucide-react';
import { use } from 'react';

export default function WatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [episode, setEpisode] = useState<any>(null);
  const [allEpisodes, setAllEpisodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/anime/getEpisode/${id}`)
      .then(r => r.json())
      .then(d => {
        setEpisode(d);
        setLoading(false);
        const animeId = d?.anime_info || d?.animeId;
        if (animeId) {
          fetch(`/api/anime/getAnime/${animeId}`)
            .then(r => r.json())
            .then(a => setAllEpisodes(a?.episodes || a?.episodeList || a?.episode_id || []));
        }
      })
      .catch(() => setLoading(false));
  }, [id]);

  const playerUrl = `https://player.animezia.net/?id=${id}`;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 2rem' }}>
      <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        {episode?.anime_info && (
          <Link href={`/anime/${episode.anime_info}`} className="btn btn-ghost" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}>
            ← Back to Anime
          </Link>
        )}
        <h1 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)' }}>
          {episode?.animeNameWithEP || episode?.title || `Episode ${id}`}
        </h1>
      </div>

      <div className="watch-container" style={{ padding: 0, maxWidth: '100%' }}>
        <div>
          <div className="watch-player-wrap">
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#000' }}>
                <div className="spinner" />
              </div>
            ) : (
              <iframe
                src={playerUrl}
                allowFullScreen
                allow="autoplay; fullscreen"
                title={episode?.animeNameWithEP || 'Anime Episode'}
              />
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
            {episode?.prevEpLink && (
              <Link href={`/watch${episode.prevEpLink}`} className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>
                <ChevronLeft size={16} /> Previous
              </Link>
            )}
            {episode?.nextEpLink && (
              <Link href={`/watch${episode.nextEpLink}`} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                Next <ChevronRight size={16} />
              </Link>
            )}
          </div>

          <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--card)', borderRadius: '10px', fontSize: '0.8rem', color: 'var(--muted)' }}>
            <p>🎬 Video is streamed via embedded player. If it doesn&apos;t load, try refreshing the page.</p>
          </div>
        </div>

        <div>
          <div className="ep-list">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div className="ep-list-title">Episodes</div>
              <List size={14} color="var(--muted)" />
            </div>
            {allEpisodes.length === 0 && (
              <p style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>Loading episodes...</p>
            )}
            {allEpisodes.map((ep: any, i: number) => {
              const epId = ep.id || ep.episodeId || (typeof ep === 'string' ? ep : null);
              const epNum = ep.number || ep.episode || ep.episodeNumber || (i + 1);
              const isActive = epId === id;
              return epId ? (
                <Link key={epId} href={`/watch/${epId}`} className={`ep-item ${isActive ? 'active' : ''}`}>
                  EP {epNum}
                </Link>
              ) : null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
