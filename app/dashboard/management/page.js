"use client";
import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import ManagementTable from "./_components/ManagementTable";
import GlobalApi from "@/app/_services/GlobalApi";

const ManagementPage = () => {
  const [activeTab, setActiveTab] = useState("courses");

  const getFetchData = useCallback(() => {
    switch (activeTab) {
      case "courses":
        return GlobalApi.GetAllCourses;
      case "branches":
        return GlobalApi.GetAllBranches;
      case "years":
        return GlobalApi.GetAllYears;
      default:
        return () => Promise.resolve({ data: { result: [] } });
    }
  }, [activeTab]);

  const getCreateData = useCallback(() => {
    switch (activeTab) {
      case "courses":
        return GlobalApi.CreateCourse;
      case "branches":
        return GlobalApi.CreateBranch;
      case "years":
        return GlobalApi.CreateYear;
      default:
        return () => Promise.resolve();
    }
  }, [activeTab]);

  const getUpdateData = useCallback(() => {
    switch (activeTab) {
      case "courses":
        return GlobalApi.UpdateCourse;
      case "branches":
        return GlobalApi.UpdateBranch;
      case "years":
        return GlobalApi.UpdateYear;
      default:
        return () => Promise.resolve();
    }
  }, [activeTab]);

  const getDeleteData = useCallback(() => {
    switch (activeTab) {
      case "courses":
        return GlobalApi.DeleteCourse;
      case "branches":
        return GlobalApi.DeleteBranch;
      case "years":
        return GlobalApi.DeleteYear;
      default:
        return () => Promise.resolve();
    }
  }, [activeTab]);

  const getDataKey = useCallback(() => {
    return activeTab === "years" ? "value" : "name";
  }, [activeTab]);

  return (
    <div className="p-4 sm:p-6 md:p-10">
      <h2 className="font-bold text-2xl mb-4">Management</h2>
      <div className="flex gap-2 mb-4">
        <Button
          variant={activeTab === "courses" ? "default" : "outline"}
          onClick={() => setActiveTab("courses")}
        >
          Courses
        </Button>
        <Button
          variant={activeTab === "branches" ? "default" : "outline"}
          onClick={() => setActiveTab("branches")}
        >
          Branches
        </Button>
        <Button
          variant={activeTab === "years" ? "default" : "outline"}
          onClick={() => setActiveTab("years")}
        >
          Years
        </Button>
      </div>
      <div>
        <ManagementTable
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
