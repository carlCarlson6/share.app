"use client"
import Link from "next/link"
import { LogOut } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@clerk/nextjs"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { albumsTable } from "@/lib/db";

type UserData = {
  id: string,
  name: string,
  email: string,
  profileImageUrl?: string,
}

export function Header({user}: {user: UserData}) {
  return (
    <header className="border-b bg-background">
      <div className="container flex items-center justify-between h-16 px-6 mx-auto md:px-8 lg:px-10">
        <div>
          <Link href="/" className="text-xl font-bold">
            PhotoAlbum
          </Link>
        </div>
        <UserMenu user={user} />
      </div>
    </header>
  )
}

function UserMenu({user}: {user: UserData}) {
  const { signOut } = useAuth();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative w-10 h-10 rounded-full">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user.profileImageUrl} alt="User" />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut({
          redirectUrl: "/join",
        })}>
          <LogOut className="w-4 h-4 mr-2" />
          <span>sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

type Album = typeof albumsTable.$inferSelect

export function AlbumGrid({albums}: {
  albums: (Album & { photosCount: number, coverPhotoContent: Blob | null | undefined })[] 
}) {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {albums.map((album) => (
        <Link href={`/albums/${album.id}`} key={album.id}>
          <Card className="overflow-hidden transition-all hover:shadow-md">
            <CardContent className="p-0">
              <div className="relative aspect-square">
                <img
                  src={album.coverPhotoContent || "/placeholder.jpg"}
                  alt={album.name}
                  className="object-cover"
                />
              </div>
            </CardContent>
            <CardFooter className="p-5">
              <div>
                <h3 className="font-medium">{album.name}</h3>
                <p className="text-sm text-muted-foreground">{album.photosCount} photos</p>
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}

