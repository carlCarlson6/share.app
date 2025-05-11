import { drizzle } from 'drizzle-orm/neon-serverless';
import { pgTable, primaryKey, timestamp, varchar } from "drizzle-orm/pg-core";
import ws from 'ws';

export const albums = pgTable("albums", {
  id:           varchar({ length: 128 }).primaryKey(),
  name:         varchar({ length: 255 }).notNull(),
  description:  varchar({ length: 255 }),
  coverImage:   varchar({ length: 255 }),
  createdAt:    timestamp().notNull(),
});

export const albumsUsers = pgTable(
  'users_to_albums', 
  {
    userId:   varchar('userId', { length: 128 }).notNull(),
    albumId:  varchar('albumId', { length: 128 }).notNull().references(() => albums.id),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.albumId] })
  ],
);

export const photos = pgTable("photos", {
  id:       varchar({ length: 128 }).primaryKey(),
  note:     varchar({ length: 255 }),
  uploadThingUrl: varchar({ length: 255 }).notNull(),
  uploadThingId:  varchar({ length: 128 }).notNull(),
  albumId:  varchar({ length: 128 }).notNull().references(() => albums.id),
  uploadBy: varchar({ length: 128 }).notNull(),
  uploadAt: timestamp().notNull(),
});

export const db = drizzle({
  connection: process.env.DATABASE_URL!,
  ws: ws,
  schema: {
    albums,
    albumsUsers,
    photos,
  },
});