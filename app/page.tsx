import { getHome, getRecentEpisodes, getPopular } from '@/lib/anime';
import AnimeCard from '@/components/AnimeCard';
import Link from 'next/link';
import { Play, Flame, Clock } from 'lucide-react';

export const revalidate = 180;

export default async function HomePage() {
  const [home, recent, popular] = await Promise.all([
    getHome(),
    getRecentEpisodes(1),
    getPopular(1),
  ]);

  const featured = popular?.results?.[0] || recent?.results?.[0];
  const recentList: any[] = recent?.results || [];
  const popularList: any[] = popular?.results || [];

  return (
    <>
      {/* Hero */}
      {featured && (
        <section className="hero">
          <img
            className="hero-bg"
            src={featured.image || featured.poster || ''}
            alt={featured.title}
          />
          <div className="hero-gradient" />
          <div className="hero-content">
            <div className="hero-meta">
              <span className="hero-tag">🔥 Popular Now</span>
              {featured.status && <span className="hero-tag">{featured.status}</span>}
              {featured.releaseDate && <span className="hero-tag">{featured.releaseDate}</span>}
            </div>
            <h1 className="hero-title">{featured.title}</h1>
            {featured.description && (
              <p className="hero-desc">{featured.description}</p>
            )}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link href={`/anime/${featured.id}`} className="btn btn-primary">
                <Play size={16} /> Watch Now
              </Link>
              <Link href={`/anime/${featured.id}`} className="btn btn-ghost">
                Details
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Recent Episodes */}
      {recentList.length > 0 && (
        <div className="section">
          <div className="section-header">
            <h2 className="section-title">
              <Clock size={16} /> Recent Episodes
            </h2>
            <Link href="/search?q=recent" className="btn btn-ghost" style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem' }}>
              View All
            </Link>
          </div>
          <div className="anime-grid">
            {recentList.slice(0, 18).map((anime: any) => (
              <AnimeCard
                key={anime.id || anime.episodeId}
                id={anime.id || anime.animeId}
                title={anime.title}
                poster={anime.image || anime.poster}
                episodeNumber={anime.episodeNumber}
                status="NEW"
              />
            ))}
          </div>
        </div>
      )}

      {/* Popular */}
      {popularList.length > 0 && (
        <div className="section" style={{ paddingTop: 0 }}>
          <div className="section-header">
            <h2 className="section-title">
              <Flame size={16} /> Popular Anime
            </h2>
          </div>
          <div className="anime-grid">
            {popularList.slice(0, 18).map((anime: any) => (
              <AnimeCard
                key={anime.id}
                id={anime.id}
                title={anime.title}
                poster={anime.image || anime.poster}
                status={anime.status}
              />
            ))}
          </div>
        </div>
      )}

      {/* Fallback if API is down */}
      {!recentList.length && !popularList.length && (
        <div style={{ textAlign: 'center', padding: '6rem 2rem', color: 'var(--muted)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📡</div>
          <h2 style={{ marginBottom: '0.5rem' }}>Couldn&apos;t load anime</h2>
          <p style={{ fontSize: '0.875rem' }}>The anime API might be down. Try refreshing.</p>
        </div>
      )}
    </>
  );
}
