"use client"

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export const DownloadPhotoBtn = ({ photoId }: { photoId: string }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const execute = () => {
    setIsDownloading(true);
    fetch(`/api/serve-images/${photoId}`)
      .then(x => x.body)
      .then(body => download);
  }

  return (
    
      <Button 
        variant="outline" 
        size="icon"
        onClick={() => execute()}
      >
        
        <Download className="w-4 h-4" />
        <span className="sr-only">Download</span>
      </Button>
    
  );
}

  const download = (filename, content) => {
    var element = document.createElement("a");
    element.setAttribute("href", content);
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  };