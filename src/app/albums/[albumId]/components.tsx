"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, UploadIcon, ZoomIn, ZoomOut } from "lucide-react"
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
import { photos } from "@/lib/db"
import placeHolderImage from '../../../../public/placeholder.jpg'

type Photos = typeof photos.$inferSelect

export function PhotoGrid({ 
  albumId, photos
}: { 
  albumId: string,
  photos: Photos[]
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
          <Card className="overflow-hidden transition-all hover:shadow-md">
            <CardContent className="p-0">
              <div className="relative aspect-square">
                <Image
                  src={photo.url || placeHolderImage }
                  alt={photo.note || "Photo"}
                  fill
                  className="object-cover"
                />
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

export function PhotoViewer({ photo }: { photo: {
  url: string,
  title: string,
} }) {
  const [zoom, setZoom] = useState(1)

  const zoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3))
  const zoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 1))

  return (
    <div className="relative">
      <div className="overflow-hidden bg-black rounded-lg">
        <div
          className="relative flex items-center justify-center w-full transition-transform"
          style={{
            height: "calc(100vh - 300px)",
            minHeight: "400px",
          }}
        >
          <Image
            src={photo.url || "/placeholder.svg"}
            alt={photo.title || "Photo"}
            width={1200}
            height={800}
            className="object-contain transition-transform"
            style={{ transform: `scale(${zoom})` }}
          />
        </div>
      </div>
      <div className="absolute flex items-center gap-3 p-3 bg-white rounded-lg shadow-md bottom-6 right-6">
        <Button variant="outline" size="icon" onClick={zoomOut} disabled={zoom <= 1}>
          <ZoomOut className="w-4 h-4" />
          <span>Zoom out</span>
        </Button>
        <span className="text-sm font-medium">{Math.round(zoom * 100)}%</span>
        <Button variant="outline" size="icon" onClick={zoomIn} disabled={zoom >= 3}>
          <ZoomIn className="w-4 h-4" />
          <span>Zoom in</span>
        </Button>
      </div>
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