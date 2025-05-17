"use client"

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export const DownloadPhotoBtn = ({ photoId }: { photoId: string }) => (
  <Button
    variant="outline"
    size="icon"
  >
    <a href={`/api/serve-images/${photoId}`}>
      <Download className="w-4 h-4" />
      <span className="sr-only">Download</span>
    </a>
  </Button>
);