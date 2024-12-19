import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import TweetAnalysis from "@/components/TweetAnalysis";
import PoweredBy from "@/components/PoweredBy";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <>
      <div>
        <TweetAnalysis />
      </div>
      <footer><PoweredBy /></footer>
    </>
  );
}
