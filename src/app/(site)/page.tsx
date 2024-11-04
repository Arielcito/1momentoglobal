import type { Metadata } from "next";
import HeroArea from "@/components/HeroArea";
import Features from "@/components/Features";
import About from "@/components/About";
import WorkProcess from "@/components/WorkProcess";
import Pricing from "@/components/Pricing";
import Screens from "@/components/Screens";
import Cta from "@/components/Cta";
import Testimonials from "@/components/Testimonials";
import Faq from "@/components/Faq";
import Clients from "@/components/Clients";
import Contact from "@/components/Contact";

export const metadata: Metadata = {
  title: "Appline - Next.js App & Software Template and Starter Kit",
  description: "Website template and starter kit crafted to build fully functional mobile app landing pages and software websites",
};

export default function Home() {
  return (
    <>
      <HeroArea />
    </>
  );
}
