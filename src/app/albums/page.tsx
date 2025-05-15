import { albums, db, albumsUsers, photos } from "@/lib/db";
import { currentUser, User } from "@clerk/nextjs/server";
import { and, count, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { AlbumGrid } from "./components";
import { CreateAlbumButton } from "./create/components";

const fetchAlbumsInfo = async (user: User) => {
  const albumsResoult = await db
    .select({ albums })
    .from(albums)
    .innerJoin(
      albumsUsers,
      and(
        eq(albumsUsers.albumId, albums.id), 
        eq(albumsUsers.userId, user.id))
    )
    .then(x => x.map(y => y.albums));

  const albumsInfo = [];
  for (const album of albumsResoult) {
    const photosCount = await db
      .select({ count: count() })
      .from(photos)
      .where(eq(photos.albumId, album.id))
      .then(x => x[0]?.count ?? 0);

    albumsInfo.push({
      ...album,
      photosCount
    });
  }

  return albumsInfo;
}

export default async function AlbumsPage() {
  const user = await currentUser();
  if (!user) {
    return redirect("/join");
  }

  const albums = await fetchAlbumsInfo(user);

  return (
    <div className="p-4">
      <div className="container px-6 py-8 mx-auto space-y-10 md:px-8 lg:px-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">
            My Photo Albums
          </h1>
          <CreateAlbumButton />
        </div>
        <AlbumGrid albums={albums}/>
      </div>
    </div>
  );
}