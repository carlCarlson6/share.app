"use client"

import { useState } from "react"
import { ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { photosTable } from "@/lib/db"

type Photo = typeof photosTable.$inferSelect & { content: Blob | null | undefined }

export function PhotoViewer({ photo }: { photo: Photo }) {
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
          <img
            src={photo.content || "/placeholder.jpg"}
            alt={photo.note || "Photo"}
            className="object-contain transition-transform"
            style={{ transform: `scale(${zoom})` }}
          />
        </div>
      </div>
      <div className="absolute flex items-center gap-3 p-3 bg-white rounded-lg shadow-md bottom-6 right-6">
        <Button variant="outline" size="icon" onClick={zoomOut} disabled={zoom <= 1}>
          <ZoomOut className="w-4 h-4" />
          <span className="sr-only">Zoom out</span>
        </Button>
        <span className="text-sm font-medium">{Math.round(zoom * 100)}%</span>
        <Button variant="outline" size="icon" onClick={zoomIn} disabled={zoom >= 3}>
          <ZoomIn className="w-4 h-4" />
          <span className="sr-only">Zoom in</span>
        </Button>
      </div>
    </div>
  )
}
