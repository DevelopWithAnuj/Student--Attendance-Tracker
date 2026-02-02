"use client"
import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { menuList } from './SideNav'; // Import menuList from SideNav
import { GraduationCap, Hand, LayoutIcon, SettingsIcon } from 'lucide-react'; // Import icons needed for menuList

function MobileSideNav() {
    const { user } = useKindeBrowserClient();
    const path = usePathname();
    const [open, setOpen] = useState(false); // State to manage popover open/close

    const MenuIcon = ({ icon: IconComponent }) => (
        <IconComponent />
    );

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div className="flex items-center gap-3 cursor-pointer">
                    {user?.picture ? (
                        <Image
                            src={user?.picture}
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
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-screen-md p-0 m-0 border-none bg-background shadow-none">
                <div className="h-screen p-5 w-60 relative">
                    <Image
                        src={"/logo1.svg"}
                        alt="Logo"
                        width={150}
                        height={50}
                        className="w-[150px] h-[50px]"
                        priority
                    />

                    <hr className="my-5 border-1 border-gray-300" />

                    {menuList.map((menu) => (
                        <Link href={menu.path} key={menu.id} onClick={() => setOpen(false)}> {/* Close popover on menu item click */}
                            <h2
                                className={`flex items-center
                                         gap-3 text-foreground text-md
                                         p-4 cursor-pointer 
                                         hover:bg-primary
                                         hover:text-primary-foreground
                                         rounded-md my-2
                                         ${path == menu.path && "bg-primary text-primary-foreground"}`}
                            >
                                <MenuIcon icon={menu.icon} />
                                {menu.name}
                            </h2>
                        </Link>
                    ))}

                    <div className="absolute bottom-10 left-0 w-full p-5 flex items-center gap-3">
                        {user?.picture ? (
                            <Image
                                src={user?.picture || "/default-avatar.png"}
                                alt="Profile"
                                width={35}
                                height={35}
                                className="rounded-full"
                            />
                        ) : null}
                        <div>
                            <h2 className="text-sm font-semibold">
                                {user?.given_name} {user?.family_name}
                            </h2>
                            <h2 className="text-xs text-muted-foreground">{user?.email}</h2>
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}

export default MobileSideNav;
