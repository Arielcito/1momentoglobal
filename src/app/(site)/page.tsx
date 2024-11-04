import type { Metadata } from "next";
import HeroArea from "@/components/HeroArea";
import About from "@/components/About";

export const metadata: Metadata = {
  title: "1MomentGlobal",
  description: "1MomentGlobal is a platform for creating and sharing moments with your friends and family.",
};

export default function Home() {
  return (
    <>
      <HeroArea />
      <About />
    </>
  );
}
