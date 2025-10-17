import { Metadata } from "next";
import Hero from "@/components/Hero/page";

export const metadata: Metadata = {
  title: "fleizean — software, design and my life",
  description: "Software engineer and designer passionate about creating elegant solutions. Explore my journey, projects, tech stack, and connect with me for collaboration opportunities.",
  alternates: {
    canonical: '/',
  },
};


export default function Home() {
  return (
    <>      
      <Hero />
    </>
  );
}