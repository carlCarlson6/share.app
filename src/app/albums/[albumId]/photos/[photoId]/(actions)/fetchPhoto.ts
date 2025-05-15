import "server-only";
import { albumsUsers, db, photos } from "@/lib/db";
import { User } from "@clerk/nextjs/server";
import { eq, and, count } from "drizzle-orm";

export const fetchPhoto = async (photoId: string, user: User) => {
  const photo = await db
    .select()
    .from(photos)
    .where(eq(photos.id, photoId),)
    .then(x => x.at(0));
  if (!photo) {
    console.error("photo not found");
    return "photo-not-found" as const;
  }

  const validation = await db
    .select({ count: count() })
    .from(albumsUsers)
    .where(
      and(
        eq(albumsUsers.albumId, photo.albumId),
        eq(albumsUsers.userId, user.id)
      ))
    .then(x => x.at(0))

  if (!validation && validation !== 1) {
    console.error("photo not owned");
    return "not-authorized-to-access" as const
  }

  return photo;
}