"use client"
import React, { useEffect, useState, useRef } from 'react'; // Add useRef
import AddNewStudent from './_components/AddNewStudent';
import GlobalApi from '@/app/_services/GlobalApi';
import StudentListTable from './_components/StudentListTable';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { LayoutListIcon, MenuSquare } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

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
    <div className="p-4 sm:p-6 lg:p-10 bg-slate-50/30 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h2 className="font-extrabold text-3xl tracking-tight flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <LayoutListIcon className="h-8 w-8 text-primary" />
            </div>
            Student Directory
          </h2>
          <p className="text-muted-foreground mt-1 ml-13">Manage and organize student records efficiently.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-white dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <Button variant="ghost" size="sm" className="h-9 px-4 rounded-lg font-bold text-slate-600" onClick={handleExportCSV}>
              CSV
            </Button>
            <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-800 self-center mx-1" />
            <Button variant="ghost" size="sm" className="h-9 px-4 rounded-lg font-bold text-slate-600" onClick={handleExportPDF}>
              PDF
            </Button>
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-11 px-4 rounded-xl border-slate-200 dark:border-slate-800 shadow-sm font-bold gap-2">
                <MenuSquare className="h-4 w-4" />
                Actions
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2 rounded-2xl border-slate-200 dark:border-slate-800 shadow-2xl" align="end">
              <div className="grid gap-1">
                <Button
                  onClick={handleSync}
                  variant="ghost"
                  className="justify-start h-10 rounded-lg font-bold text-slate-600"
                >
                  Sync Database
                </Button>
                <div className="h-[1px] bg-slate-100 dark:bg-slate-800 my-1" />
                <p className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Manage</p>
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
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 space-y-4">
          <Skeleton className="h-12 w-full max-w-sm rounded-xl" />
          <Skeleton className="h-[500px] w-full rounded-xl" />
        </div>
      ) : (
        <div className="animate-in fade-in duration-500">
          <StudentListTable
            ref={studentTableRef}
            studentList={studentList}
            refreshData={refreshStudentList}
          />
        </div>
      )}
    </div>
  );
};



export default Student;
