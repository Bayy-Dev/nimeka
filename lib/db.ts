import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { pgTable, serial, text, timestamp, integer, unique } from 'drizzle-orm/pg-core';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  image: text('image').default('/files/avatar/user-1.jpeg'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Watchlist table
export const watchlist = pgTable('watchlist', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  animeId: text('anime_id').notNull(),
  animeTitle: text('anime_title').notNull(),
  animePoster: text('anime_poster').notNull(),
  animeStatus: text('anime_status').default('ongoing'),
  addedAt: timestamp('added_at').defaultNow(),
}, (t) => ({
  unq: unique().on(t.userId, t.animeId),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type WatchlistItem = typeof watchlist.$inferSelect;
