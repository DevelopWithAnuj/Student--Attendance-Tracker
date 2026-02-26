"use client"
import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/components';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { menuList } from './SideNav'; // Import menuList from SideNav
import { GraduationCap, Hand, LayoutIcon, SettingsIcon, LogOut } from 'lucide-react'; // Import icons needed for menuList

function MobileSideNav({ user }) {
    const path = usePathname();
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                        {user?.picture ? (
                            <Image
                                src={user?.picture}
                                alt="Profile"
                                width={36}
                                height={36}
                                className="rounded-xl border-2 border-white dark:border-slate-900 shadow-md group-hover:scale-105 transition-transform"
                            />
                        ) : (
                            <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 shadow-inner">
                                <span className="text-primary font-black text-xs uppercase">
                                    {user?.given_name?.[0] || "U"}
                                </span>
                            </div>
                        )}
                        <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 bg-emerald-500 border-2 border-white dark:border-slate-950 rounded-full" />
                    </div>
                </div>
            </PopoverTrigger>
            <PopoverContent side="bottom" align="start" className="w-[280px] p-0 rounded-3xl border-none shadow-2xl overflow-hidden mt-2 bg-white dark:bg-slate-950">
                <div className="p-6 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-primary/10 p-1.5 rounded-lg">
                            <Image src="/logo.svg" alt="Logo" width={24} height={24} className="w-6 h-6" />
                        </div>
                        <h1 className="font-black text-sm tracking-tight text-slate-900 dark:text-white uppercase tracking-widest">Navigation</h1>
                    </div>
                </div>

                <div className="p-4 space-y-1">
                    {menuList.map((menu) => (
                        <Link href={menu.path} key={menu.id} onClick={() => setOpen(false)}>
                            <div
                                className={`flex items-center gap-3 px-4 py-3 cursor-pointer rounded-2xl transition-all duration-300
                                         ${path === menu.path 
                                           ? "bg-primary text-white shadow-lg shadow-primary/20 font-bold" 
                                           : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 font-bold"
                                         }`}
                            >
                                <menu.icon className={`h-5 w-5 ${path === menu.path ? "text-white" : "text-slate-400"}`} />
                                <span className="text-sm tracking-wide">{menu.name}</span>
                            </div>
                        </Link>
                    ))}
                    
                    {user && (
                        <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                            <LogoutLink
                                onClick={() => setOpen(false)}
                                className="w-full flex items-center gap-3 px-4 py-3 text-rose-600 dark:text-rose-400 font-black text-sm uppercase tracking-widest hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-2xl transition-all"
                            >
                                <LogOut className="h-5 w-5" />
                                Sign Out
                            </LogoutLink>
                        </div>
                    )}
                </div>

                <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-center font-black text-primary text-xs">
                            {user?.given_name?.[0] || "U"}
                        </div>
                        <div className="overflow-hidden">
                            <h2 className="text-xs font-black text-slate-900 dark:text-white truncate uppercase tracking-tighter">
                                {user?.given_name} {user?.family_name}
                            </h2>
                            <p className="text-[10px] text-slate-400 font-bold truncate tracking-tight">{user?.email}</p>
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}

export default MobileSideNav;
