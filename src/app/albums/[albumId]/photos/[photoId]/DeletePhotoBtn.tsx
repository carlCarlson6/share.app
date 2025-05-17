"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { match } from 'ts-pattern';
import { ClipLoader } from "react-spinners"
import { deletePhoto } from "./deletePhoto"

export const DeletePhotoBtn = ({ 
  photoId, albumId 
}: { 
  photoId: string, 
  albumId: string 
}) => {
  const { push } = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const execute = () => {
    setIsDeleting(true);
    return deletePhoto(photoId)
      .then(x => match(x)
      .with("no-user", () => push('/join'))
      .with("photo-not-found", async () => push('/404'))
      .with("photo-not-owned", async () => {
        setIsDeleting(false);
        throw new Error("not-owned");
      })
      .with("done", () => push(`/albums/${albumId}`))
      .exhaustive());
  }

  return (
    <Button 
      variant="outline" 
      size="icon" 
      className="text-destructive"
      disabled={isDeleting}
      onClick={() => execute()}
    >
      {
        isDeleting 
          ? <ClipLoader size={"20"} /> 
          : (<>
            <Trash2 className="w-4 h-4" />
            <span className="sr-only">Delete</span>    
          </>)
      }
    </Button>
  );
}