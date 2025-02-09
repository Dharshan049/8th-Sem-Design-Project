"use client";

import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { useLanguage } from "@/app/contexts/LanguageContext"; // Import useLanguage
import { useTranslation } from "react-i18next";

function WelcomeBanner() {
  const { user } = useUser();
  const { language } = useLanguage(); // Access current language from LanguageContext
  const { t } = useTranslation();

  const [fullName, setFullName] = useState("Guest");

  useEffect(() => {
    // If user exists, set the full name
    if (user?.fullName) {
      setFullName(user.fullName);
    } else {
      setFullName("Guest");
    }
    // Apply translations when the selected language changes
    applyTranslation(language);
  }, [language, user?.fullName]);

  const applyTranslation = (langCode) => {
    const elements = document.querySelectorAll("[data-translate]");
    elements.forEach((element) => {
      const originalText =
        element.getAttribute("data-translate-original") || element.textContent;

      if (langCode === "en") {
        element.textContent = originalText;
        return;
      }

      const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        originalText
      )}&langpair=en|${langCode}`;

      fetch(apiUrl)
        .then((res) => res.json())
        .then((data) => {
          if (data.responseData?.translatedText) {
            element.textContent = data.responseData.translatedText;
            element.setAttribute("data-translate-original", originalText);
          }
        });
    });
  };

  return (
    <div className="relative group overflow-hidden rounded-lg p-8 bg-gradient-to-r from-[#CAD5FF] via-[#D8CAFF] to-[#F0D5FF] hover:from-[#B7C4FF] hover:via-[#D0BCFF] hover:to-[#F2CDFF] dark:from-[#4B47B3] dark:via-[#635AE5] dark:to-[#8E5AED] dark:hover:from-[#3730A3] dark:hover:via-[#4F46E5] dark:hover:to-[#7C3AED] shadow-md hover:shadow-xl transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-white/10 dark:from-white/10 dark:to-white/5 opacity-100 group-hover:opacity-0 transition-opacity duration-300"></div>
      <div className="relative z-10">
        <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
          {t("Welcome back")}
        </h1>
        <p className="text-gray-800 dark:text-gray-100 max-w-xl font-medium">
          {t("Enjoy your learning journey!")}
        </p>
      </div>
    </div>
  );
}

export default WelcomeBanner;
