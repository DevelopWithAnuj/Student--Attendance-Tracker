"use client";
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import Image from 'next/image';
import React from 'react';

const Header = () => {
  const { user } = useKindeBrowserClient();
  return (
    <div className='p-4 shadow-sm border-b flex justify-end items-center gap-3'>
      <div>

      </div>
      <div>
      {user?.picture ? (
      <Image
          src={user?.picture || "/default-avatar.png"}
          alt="Profile"
          width={35} height={35}
          className='rounded-full'
      />
      ) : null}
      </div>
    </div>
  );
};

export default Header;
