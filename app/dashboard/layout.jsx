"use client";
import React, { useState } from "react";
import SideBar from "./_components/SideBar";
import DashBoardHeader from "./_components/DashBoardHeader";
import { CourseCountContext } from "../_context/CourseCountContext";
import { LanguageProvider } from "@/app/contexts/LanguageContext"; // Import the LanguageProvider
import Chatbot from "./_components/Chatbot";

function DashboardLayout({ children }) {
  const [totalCourses, setTotalCourses] = useState(0);

  return (
    <LanguageProvider>
      {/* Wrap both contexts */}
      <CourseCountContext.Provider value={{ totalCourses, setTotalCourses }}>
        <div>
          <div className="md:w-64 hidden md:block fixed">
            <SideBar />
          </div>
          <div className="md:ml-64">
            <div className="p-10">{children}</div>
          </div>
          <Chatbot />
        </div>
      </CourseCountContext.Provider>
    </LanguageProvider>
  );
}

export default DashboardLayout;
