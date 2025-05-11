"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createAlbum } from "./action"

export default function CreateAlbumPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [albumData, setAlbumData] = useState<{
    name: string;
    description?: string;
  }>({
    name: "",
    description: undefined,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    createAlbum({
      ...albumData,
    }).then(() => setIsSubmitting(false));
  }

  return (
    <div className="container max-w-md px-6 py-8 mx-auto md:px-8">
      <div className="mb-8">
        <Button variant="outline" size="icon" asChild>
          <Link href="/">
            <ArrowLeft className="w-4 h-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Album</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 px-6">
            <div className="space-y-2">
              <Label htmlFor="name">Album Name</Label>
              <Input 
                id="name" 
                placeholder="Enter album name" 
                value={albumData.name}
                onChange={(e) => setAlbumData({ ...albumData, name: e.target.value })}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea id="description" placeholder="Enter album description" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between px-6 py-4">
            <Button variant="outline" type="button" onClick={() => router.push("/albums")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Album"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
