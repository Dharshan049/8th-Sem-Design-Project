"use client";
import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import translations from "./translations";
import dynamic from 'next/dynamic';
import "./globals.css";

// Dynamically import Lottie with no SSR
const Lottie = dynamic(() => import('lottie-react'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse" />
});

const languages = [
  { label: "English", code: "en" },
  { label: "Tamil", code: "ta" },
];

const LandingPage = () => {
  const router = useRouter();
  const { isSignedIn } = useUser();
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [content, setContent] = useState(translations.en);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
        const savedLanguage = localStorage.getItem("language") || "en";
        setSelectedLanguage(savedLanguage);
        setContent(translations[savedLanguage]);

        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
            setDarkMode(true);
            document.documentElement.classList.add("dark");
        } else {
            setDarkMode(false);
            document.documentElement.classList.remove("dark");
        }
    }

    if (isSignedIn) {
        router.push("/dashboard");
    }
  }, [isSignedIn, router]);

  const handleLanguageChange = (langCode) => {
    if (typeof window !== 'undefined') {
        setSelectedLanguage(langCode);
        setContent(translations[langCode]);
        localStorage.setItem("language", langCode);
    }
  };

  const toggleTheme = () => {
    if (typeof window === 'undefined') return;
    
    setDarkMode((prev) => {
        const newMode = !prev;
        localStorage.setItem("theme", newMode ? "dark" : "light");

        if (newMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }

        return newMode;
    });
  };

  // Don't render anything until mounted
  if (!mounted) {
      return (
          <div className="w-full h-screen flex items-center justify-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 dark:border-white"></div>
          </div>
      );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Dark Mode: Video Background */}
      {darkMode ? (
        <Suspense fallback={<div className="fixed inset-0 bg-gray-900" />}>
          <video
            autoPlay
            loop
            muted
            playsInline
            className="fixed top-0 left-0 w-full h-full object-cover z-[-1] brightness-50"
          >
            <source src="/blackhole.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video>
        </Suspense>
      ) : (
        // Light Mode: Lottie Animation
        <Suspense fallback={<div className="fixed inset-0 bg-gray-100" />}>
          <div className="fixed inset-0 w-screen h-screen -z-10 flex justify-center items-center">
            <Lottie
              animationData={require("@/public/bg1.json")}
              loop
              autoPlay
              className="w-[150vw] h-[150vh] object-cover"
            />
          </div>
        </Suspense>
      )}

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <nav className="p-4 flex justify-end items-center gap-4">
          <div className="flex items-center gap-2">
            <select
              value={selectedLanguage}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="rounded px-3 py-2 bg-transparent text-black shadow-lg dark:hover:bg-gray-800 dark:text-white dark:hover:text-white hover:bg-white hover:text-black"
            >
              {languages.map((lang) => (
                <option
                  key={lang.code}
                  value={lang.code}
                  className="backdrop-blur-lg dark:hover:bg-black dark:hover:text-white hover:bg-white/20"
                >
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
          <Link href="/sign-in">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <div onClick={toggleTheme} className="cursor-pointer">
            <Image
              src={darkMode ? "/sun.svg" : "/moon.svg"}
              width={30}
              height={30}
              alt="theme toggle"
            />
          </div>
        </nav>

        <main className="container mx-auto px-4 pt-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-black dark:text-white">
            {content.title} <br />
            <span className="text-blue-300 dark:text-blue-500">{content.subtitle}</span>
          </h1>

          <p className="mt-6 text-xl text-black dark:text-white max-w-3xl mx-auto">
            {content.description}
          </p>

          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <Link href="/sign-in">
              <Button className="h-12 px-6 text-lg bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
                {content.getStarted}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LandingPage;
