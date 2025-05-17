"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, UploadIcon } from "lucide-react"
import type React from "react"
import { Upload } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { UploadDropzone, useUploadThing } from "@/lib/uploadthing"
import { BarLoader } from "react-spinners";
import { photosTable } from "@/lib/db"
import placeHolderImage from '../../../../public/placeholder.jpg'

type Photo = typeof photosTable.$inferSelect & { content: Blob | null | undefined }

export function PhotoGrid({ 
  albumId, photos
}: { 
  albumId: string,
  photos: Photo[]
 }) {
  
  if (photos.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">No photos in this album yet.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {photos.map((photo) => (
        <Link href={`/albums/${albumId}/photos/${photo.id}`} key={photo.id}>
          <Card className="overflow-hidden transition-all hover:shadow-xl">
            <CardContent className="p-0">
                <img
                  src={ photo.content || placeHolderImage.src }
                  alt={photo.note || "Photo"}
                />
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

export const GoBackButton = () => {
  return (
    <Button variant="outline" size="icon" asChild>
      <Link href={`/albums`}>
        <ArrowLeft className="w-4 h-4" />    
      </Link>  
    </Button>
  );
}

export const UploadPhotosButton = () => {
  return (
    <Button>
      <UploadIcon />
      upload photos
    </Button>
  );
}


interface UploadPhotoModalProps {
  albumId: string
  albumName: string
}

export function UploadPhotoModal({ albumId, albumName }: UploadPhotoModalProps) {
  const [open, setOpen] = useState(false)
  const [files, setFiles] = useState<File[]>([]);
  const router = useRouter();
  const {startUpload, isUploading} = useUploadThing("imageUpload", {
    onClientUploadComplete: () => {
      setOpen(false);
      router.refresh();
    }
  });

  return (
    <Dialog 
      open={open} 
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        setFiles([]);
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Upload className="w-4 h-4 mr-2" />
          Upload Photos
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Photos to {albumName}</DialogTitle>
          <DialogDescription>Add new photos to your album. You can upload multiple files at once.</DialogDescription>
        </DialogHeader>
        <UploadDropzone
          endpoint="imageUpload"
          onChange={(files) => {
            console.log("Files: ", files)
            setFiles(files);
          }}
          input={{ albumId: albumId }}
        />
        <Button
          disabled={!files || files.length === 0}
          onClick={() => startUpload(files, {albumId: albumId})}
        >
          {
            isUploading ? <BarLoader /> : <>upload</>
          }
        </Button>
      </DialogContent>
    </Dialog>
  )
}