import Link from 'next/link';

interface AnimeCardProps {
  id: string;
  title: string;
  poster?: string;
  episodeNumber?: string | number;
  status?: string;
}

export default function AnimeCard({ id, title, poster, episodeNumber, status }: AnimeCardProps) {
  const fallback = '/files/images/no_poster.jpg';
  return (
    <Link href={`/anime/${id}`} className="anime-card">
      {status && <span className="anime-card-badge">{status}</span>}
      <img
        src={poster || fallback}
        alt={title}
        loading="lazy"
        onError={(e) => { (e.target as HTMLImageElement).src = fallback; }}
      />
      <div className="anime-card-info">
        <div className="anime-card-title">{title}</div>
        {episodeNumber && (
          <div className="anime-card-ep">EP {episodeNumber}</div>
        )}
      </div>
    </Link>
  );
}
