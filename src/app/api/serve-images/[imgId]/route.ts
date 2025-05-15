import { albumsUsers, db, photos } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { and, count, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  {params}: { params: Promise<{imgId: string}> }
) {
  const { imgId } = await params;
  console.info("requesting access to image", imgId)

  const user = await currentUser();
  if (!user) {
    console.error("user not found");
    return notFound();
  }

  const photo = await db
    .select()
    .from(photos)
    .where(eq(photos.id, imgId))
    .then(x => x.at(0));
  if (!photo) {
    console.error("photo not found");
    return notFound();
  }

  const result = await db
    .select({ count: count() })
    .from(albumsUsers)
    .where(
      and(
        eq(albumsUsers.albumId, photo.albumId),
        eq(albumsUsers.userId, user.id)
      ))
    .then(x => x.at(0))
  if (!result && result !== 1) {
    console.error("photo not owned");
    return notFound();
  }

  return fetch(photo.uploadThingUrl);
}