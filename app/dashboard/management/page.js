"use client";
import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import ManagementTable from "./_components/ManagementTable";
import GlobalApi from "@/app/_services/GlobalApi";
import { LayoutListIcon, GraduationCap, Building2, CalendarRange } from "lucide-react";

const ManagementPage = () => {
  const [activeTab, setActiveTab] = useState("courses");

  const tabs = [
    { id: "courses", label: "Courses", icon: GraduationCap },
    { id: "branches", label: "Branches", icon: Building2 },
    { id: "years", label: "Years", icon: CalendarRange },
  ];

  const getFetchData = useCallback(() => {
    switch (activeTab) {
      case "courses": return GlobalApi.GetAllCourses;
      case "branches": return GlobalApi.GetAllBranches;
      case "years": return GlobalApi.GetAllYears;
      default: return () => Promise.resolve({ data: { result: [] } });
    }
  }, [activeTab]);

  const getCreateData = useCallback(() => {
    switch (activeTab) {
      case "courses": return GlobalApi.CreateCourse;
      case "branches": return GlobalApi.CreateBranch;
      case "years": return GlobalApi.CreateYear;
      default: return () => Promise.resolve();
    }
  }, [activeTab]);

  const getUpdateData = useCallback(() => {
    switch (activeTab) {
      case "courses": return GlobalApi.UpdateCourse;
      case "branches": return GlobalApi.UpdateBranch;
      case "years": return GlobalApi.UpdateYear;
      default: return () => Promise.resolve();
    }
  }, [activeTab]);

  const getDeleteData = useCallback(() => {
    switch (activeTab) {
      case "courses": return GlobalApi.DeleteCourse;
      case "branches": return GlobalApi.DeleteBranch;
      case "years": return GlobalApi.DeleteYear;
      default: return () => Promise.resolve();
    }
  }, [activeTab]);

  const getDataKey = useCallback(() => {
    return activeTab === "years" ? "value" : "name";
  }, [activeTab]);

  return (
    <div className="p-4 sm:p-6 lg:p-10 bg-slate-50/30 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h2 className="font-extrabold text-3xl tracking-tight flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <LayoutListIcon className="h-8 w-8 text-primary" />
            </div>
            Infrastructure Setup
          </h2>
          <p className="text-muted-foreground mt-1 ml-13">Configure institutional courses, branches, and academic years.</p>
        </div>
      </div>

      <div className="flex bg-white dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm w-full md:w-fit mb-8 overflow-x-auto">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "ghost"}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 h-11 px-6 rounded-xl transition-all duration-300 ${
              activeTab === tab.id 
                ? "shadow-lg shadow-primary/20 font-black" 
                : "text-slate-500 font-bold hover:bg-slate-50 dark:hover:bg-slate-900"
            }`}
          >
            <tab.icon className={`h-4 w-4 ${activeTab === tab.id ? "text-white" : "text-slate-400"}`} />
            {tab.label}
          </Button>
        ))}
      </div>

      <div className="animate-in fade-in zoom-in-95 duration-500">
        <ManagementTable
          key={activeTab} // Force re-mount for animation
          title={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          fetchData={getFetchData()}
          createData={getCreateData()}
          updateData={getUpdateData()}
          deleteData={getDeleteData()}
          dataKey={getDataKey()}
        />
      </div>
    </div>
  );
};

export default ManagementPage;
