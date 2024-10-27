import { Metadata } from "next";

import { DashboardComponent } from "@/components/dashboard";

export const metadata: Metadata = {
  title: "Home - 1MomentGlobal",
  description: "Welcome to 1MomentGlobal",
};

export default function Home() {
  return <DashboardComponent />;
}
