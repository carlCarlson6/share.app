"use server";
import { albums, albumsUsers, db } from "@/lib/db";
import { randomUUID } from "crypto";
import { z } from "zod";
import { redirect } from "next/navigation";
import { loggerMiddleware } from "@/lib/appMiddleware";
import { currentUser } from "@clerk/nextjs/server";

const createAlbumCommandSchema = z.object({
  name: z.string().min(1, { message: "Album name is required" }),
  description: z.string().optional(),
});

async function create(command: z.infer<typeof createAlbumCommandSchema>) {     
  const user = await currentUser();
  if (!user) {
    return redirect("/join");
  }

  console.info("on server submiting data", command);
  const albumId = randomUUID();
  const parsed = await createAlbumCommandSchema.parseAsync(command);

  db.transaction(async (tx) => {
    await tx
      .insert(albums)
      .values({
        id: albumId,
        name: parsed.name,
        description: parsed.description,
        createdAt: new Date(),
      });
    await tx
      .insert(albumsUsers)
      .values({
        userId: user.id,
        albumId: albumId,
      });
  });

  return redirect(`/albums/${albumId}`);
};

export const createAlbum = loggerMiddleware("create-album", create);