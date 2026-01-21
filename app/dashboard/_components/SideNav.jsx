"use client"
import React, { useEffect } from 'react';
import Image from "next/image";
import Link from 'next/link';
import { GraduationCap, Hand, LayoutIcon, SettingsIcon } from 'lucide-react';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { usePathname } from 'next/navigation';

function SideNav() { 
    const { user } = useKindeBrowserClient();
    const menuList = [
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
    ];

    const path = usePathname();
    useEffect(() => {
        console.log("Current path:", path);
    }, [path]);
    return (
        <div className='border shadow-md h-screen p-5'>
            <Image src={"/logo.svg"}
                alt="Logo"
                width={150} height={50}
            />

            <hr className='my-5' />

            {menuList.map((menu) => (
                <Link href={menu.path} key={menu.id}>
                    <h2
                        className={`flex items-center
                         gap-3 text-gray-600 text-md
                         p-4 cursor-pointer 
                         hover:bg-primary
                         hover:text-white
                         rounded-md my-2
                         ${path==menu.path && 'bg-primary text-white'}`}
                    >
                        <menu.icon />
                        {menu.name}
                    </h2>
                </Link>
            ))}

            <div className='absolute bottom-10 left-0 w-full p-5 flex items-center gap-3'>
                {user?.picture ? (
                    <Image
                        src={user?.picture || "/default-avatar.png"}
                        alt="Profile"
                        width={35} height={35}
                        className='rounded-full'
                    />
                ) : null}
                <div>
                    <h2 className='text-sm font-semibold'>
                        {user?.given_name} {user?.family_name}
                    </h2>
                    <h2 className='text-xs text-gray-500'>
                        {user?.email}
                    </h2>
                </div>
            </div>
        </div>
    );
};

export default SideNav;
