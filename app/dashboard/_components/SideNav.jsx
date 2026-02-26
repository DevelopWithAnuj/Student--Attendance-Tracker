"use client"
import React, { useEffect } from 'react';
import Image from "next/image";
import Link from 'next/link';
import { GraduationCap, Hand, LayoutIcon, SettingsIcon, LayoutListIcon } from 'lucide-react';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { usePathname } from 'next/navigation';

export const menuList = [
    {
        id: 1,
        name: 'Dashboard',
        icon: LayoutIcon,
        path: '/dashboard'
    },
    {
        id: 2,
        name: 'Students',
        icon: GraduationCap,
        path: '/dashboard/students'
    },
    {
        id: 3,
        name: 'Attendance',
        icon: Hand,
        path: '/dashboard/attendance'
    },
    {
        id: 4,
        name: 'Settings',
        icon: SettingsIcon,
        path: '/dashboard/settings'
    },
    {
        id: 5,
        name: 'Management',
        icon: LayoutListIcon,
        path: '/dashboard/management'
    },
];

function SideNav() { 
    const { user } = useKindeBrowserClient();
    const path = usePathname();

    return (
      <div className="border-r border-slate-200 dark:border-slate-800 shadow-sm h-screen p-6 w-64 flex flex-col bg-white dark:bg-slate-950">
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="bg-primary/10 p-2 rounded-xl">
             <Image
                src={"/logo.svg"} // Using original logo as fallback or logo.svg
                alt="Logo"
                width={32}
                height={32}
                className="w-8 h-8"
                priority
              />
          </div>
          <h1 className="font-black text-lg tracking-tight text-slate-900 dark:text-white">Attendance <span className="text-primary font-black">AI</span></h1>
        </div>

        <div className="flex-1 space-y-1">
          <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Main Menu</p>
          {menuList.map((menu) => (
            <Link href={menu.path} key={menu.id}>
              <div
                className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer rounded-2xl transition-all duration-300 group
                           ${path === menu.path 
                             ? "bg-primary text-white shadow-lg shadow-primary/20 font-bold" 
                             : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 font-bold hover:text-slate-900 dark:hover:text-white"
                           }`}
              >
                <menu.icon className={`h-5 w-5 transition-transform duration-300 group-hover:scale-110 ${path === menu.path ? "text-white" : "text-slate-400 dark:text-slate-500"}`} />
                <span className="text-sm tracking-wide">{menu.name}</span>
                {path === menu.path && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4 p-2 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
            <div className="relative">
              {user?.picture ? (
                <Image
                  src={user.picture}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="rounded-xl border border-white dark:border-slate-950 shadow-sm"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-black text-primary text-xs">
                  {user?.given_name?.[0] || "U"}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-950 rounded-full" />
            </div>
            <div className="overflow-hidden">
              <h2 className="text-xs font-black text-slate-900 dark:text-white truncate uppercase tracking-tighter">
                {user?.given_name} {user?.family_name}
              </h2>
              <p className="text-[10px] text-slate-400 font-bold truncate tracking-tight">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
    );
};

export default SideNav;
