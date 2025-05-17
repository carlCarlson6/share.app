import { albumsUsersTable, db, photosTable } from "@/lib/db";
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
    .from(photosTable)
    .where(eq(photosTable.id, imgId))
    .then(x => x.at(0));
  if (!photo) {
    console.error("photo not found");
    return notFound();
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
    return notFound();
  }

  const response = await fetch(photo.uploadThingUrl);

  response.headers.set('content-disposition', `attachment; filename="${photo.fileName}"`)

  return response;
}