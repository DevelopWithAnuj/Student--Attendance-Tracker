"use client";
import React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Moon, Sun, User, Settings as SettingsIcon } from "lucide-react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import Image from "next/image";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { user } = useKindeBrowserClient();

  return (
    <div className="p-10">
      <div className="flex items-center gap-3 mb-8">
        <SettingsIcon className="h-8 w-8 text-foreground" />
        <h2 className="text-3xl font-bold text-foreground">Settings</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Theme Settings */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Sun className="h-5 w-5" />
            Theme Settings
          </h3>
          <p className="text-muted-foreground mb-4">Choose your preferred theme for the application.</p>
          <div className="flex gap-3">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              onClick={() => setTheme("light")}
              className="flex items-center gap-2"
            >
              <Sun className="h-4 w-4" />
              Light
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              onClick={() => setTheme("dark")}
              className="flex items-center gap-2"
            >
              <Moon className="h-4 w-4" />
              Dark
            </Button>
            <Button
              variant={theme === "system" ? "default" : "outline"}
              onClick={() => setTheme("system")}
              className="flex items-center gap-2"
            >
              <SettingsIcon className="h-4 w-4" />
              System
            </Button>
          </div>
        </Card>

        {/* User Profile */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <User className="h-5 w-5" />
            User Profile
          </h3>
          {user && (
            <div className="flex items-center gap-4">
              {user.picture ? (
                <Image
                  src={user.picture}
                  alt="Profile"
                  width={60}
                  height={60}
                  className="rounded-full border-2 border-border"
                />
              ) : (
                <div className="w-15 h-15 bg-muted rounded-full flex items-center justify-center">
                  <span className="text-muted-foreground font-semibold text-lg">
                    {user.given_name?.[0] || user.email?.[0]?.toUpperCase() || "U"}
                  </span>
                </div>
              )}
              <div>
                <h4 className="font-semibold text-lg">
                  {user.given_name} {user.family_name}
                </h4>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>
          )}
        </Card>

        {/* App Information */}
        <Card className="p-6 md:col-span-2">
          <h3 className="text-xl font-semibold mb-4">Application Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <h4 className="font-semibold text-lg">Version</h4>
              <p className="text-muted-foreground">1.0.0</p>
            </div>
            <div>
              <h4 className="font-semibold text-lg">Last Updated</h4>
              <p className="text-gray-600">February 2026</p>
            </div>
            <div>
              <h4 className="font-semibold text-lg">Developer</h4>
              <p className="text-gray-600">Student Attendance Tracker Team</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
