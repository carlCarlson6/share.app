import "server-only";
import { albumsUsersTable, db, photosTable } from "@/lib/db";
import { User } from "@clerk/nextjs/server";
import { eq, and, count } from "drizzle-orm";

export const fetchPhoto = async (photoId: string, user: User) => {
  const photo = await db
    .select()
    .from(photosTable)
    .where(eq(photosTable.id, photoId),)
    .then(x => x.at(0));
  if (!photo) {
    console.error("photo not found");
    return "photo-not-found" as const;
  }

  const validation = await db
    .select({ count: count() })
    .from(albumsUsersTable)
    .where(
      and(
        eq(albumsUsersTable.albumId, photo.albumId),
        eq(albumsUsersTable.userId, user.id)
      ))
    .then(x => x.at(0))

  if (!validation && validation !== 1) {
    console.error("photo not owned");
    return "not-authorized-to-access" as const
  }

  const response = await fetch(photo.uploadThingUrl);
  const content = response.ok ? await response.blob() : null;

  return {
    ...photo,
    content
  };
}