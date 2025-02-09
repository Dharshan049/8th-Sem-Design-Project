"use client";

import { useContext, useState, useEffect } from "react";
import { CourseCountContext } from "@/app/_context/CourseCountContext";
import { Button } from "@/components/ui/button";
import { Columns, ArrowUpCircle, Rocket, TrendingUp } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useLanguage } from "@/app/contexts/LanguageContext"; // Import custom hook for language
import { useUser } from '@clerk/nextjs';
import { UserButton } from '@clerk/nextjs';
import axios from 'axios';

const languages = [
  { label: "English", code: "en" },
  { label: "Tamil", code: "ta" },
  { label: "Malayalam", code: "ml" },
  // Add more languages here
];

function Sidebar() {
  const { totalCourses } = useContext(CourseCountContext);
  const { language, changeLanguage } = useLanguage(); // Access current language and change function
  const path = usePathname();
  const [darkMode, setDarkMode] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    setDarkMode(savedTheme === "dark");
    document.documentElement.classList.toggle("dark", savedTheme === "dark");

    // Fetch user role when component mounts
    if (user?.primaryEmailAddress?.emailAddress) {
      getUserRole();
    }
  }, [user]);

  const getUserRole = async () => {
    try {
      const response = await axios.post('/api/get-user-role', {
        email: user?.primaryEmailAddress?.emailAddress
      });
      setUserRole(response.data.role);
    } catch (error) {
      console.error('Error getting user role:', error);
    }
  };

  const toggleTheme = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("theme", newMode ? "dark" : "light");
      document.documentElement.classList.toggle("dark", newMode);
      return newMode;
    });
  };

  const availableCredits = 5 - totalCourses;

  const t = {
    en: {
      logoTitle: "INTELLISTUDY",
      createNew: "Create New",
      Dashboard: "Course Hub",
      Upgrade: "Subscribe",
      availableCredits: "Available Credits",
      usedCredits: "Used Credits",
      upgradeHint: "Upgrade your plan for more courses",
      languageLabel: "Select Language",
    },
    ta: {
      logoTitle: "டாஷ்போர்ட்",
      createNew: "புதியது உருவாக்கவும்",
      Dashboard: "டாஷ்போர்ட்",
      Upgrade: "பரிமாற்றம்",
      availableCredits: "கிடைக்கும் கிரெடிட்கள்",
      usedCredits: "பயன்படுத்தப்பட்ட கிரெடிட்கள்",
      upgradeHint: "மேலும் பாடங்களுக்கு உங்கள் திட்டத்தை மேம்படுத்தவும்",
      languageLabel: "மொழி தேர்ந்தெடுக்கவும்",
    },
    ml: {
      logoTitle: "ഡാഷ്ബോർഡ്",
      createNew: "പുതിയതായി സൃഷ്‌ടിക്കുക",
      Dashboard: "ഡാഷ്ബോർഡ്",
      Upgrade: "അപ്ഗ്രേഡ്",
      availableCredits: "ലഭിക്കുന്ന ക്രെഡിറ്റുകൾ",
      usedCredits: "ഉപയോഗിച്ച ക്രെഡിറ്റുകൾ",
      upgradeHint: "കൂടുതൽ കോഴ്‌സുകൾക്കായി നിങ്ങളുടെ പ്ലാൻ അപ്ഗ്രേഡ് ചെയ്യുക",
      languageLabel: "ഭാഷ തിരഞ്ഞെടുക്കുക",
    },
  };

  const selectedTranslations = t[language] || t.en; // Use language-specific translations

  return (
    <div className="h-screen shadow-md p-4 bg-white dark:bg-gray-900 dark:text-white relative">
      {/* Logo and Title */}
      <div className="flex gap-2 items-center">
        <Image src="/logo.png" alt="logo" width={40} height={40} />
        <h2 className="font-bold text-2xl">{selectedTranslations.logoTitle}</h2>
      </div>

      {/* User Profile Section */}
      <div className="mt-8 flex flex-col items-center">
        <div className="relative group overflow-hidden pt-8 pb-2 ">
          <span className="absolute inset-0 bg-white/30 dark:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          <div className="flex flex-col items-center gap-4 relative z-10">
            <div className="scale-[2.0] -mt-1">
              <UserButton />
            </div>
            <h3 className="text-lg font-semibold text-center text-gray-900 dark:text-white">{user?.fullName || "Guest"}</h3>
          </div>
        </div>
      </div>

      {/* Menu Links */}
      <div className="mt-3">
        <div className="grid grid-cols-2 gap-4">
          {[
            { name: "Dashboard", path: "/dashboard", icon: Columns  },
            { name: "Upgrade", path: "/dashboard/upgrade", icon: ArrowUpCircle }
          ].map((menu, index) => (
            <Link href={menu.path} key={index}>
              <div
                className={`relative group overflow-hidden flex flex-col items-center p-4 rounded-md transition-all duration-300 ${
                  path === menu.path 
                  ? "bg-gradient-to-r from-[#CAD5FF] via-[#D8CAFF] to-[#F0D5FF] dark:from-[#4B47B3] dark:via-[#635AE5] dark:to-[#8E5AED] text-gray-900 dark:text-white" 
                  : "hover:bg-gradient-to-r hover:from-[#CAD5FF] hover:via-[#D8CAFF] hover:to-[#F0D5FF] dark:hover:from-[#4B47B3] dark:hover:via-[#635AE5] dark:hover:to-[#8E5AED] text-gray-700 dark:text-gray-200"
                }`}
              >
                <span className="absolute inset-0 bg-white/30 dark:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <menu.icon size={24} className="mb-2 relative z-10" />
                <h2 className="text-sm relative z-10">{selectedTranslations[menu.name]}</h2>
              </div>
            </Link>
          ))}
        </div>

        {/* Language Dropdown */}
        <div className="mt-5">
          <label className="text-sm font-semibold text-gray-900 dark:text-white">{selectedTranslations.languageLabel}</label>
          <select
            value={language}
            onChange={(e) => changeLanguage(e.target.value)}
            className={`w-full mt-2 p-2 rounded-md bg-gradient-to-r from-[#CAD5FF]/50 via-[#D8CAFF]/50 to-[#F0D5FF]/50 dark:from-[#2C2C6D] dark:via-[#3B3B8F] dark:to-[#4F4F99] text-gray-900 dark:text-white border border-[#D8CAFF] dark:border-[#635AE5] focus:border-[#B7C4FF] dark:focus:border-[#4F46E5] focus:ring-2 focus:ring-[#D8CAFF] dark:focus:ring-[#635AE5] transition-all duration-300`}
          >
            {languages.map((lang) => (
              <option 
                key={lang.code} 
                value={lang.code}
                className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                {lang.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Credits Section */}
      <div className="mt-5">
        <div className="relative group overflow-hidden border p-3 bg-gradient-to-r from-[#CAD5FF] via-[#D8CAFF] to-[#F0D5FF] dark:from-[#4B47B3] dark:via-[#635AE5] dark:to-[#8E5AED] text-gray-900 dark:text-white rounded-md shadow-sm hover:shadow-md transition-all duration-300">
          <div className="absolute inset-0 bg-white/30 dark:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <h2 className="text-lg mb-2">
              {selectedTranslations.availableCredits}: {availableCredits}
            </h2>
            <div className="relative w-full h-2 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-black/50 dark:bg-white/50 transition-all duration-300"
                style={{
                  width: `${(totalCourses / 5) * 100}%`,
                }}
              ></div>
            </div>
            <h2 className="text-sm mt-2">
              {selectedTranslations.usedCredits}: {totalCourses} / 5
            </h2>
            <Link
              href="/dashboard/upgrade"
              className="text-gray-800 dark:text-gray-100 text-xs mt-3 block hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              title={selectedTranslations.upgradeHint}
            >
              {selectedTranslations.upgradeHint}
            </Link>
          </div>
        </div>

        {/* Admin Button - Only show for admin/metaadmin */}
        {(userRole === 'admin' || userRole === 'metaadmin') && (
          <div className="mt-3 mb-4">
            <Link href="/admin">
              <Button 
                className="relative group overflow-hidden w-full bg-gradient-to-r from-[#CAD5FF] via-[#D8CAFF] to-[#F0D5FF] hover:from-[#B7C4FF] hover:via-[#D0BCFF] hover:to-[#F2CDFF] dark:from-[#4B47B3] dark:via-[#635AE5] dark:to-[#8E5AED] dark:hover:from-[#3730A3] dark:hover:via-[#4F46E5] dark:hover:to-[#7C3AED] text-gray-900 dark:text-white hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <span className="absolute inset-0 bg-white/30 dark:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative">Admin Dashboard</span>
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Dark Mode Toggle */}
      <div className="mt-4 flex justify-center items-center">
        <div className="bg-gradient-to-r from-[#CAD5FF]/50 via-[#D8CAFF]/50 to-[#F0D5FF]/50 dark:from-[#4B47B3]/30 dark:via-[#635AE5]/30 dark:to-[#8E5AED]/30 rounded-full p-1 flex w-48">
          <button
            onClick={toggleTheme}
            className={`flex items-center justify-center gap-2 py-2 px-4 rounded-full transition-all duration-300 w-24
              ${!darkMode 
                ? 'bg-gradient-to-r from-[#CAD5FF] via-[#D8CAFF] to-[#F0D5FF] text-gray-900 shadow-md' 
                : 'text-gray-600 hover:text-gray-900'}`}
          >
            <Image src="/sun.svg" width={16} height={16} alt="sun icon" />
            Light
          </button>
          <button
            onClick={toggleTheme}
            className={`flex items-center justify-center gap-2 py-2 px-4 rounded-full transition-all duration-300 w-24
              ${darkMode 
                ? 'bg-gradient-to-r dark:from-[#4B47B3] dark:via-[#635AE5] dark:to-[#8E5AED] text-white shadow-md' 
                : 'text-gray-600 hover:text-gray-800'}`}
          >
            <Image src="/moon.svg" width={16} height={16} alt="moon icon" />
            Dark
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
