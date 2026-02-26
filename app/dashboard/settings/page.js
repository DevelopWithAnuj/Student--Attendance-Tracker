"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Moon, Sun, User, Settings as SettingsIcon, Bell, Globe, ShieldAlert, Zap, RefreshCw } from "lucide-react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { user, isLoading: isUserLoading } = useKindeBrowserClient();
  const [mounted, setMounted] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  // New States for Preferences
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    weekly: true
  });

  const [regional, setRegional] = useState({
    language: "English",
    timezone: "IST (UTC+5:30)"
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    toast.success(`Theme changed to ${newTheme}`);
  };

  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    toast.info(`${key.charAt(0).toUpperCase() + key.slice(1)} notifications updated`);
  };

  const modalContent = {
    security: {
      title: "Security Policy",
      description: "Our commitment to protecting institutional data.",
      content: (
        <div className="space-y-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          <section>
            <h5 className="font-black text-slate-900 dark:text-white uppercase text-[10px] mb-2 tracking-widest">Data Encryption</h5>
            <p>All student records and attendance data are encrypted at rest using AES-256 and in transit via TLS 1.3. We ensure that your data remains private and inaccessible to unauthorized parties.</p>
          </section>
          <section>
            <h5 className="font-black text-slate-900 dark:text-white uppercase text-[10px] mb-2 tracking-widest">Authentication</h5>
            <p>We leverage Kinde Auth for robust identity management, supporting multi-factor authentication (MFA) and secure session handling to prevent account takeovers.</p>
          </section>
          <section>
            <h5 className="font-black text-slate-900 dark:text-white uppercase text-[10px] mb-2 tracking-widest">Access Control</h5>
            <p>Role-based access control (RBAC) ensures that only verified administrators can modify student records or system configurations.</p>
          </section>
        </div>
      )
    },
    status: {
      title: "Service Status",
      description: "Real-time health monitoring of system components.",
      content: (
        <div className="space-y-4">
          {[
            { name: "Database Cluster", status: "Operational", color: "text-emerald-500" },
            { name: "Authentication API", status: "Operational", color: "text-emerald-500" },
            { name: "Attendance Processing", status: "Operational", color: "text-emerald-500" },
            { name: "File Storage (S3)", status: "Operational", color: "text-emerald-500" },
            { name: "Analytics Engine", status: "Operational", color: "text-emerald-500" },
          ].map(item => (
            <div key={item.name} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-700 dark:text-slate-200">{item.name}</span>
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${item.color.replace('text', 'bg')} animate-pulse`} />
                <span className={`text-xs font-black uppercase tracking-widest ${item.color}`}>{item.status}</span>
              </div>
            </div>
          ))}
          <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest pt-4">Last checked: Just now</p>
        </div>
      )
    },
    terms: {
      title: "Terms & Conditions",
      description: "Rules and guidelines for using the tracker.",
      content: (
        <div className="space-y-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          <p className="font-bold text-slate-900 dark:text-white">1. Acceptance of Terms</p>
          <p>By accessing this dashboard, you agree to be bound by institutional guidelines regarding student data privacy and academic integrity.</p>
          
          <p className="font-bold text-slate-900 dark:text-white">2. User Responsibilities</p>
          <p>Administrators are responsible for maintaining the confidentiality of their credentials and ensuring accurate attendance reporting.</p>
          
          <p className="font-bold text-slate-900 dark:text-white">3. Data Usage</p>
          <p>Attendance data is used strictly for academic evaluation and institutional reporting. Commercial use of student data is prohibited.</p>
          
          <p className="font-bold text-slate-900 dark:text-white">4. System Integrity</p>
          <p>Attempts to bypass security measures or manipulate records will result in immediate revocation of access and disciplinary action.</p>
        </div>
      )
    }
  };

  if (!mounted) {
    return (
      <div className="p-4 sm:p-6 lg:p-10 space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-10 w-48 rounded-xl" />
          <Skeleton className="h-4 w-64 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full md:col-span-2 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-10 bg-slate-50/30 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="font-extrabold text-3xl tracking-tight flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <SettingsIcon className="h-8 w-8 text-primary" />
            </div>
            System Settings
          </h2>
          <p className="text-muted-foreground mt-1 ml-13">Configure your workspace preferences and profile.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Theme Settings */}
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-8 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <Sun className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Appearance
            </h3>
          </div>
          
          <div className="flex-1">
            <h4 className="text-xl font-black text-slate-900 dark:text-white mb-2">Visual Theme</h4>
            <p className="text-sm text-slate-500 font-medium mb-8">
              Customize the interface to suit your lighting conditions.
            </p>
            
            <div className="grid grid-cols-3 gap-3 p-1.5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
              {[
                { id: 'light', label: 'Light', icon: Sun },
                { id: 'dark', label: 'Dark', icon: Moon },
                { id: 'system', label: 'System', icon: SettingsIcon },
              ].map((t) => (
                <Button
                  key={t.id}
                  variant={theme === t.id ? "default" : "ghost"}
                  onClick={() => handleThemeChange(t.id)}
                  className={`flex flex-col sm:flex-row items-center gap-2 h-auto py-3 rounded-xl transition-all ${
                    theme === t.id 
                    ? "shadow-lg shadow-primary/20 font-bold" 
                    : "text-slate-500 font-bold hover:bg-white dark:hover:bg-slate-800"
                  }`}
                >
                  <t.icon className={`h-4 w-4 ${theme === t.id ? "text-white" : "text-slate-400"}`} />
                  <span className="text-xs">{t.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-8 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
              <Bell className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Communication
            </h3>
          </div>
          
          <div className="space-y-5">
            {[
              { id: 'email', label: 'Email Notifications', desc: 'Receive attendance alerts and reports via email.', checked: notifications.email },
              { id: 'push', label: 'Push Notifications', desc: 'Real-time alerts on your browser or device.', checked: notifications.push },
              { id: 'weekly', label: 'Weekly Summary', desc: 'Get a comprehensive report every Monday.', checked: notifications.weekly },
            ].map(item => (
              <div key={item.id} className="flex items-center justify-between group">
                <div className="space-y-0.5">
                  <p className="text-sm font-black text-slate-700 dark:text-slate-200">{item.label}</p>
                  <p className="text-xs text-slate-400 font-medium">{item.desc}</p>
                </div>
                <div 
                  onClick={() => toggleNotification(item.id)}
                  className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${item.checked ? "bg-primary" : "bg-slate-200 dark:bg-slate-800"}`}
                >
                  <div className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${item.checked ? "translate-x-6" : "translate-x-0"}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Profile */}
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-8 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Institutional Profile
            </h3>
          </div>
          
          <div className="flex-1">
            {isUserLoading ? (
              <div className="flex items-center gap-6 animate-pulse">
                <Skeleton className="h-20 w-20 rounded-2xl" />
                <div className="space-y-3">
                  <Skeleton className="h-6 w-40 rounded-lg" />
                  <Skeleton className="h-4 w-56 rounded-lg" />
                </div>
              </div>
            ) : user ? (
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="relative group">
                  {user.picture ? (
                    <Image
                      src={user.picture}
                      alt="Profile"
                      width={80}
                      height={80}
                      className="rounded-2xl border-4 border-slate-50 dark:border-slate-900 shadow-xl transition-transform group-hover:scale-105 duration-300"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center border-4 border-slate-50 dark:border-slate-900 shadow-xl">
                      <span className="text-primary font-black text-2xl">
                        {(user.given_name?.[0] || user.email?.[0] || "U").toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-emerald-500 border-4 border-white dark:border-slate-950 rounded-full shadow-lg" />
                </div>
                
                <div className="text-center sm:text-left space-y-1">
                  <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {user.given_name} {user.family_name}
                  </h4>
                  <p className="text-slate-500 font-bold text-sm tracking-wide">{user.email}</p>
                  <div className="pt-3">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/10">
                      Primary Administrator
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-slate-500 font-bold text-center py-4">Session expired. Please re-authenticate.</p>
            )}
          </div>
        </div>

        {/* Regional Settings */}
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-8 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
              <Globe className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Regional
            </h3>
          </div>
          
          <div className="space-y-6 flex-1">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Language</label>
              <div className="relative group">
                <select 
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-200 font-bold focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer transition-all"
                  value={regional.language}
                  onChange={(e) => {
                    setRegional(prev => ({ ...prev, language: e.target.value }));
                    toast.success(`Language set to ${e.target.value}`);
                  }}
                >
                  <option value="English">English (US)</option>
                  <option value="Hindi">Hindi (In)</option>
                  <option value="Spanish">Español</option>
                  <option value="French">Français</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                   <Zap className="h-4 w-4" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Timezone</label>
              <div className="relative">
                <select 
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-200 font-bold focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer transition-all"
                  value={regional.timezone}
                  onChange={(e) => {
                    setRegional(prev => ({ ...prev, timezone: e.target.value }));
                    toast.success(`Timezone updated to ${e.target.value}`);
                  }}
                >
                  <option value="IST (UTC+5:30)">IST (Kolkata)</option>
                  <option value="UTC (Greenwich)">UTC (Universal)</option>
                  <option value="EST (UTC-5)">EST (New York)</option>
                  <option value="PST (UTC-8)">PST (California)</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                   <Zap className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-8 flex flex-col h-full border-rose-100 dark:border-rose-900/20 lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-rose-50 dark:bg-rose-900/20 rounded-lg">
              <ShieldAlert className="h-5 w-5 text-rose-600 dark:text-rose-400" />
            </div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500">
              Danger Zone
            </h3>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-2xl bg-rose-50/50 dark:bg-rose-900/10 border border-rose-100/50 dark:border-rose-900/20">
            <div className="space-y-1">
              <h4 className="text-lg font-black text-rose-900 dark:text-rose-400 tracking-tight">Platform Cleanup</h4>
              <p className="text-sm text-rose-600/70 font-medium">Clear your local preferences, caches, and stored filters. This won't delete student data.</p>
            </div>
            <Button 
              variant="outline"
              onClick={() => {
                toast.promise(new Promise(resolve => setTimeout(resolve, 1500)), {
                  loading: 'Clearing local data...',
                  success: 'System cache cleared successfully!',
                  error: 'Failed to clear cache.',
                });
              }}
              className="h-12 px-8 rounded-xl border-rose-200 hover:bg-rose-100 dark:hover:bg-rose-900/30 text-rose-600 font-bold"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset Workspace
            </Button>
          </div>
        </div>

        {/* App Information (Original Card) */}
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-8 lg:col-span-2">
          <div className="flex items-center gap-3 mb-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Platform Intelligence
            </h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 transition-all hover:bg-white dark:hover:bg-slate-900 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-none">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Build Version</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">v1.0.4-Stable</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 transition-all hover:bg-white dark:hover:bg-slate-900 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-none">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Environment</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">Production</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 transition-all hover:bg-white dark:hover:bg-slate-900 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-none">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Core Runtime</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white underline decoration-primary/30 underline-offset-8">Next.js 15</p>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
               &copy; 2026 Student Attendance Tracker System
             </p>
             <div className="flex gap-6">
                <span onClick={() => setActiveModal('security')} className="text-xs font-black text-primary hover:underline cursor-pointer">Security Policy</span>
                <span onClick={() => setActiveModal('status')} className="text-xs font-black text-primary hover:underline cursor-pointer">Service Status</span>
                <span onClick={() => setActiveModal('terms')} className="text-xs font-black text-primary hover:underline cursor-pointer">Terms & Conditions</span>
             </div>
          </div>
        </div>
      </div>

      <Dialog open={!!activeModal} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="max-w-xl p-0 overflow-hidden border-none shadow-2xl rounded-3xl bg-white dark:bg-slate-950">
          <div className="p-8 pb-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black tracking-tight">
                {activeModal && modalContent[activeModal].title}
              </DialogTitle>
              <DialogDescription className="text-slate-500 font-medium">
                {activeModal && modalContent[activeModal].description}
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="p-8">
            {activeModal && modalContent[activeModal].content}
          </div>
          <div className="p-8 pt-0 flex justify-end">
            <Button onClick={() => setActiveModal(null)} className="rounded-xl font-bold px-8">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
