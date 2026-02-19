"use client"
import React, { useEffect, useState, useRef } from 'react'; // Add useRef
import AddNewStudent from './_components/AddNewStudent';
import GlobalApi from '@/app/_services/GlobalApi';
import StudentListTable from './_components/StudentListTable';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { LayoutListIcon, MenuSquare } from 'lucide-react';

const Student = () => {
  const [studentList, setStudentList] = useState([]);
  const [courseList, setCourseList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [yearList, setYearList] = useState([]);
  const [loading, setLoading] = useState(true);
  const studentTableRef = useRef(null); // Create ref for StudentListTable

  useEffect(() => {
    getPageData();
  }, []);

  const getPageData = async () => {
    setLoading(true);
    try {
      const [studentsRes, coursesRes, branchesRes, yearsRes] = await Promise.all([
        GlobalApi.GetAllStudents(),
        GlobalApi.GetAllCourses(),
        GlobalApi.GetAllBranches(),
        GlobalApi.GetAllYears(),
      ]);
      setStudentList(studentsRes.data.result || []);
      setCourseList(coursesRes.data.result || []);
      setBranchList(branchesRes.data.result || []);
      setYearList(yearsRes.data.result || []);
    } catch (error) {
      console.error("Failed to fetch page data:", error);
      toast.error("Failed to load page data.");
    } finally {
      setLoading(false);
    }
  };

  const refreshStudentList = () => {
    // Set loading to true if you want a loading indicator on refresh
    // setLoading(true); 
    GlobalApi.GetAllStudents().then(Response => {
      setStudentList(Response.data.result)
    }).catch(error => {
        console.error("Failed to refresh student list:", error);
        toast.error("Failed to refresh student list.");
    })
    // .finally(() => setLoading(false));
  }

  const handleSync = () => {
    toast.info("Attempting to sync database sequence...");
    GlobalApi.SyncDbSequence()
      .then(response => {
        console.log(response.data);
        toast.success(response.data.message);
      })
      .catch(error => {
        console.error('Error syncing DB:', error);
        toast.error(error?.response?.data?.error || 'Failed to sync database sequence.');
      });
  };

  const handleExportCSV = () => {
    if (studentTableRef.current) {
      studentTableRef.current.triggerCsvExport();
    }
  };

  const handleExportPDF = () => {
    if (studentTableRef.current) {
      studentTableRef.current.triggerPdfExport();
    }
  };

  return (
    <div className="p-4 sm:p-7">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <h2 className="font-bold text-2xl align-middle flex items-center gap-2">
          <LayoutListIcon className="h-8 w-8 text-muted-foreground" />
          Students
        </h2>
        <div className="flex flex-wrap items-center gap-2 justify-end">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <MenuSquare className="h-4 w-4" /> Menu
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2">
              <div className="grid gap-2">
                <Button
                  onClick={handleSync}
                  variant="ghost"
                  className="justify-start"
                >
                  Sync DB
                </Button>
                <Button
                  onClick={handleExportCSV}
                  variant="ghost"
                  className="justify-start"
                >
                  Export to CSV
                </Button>
                <Button
                  onClick={handleExportPDF}
                  variant="ghost"
                  className="justify-start"
                >
                  Export to PDF
                </Button>
                <AddNewStudent
                  courseList={courseList}
                  branchList={branchList}
                  yearList={yearList}
                  refreshData={refreshStudentList}
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {loading ? (
        <div className="text-center p-10">Loading...</div>
      ) : (
        <StudentListTable
          ref={studentTableRef} // Pass the ref to StudentListTable
          studentList={studentList}
          refreshData={refreshStudentList}
        />
      )}
    </div>
  );
};



export default Student;
