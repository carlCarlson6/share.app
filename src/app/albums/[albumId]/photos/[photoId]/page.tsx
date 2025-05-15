import Link from "next/link"
import { ArrowLeft, Download, Share2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DeletePhotoBtn} from "./(components)/DeletePhotoBtn";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { fetchPhoto } from "./(actions)/fetchPhoto";
import { PhotoViewer } from "./(components)/PhotoViewer";
import { DownloadPhotoBtn } from "./(components)/DownloadPhotoBtn";

export default async function PhotoPage({ params }: { params: Promise<{ albumId: string; photoId: string }> }) {
  const { albumId, photoId } = await params;
  
  const user = await currentUser();
  if (!user) return redirect('/join');

  const maybePhoto = await fetchPhoto(photoId, user);

  if (maybePhoto === "photo-not-found") return (
    <div className="container px-6 py-12 mx-auto text-center md:px-8 lg:px-10">
      <h1 className="text-2xl font-bold">Photo not found</h1>
      <Button asChild className="mt-4">
        <Link href={`/albums/${albumId}`}>Go back to album</Link>
      </Button>
    </div>
  );

  if (maybePhoto === "not-authorized-to-access") return redirect("/albums");

  return (
    <div className="container px-6 py-8 mx-auto space-y-8 md:px-8 lg:px-10">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/albums/${albumId}`}>
            <ArrowLeft className="w-4 h-4" />
            <span className="sr-only">Back to album</span>
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <DownloadPhotoBtn 
            photoId={maybePhoto.id}
          />
          <SharePhotoBtn />
          <DeletePhotoBtn 
            photoId={maybePhoto.id}
            albumId={maybePhoto.albumId}
          />
        </div>
      </div>
      <PhotoViewer photo={maybePhoto} />
      <div className="space-y-3 mt-6">
        <h2 className="text-2xl font-semibold">{maybePhoto.note}</h2>
        <p className="text-muted-foreground">{new Date(maybePhoto.uploadAt).toDateString()}</p>
      </div>
    </div>
  )
}

const SharePhotoBtn = () => (
  <Button variant="outline" size="icon">
    <Share2 className="w-4 h-4" />
    <span className="sr-only">Share</span>
  </Button>
);