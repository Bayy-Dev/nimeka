const API = process.env.ANIME_API_URL || 'https://gogo-api-topaz.vercel.app';

export async function getHome() {
  const res = await fetch(`${API}/`, { next: { revalidate: 300 } });
  if (!res.ok) return null;
  return res.json();
}

export async function getAnime(id: string) {
  const res = await fetch(`${API}/getAnime/${id}`, { next: { revalidate: 300 } });
  if (!res.ok) return null;
  return res.json();
}

export async function getEpisode(id: string) {
  const res = await fetch(`${API}/getEpisode/${id}`, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  return res.json();
}

export async function searchAnime(query: string) {
  const res = await fetch(`${API}/search/${encodeURIComponent(query)}`, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  return res.json();
}

export async function getPopular(page = 1) {
  const res = await fetch(`${API}/popular/${page}`, { next: { revalidate: 300 } });
  if (!res.ok) return null;
  return res.json();
}

export async function getRecentEpisodes(page = 1) {
  const res = await fetch(`${API}/recentEpisodes/${page}`, { next: { revalidate: 120 } });
  if (!res.ok) return null;
  return res.json();
}
