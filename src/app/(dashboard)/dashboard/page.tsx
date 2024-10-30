import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions, getSelf } from "@/lib/auth";
import { DashboardComponent } from "@/components/dashboard";
import { redirect } from "next/navigation";
import { StreamComponent } from "@/components/StreamComponent";
import { userService } from "@/lib/user-service";

export const metadata: Metadata = {
  title: "Home - 1MomentGlobal",
  description: "Welcome to 1MomentGlobal",
};

export default async function Home() {
  const user = await getSelf();
  
  if (!user) {
    return null;
  }

  const stream = await userService.getUserStream(user.id);

  if (!stream) {
    return null;
  }

  return <StreamComponent user={user} stream={stream} />;
}
