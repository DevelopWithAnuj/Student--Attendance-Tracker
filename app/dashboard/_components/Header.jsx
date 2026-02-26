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
      className="p-4 px-8 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex justify-between items-center sticky top-0 z-50 shadow-sm"
    >
      <div className="flex items-center gap-4">
        {isClient && isMobile && <MobileSideNav user={user} />}
        <div className="hidden md:block">
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Platform</h2>
          <p className="text-xs font-bold text-slate-900 dark:text-white underline decoration-primary/30 underline-offset-4">Attendance AI Management Console</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 pr-6 border-r border-slate-100 dark:border-slate-800">
           <NotificationBell />
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden lg:block text-right">
            <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tighter">
              {user?.given_name || "Administrator"}
            </p>
            <p className="text-[10px] text-slate-400 font-bold tracking-tight">{user?.email}</p>
          </div>

          <div className="relative group hidden lg:block">
            {user?.picture ? (
              <Image
                src={user.picture}
                alt="Profile"
                width={38}
                height={38}
                className="rounded-xl border-2 border-white dark:border-slate-900 shadow-lg group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 shadow-inner group-hover:scale-105 transition-transform">
                <span className="text-primary font-black text-xs uppercase">
                  {user?.given_name?.[0] || "U"}
                </span>
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 bg-emerald-500 border-2 border-white dark:border-slate-950 rounded-full shadow-sm" />
          </div>

          <LogoutLink
            className="hidden lg:flex items-center h-10 px-5 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-900/20 dark:hover:bg-rose-900/30 dark:text-rose-400 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 border border-rose-100 dark:border-rose-900/30"
          >
            Sign Out
          </LogoutLink>
        </div>
      </div>
    </div>
  );
};

export default Header;
