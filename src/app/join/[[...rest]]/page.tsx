import { SignIn } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AuthPage() {
  console.info("AuthPage");
  const user = await currentUser();
  if (user !== null) {
    console.info("AuthPage: user is logged in - redirecting to /");
    return redirect("/");
  }
  return (
    <div className="flex flex-col items-center justify-center h-screen space-4">
      <h1 className="text-4xl font-bold mb-4">wellcome :3</h1>
      <SignIn/>
    </div>
  );  
}