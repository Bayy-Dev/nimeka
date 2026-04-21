'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import AnimeCard from '@/components/AnimeCard';
import { Search, Loader } from 'lucide-react';
import { Suspense } from 'react';

function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState(q);

  useEffect(() => {
    if (!q) return;
    setLoading(true);
    fetch(`/api/anime/search/${encodeURIComponent(q)}`)
      .then(r => r.json())
      .then(d => {
        setResults(d?.results || d?.animes || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [q]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `/search?q=${encodeURIComponent(query)}`;
  };

  return (
    <div className="section" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Search bar */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', maxWidth: '500px' }}>
        <div className="navbar-search" style={{ flex: 1 }}>
          <Search size={14} color="var(--muted)" />
          <input
            type="text"
            placeholder="Search anime..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>
        <button type="submit" className="btn btn-primary">Search</button>
      </form>

      {q && (
        <div className="section-header">
          <h2 className="section-title">Results for &ldquo;{q}&rdquo;</h2>
          {results.length > 0 && <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{results.length} found</span>}
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div className="spinner" />
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="anime-grid">
          {results.map((anime: any) => (
            <AnimeCard
              key={anime.id}
              id={anime.id}
              title={anime.title}
              poster={anime.image || anime.poster}
              status={anime.status}
            />
          ))}
        </div>
      )}

      {!loading && q && results.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <p>No results for &ldquo;{q}&rdquo;</p>
        </div>
      )}

      {!q && (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔎</div>
          <p>Type something to search anime</p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '6rem' }}><div className="spinner" /></div>}>
      <SearchResults />
    </Suspense>
  );
}
