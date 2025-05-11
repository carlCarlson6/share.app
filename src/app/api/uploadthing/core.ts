import { albums, albumsUsers, db, photos } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { and, count, eq } from "drizzle-orm";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { z } from "zod";

const f = createUploadthing();

const imageUpload = f({
    image: {
      maxFileSize: "16MB",
      maxFileCount: 10,
    },
  })
    .input(z.object({
      albumId: z.string(),
    }))
    .middleware(async ({input}) => {
      const user = await currentUser();
      if (!user) throw new UploadThingError("Unauthorized");

      const result = await db
        .select({count: count()})
        .from(albumsUsers)
        .where(
          and(
            eq(albumsUsers.userId, user.id), 
            eq(albumsUsers.albumId, input.albumId))
        );
      if (result[0].count !== 1)  throw new UploadThingError("Unauthorized");

      return { userId: user.id, albumId: input.albumId };
    })
    .onUploadComplete(async ({ metadata, file, }) => {
      await db.transaction(async tx => {
        await tx
          .insert(photos)
          .values({
            id: file.key,
            note: file.name,
            url: file.ufsUrl,
            albumId: metadata.albumId,
            uploadBy: metadata.userId,
            uploadAt: new Date(),
          });
        await tx
          .update(albums)
          .set({
            coverImage: file.ufsUrl
          })
          .where(eq(albums.id, metadata.albumId));
      });
    
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.ufsUrl);
      return { uploadedBy: metadata.userId };
    });

export const appFileRouter = {
  imageUpload
} satisfies FileRouter;

export type AppFileRouter = typeof appFileRouter;
