"use client";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import Image from "next/image";
import React from "react";

const Header = () => {
  const { user, logout } = useKindeBrowserClient();
  return (
    <div
      className="p-4 shadow-sm border-b flex justify-between items-center "
    >
      <div className="text-xl font-bold text-foreground">
        Student Attendance Tracker
      </div>
      <div className="flex items-center gap-4">
        {user && (
          <>
            <div className="text-right hidden md:block">
              <p className="text-sm font-medium text-foreground">
                Welcome, {user.given_name || user.family_name || "User"}
              </p>
              <p className="text-xs text-foreground">{user.email}</p>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-destructive-foreground rounded-lg transition-colors duration-200"
            >
              Logout
            </button>
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
      </div>
    </div>
  );
};

export default Header;
