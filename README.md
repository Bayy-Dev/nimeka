# Nimeka 🎌

Anime streaming web app — Next.js 15, NextAuth, Neon PostgreSQL, Drizzle ORM.

## Stack
- **Framework**: Next.js 15 (App Router)
- **Auth**: NextAuth v5
- **DB**: Neon PostgreSQL + Drizzle ORM
- **Anime API**: gogo-api
- **Deploy**: Vercel

## Setup

### 1. Install
```bash
npm install
```

### 2. Neon DB
Daftar di [neon.tech](https://neon.tech) → buat project → copy connection string

### 3. .env.local
```env
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=   # openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000
ANIME_API_URL=https://gogo-api-topaz.vercel.app
```

### 4. Migrate DB
```bash
npx drizzle-kit push
```

### 5. Run
```bash
npm run dev
```

## Deploy Vercel
1. Push ke GitHub
2. Import di vercel.com
3. Tambah env vars (DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL → domain vercel, ANIME_API_URL)
4. Deploy

## Features
- Home: recent + popular anime
- Search
- Watch streaming (embedded player)
- Watchlist (login required)
- Register & Login
