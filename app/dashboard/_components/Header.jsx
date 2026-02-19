"use client";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import Image from "next/image";
import React, { useState, useEffect } from "react"; // Added useState, useEffect
import MobileSideNav from "./MobileSideNav"; // Imported MobileSideNav
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import NotificationBell from "./NotificationBell";

const Header = () => {
  const { user, logout } = useKindeBrowserClient();
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind's 'md' breakpoint is 768px
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      className="p-4 shadow-sm border-b flex justify-between items-center "
    >
      <div className="text-xl font-bold text-foreground">
        Student Attendance Tracker
      </div>
      <div className="flex items-center gap-4">
        
        <NotificationBell />
        {isClient && isMobile ? ( // Render MobileSideNav on mobile
          <MobileSideNav user={user} />
        ) : ( // Render existing user info on desktop
          <>
            {user && (
              <>
                <div className="text-right hidden md:block">
                  <p className="text-sm font-medium text-foreground">
                    Welcome, {user.given_name || user.family_name || "User"}
                  </p>
                  <p className="text-xs text-foreground">{user.email}</p>
                </div>
                <LogoutLink
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-destructive-foreground rounded-lg transition-colors duration-200"
                >
                  Logout
                </LogoutLink>
              </>
            )}
            {user?.picture ? (
              <Image
                src={user.picture}
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full border-2 border-gray-200"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-semibold">
                  {user?.given_name?.[0] || user?.email?.[0]?.toUpperCase() || "U"}
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
