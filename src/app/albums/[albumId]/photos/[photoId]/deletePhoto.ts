"use server"

import { db, photosTable, albumsUsersTable } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { eq, and, count } from "drizzle-orm";

export const deletePhoto = async (imgId: string) => {
  console.info("deleting photo -", imgId);

  const user = await currentUser();
  if (!user) {
    return "no-user" as const;
  }

  const photo = await db
    .select()
    .from(photosTable)
    .where(eq(photosTable.id, imgId))
    .then(x => x.at(0));
  if (!photo) {
    console.error("photo not found");
    return "photo-not-found" as const;
  }
  
  const result = await db
    .select({ count: count() })
    .from(albumsUsersTable)
    .where(
      and(
        eq(albumsUsersTable.albumId, photo.albumId),
        eq(albumsUsersTable.userId, user.id)
      ))
    .then(x => x.at(0))
  if (!result && result !== 1) {
    console.error("photo not owned");
    return "photo-not-owned" as const;
  }

  await db
    .delete(photosTable)
    .where(eq(photosTable.id, imgId));

  return "done" as const;
}

