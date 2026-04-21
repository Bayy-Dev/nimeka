'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';
import { Search, Bookmark, LogOut, User, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
    }
  };

  return (
    <nav className="navbar">
      <Link href="/" className="navbar-logo">
        nime<span>ka</span>
      </Link>

      <ul className="navbar-links">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/search?q=ongoing">Ongoing</Link></li>
        <li><Link href="/search?q=popular">Popular</Link></li>
      </ul>

      <form onSubmit={handleSearch} className="navbar-search">
        <Search size={14} color="var(--muted)" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search anime..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {session ? (
          <>
            <Link href="/watchlist" className="btn btn-ghost" style={{ padding: '0.4rem 0.8rem' }}>
              <Bookmark size={14} /> Watchlist
            </Link>
            <button
              className="btn btn-ghost"
              style={{ padding: '0.4rem 0.8rem' }}
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              <LogOut size={14} />
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="btn btn-ghost" style={{ padding: '0.4rem 0.8rem' }}>
              <User size={14} /> Login
            </Link>
            <Link href="/register" className="btn btn-primary" style={{ padding: '0.4rem 0.9rem' }}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
