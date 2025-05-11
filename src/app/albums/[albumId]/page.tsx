import { albums, albumsUsers, db, photos } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { GoBackButton, PhotoGrid, UploadPhotoModal } from "./components";

const fetchAlbumInfo = async (albumId: string) => {
  const user = await currentUser();
  if (!user) {
    return redirect("/join");
  }

  const result = await db
    .select({
      albums
    })
    .from(albums)
    .innerJoin(albumsUsers, 
      and(
        eq(albums.id, albumsUsers.albumId), 
        eq(albumsUsers.userId, user.id)))
      .where(eq(albums.id, albumId))
      .then(x => x.map(y => y.albums));
  const album = result.at(0);
  if (!album) { 
    return notFound();
  }

  const albumPhotos = await db
    .select()
    .from(photos)
    .where(eq(photos.albumId, album.id));

  return {
    ...album,
    photos: albumPhotos,
  };
} 

export default async function AlbumPage({params,}: {
  params: Promise<{ albumId: string }>;
}) {
  const {albumId} = await params;
  const album = await fetchAlbumInfo(albumId);
  return (
    <div className="container px-6 py-8 mx-auto space-y-10 md:px-8 lg:px-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <GoBackButton />
          <h1 className="text-3xl font-bold">{album.name}</h1>
        </div>
        <UploadPhotoModal albumId={album.id} albumName={album.name} />
      </div>
      <div className="px-4">
        {album.description}
      </div>
      <PhotoGrid albumId={album.id} photos={album.photos} />
    </div>
  );
}