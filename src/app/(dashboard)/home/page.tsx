import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { DashboardComponent } from "@/components/dashboard";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Home - 1MomentGlobal",
  description: "Welcome to 1MomentGlobal",
};

export default async function Home() {

  return <DashboardComponent/>;
}
