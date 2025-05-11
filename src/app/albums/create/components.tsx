"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";

export const CreateAlbumButton = () => { 
  const router = useRouter();
  return (
    <Button
      variant="outline"
      onClick={() => {router.push("/albums/create")}}
    >
      create new album
      <span className="sr-only">Create new album</span>

    </Button>
  );
}

export const CreateAlbumForm = () => {}