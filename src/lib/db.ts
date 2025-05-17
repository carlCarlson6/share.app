import { drizzle } from 'drizzle-orm/neon-serverless';
import { pgTable, primaryKey, timestamp, varchar } from "drizzle-orm/pg-core";
import ws from 'ws';

export const albumsTable = pgTable("albums", {
  id:           varchar({ length: 128 }).primaryKey(),
  name:         varchar({ length: 255 }).notNull(),
  description:  varchar({ length: 255 }),
  coverImage:   varchar({ length: 255 }),
  createdAt:    timestamp().notNull(),
});

export const albumsUsersTable = pgTable(
  'users_to_albums', 
  {
    userId:   varchar('userId', { length: 128 }).notNull(),
    albumId:  varchar('albumId', { length: 128 }).notNull().references(() => albumsTable.id),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.albumId] })
  ],
);

export const photosTable = pgTable("photos", {
  id:       varchar({ length: 128 }).primaryKey(),
  fileName: varchar({ length: 255 }).notNull(),
  note:     varchar({ length: 255 }),
  uploadThingUrl: varchar({ length: 255 }).notNull(),
  uploadThingId:  varchar({ length: 128 }).notNull(),
  albumId:  varchar({ length: 128 }).notNull().references(() => albumsTable.id),
  uploadBy: varchar({ length: 128 }).notNull(),
  uploadAt: timestamp().notNull(),
});

export const db = drizzle({
  connection: process.env.DATABASE_URL!,
  ws: ws
});