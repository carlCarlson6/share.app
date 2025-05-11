import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Header } from "./components";

export default async function AlbumsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  console.log("checking auth on album layout");
  const user = await currentUser();
  if (user === null) {
    return redirect("/join");
  }

  return (
    <div>
      <Header 
        user={{
          id: user.id, 
          name: user.fullName ?? "not-found", 
          email: user.primaryEmailAddress?.emailAddress ?? "not-found",
          profileImageUrl: user.imageUrl,
        }}/>
      {children}
    </div>
  );
}

