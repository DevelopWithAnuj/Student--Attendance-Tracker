"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2Icon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import GlobalApi from "@/app/_services/GlobalApi";
import { toast } from "sonner";
import AttendanceStatusSelect from "./AttendanceStatusSelect";

function DailyAttendanceModal({ 
  allStudents, 
  selectedBranch, 
  selectedCourse, 
  selectedYear,
  reFetchData 
}) {
  const [date, setDate] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  // Fetch existing attendance for the selected date when modal opens or date changes
  useEffect(() => {
    if (isOpen && date && selectedBranch && selectedCourse && selectedYear) {
      fetchExistingAttendance();
    }
  }, [isOpen, date]);

  const fetchExistingAttendance = async () => {
    setFetching(true);
    try {
      const month = format(date, "MM/yyyy");
      const resp = await GlobalApi.GetAttendanceList(
        selectedCourse === "All" ? null : selectedCourse,
        selectedBranch === "All" ? null : selectedBranch,
        selectedYear === "All" ? null : selectedYear,
        month
      );
      
      const targetDate = format(date, "yyyy-MM-dd");
      const existingData = {};
      
      resp.data.result.forEach(record => {
        if (record.attendance.date === targetDate) {
          existingData[record.students.id] = record.attendance.status;
        }
      });
      
      setAttendance(existingData);
    } catch (error) {
      console.error("Error fetching daily attendance:", error);
    } finally {
      setFetching(false);
    }
  };

  const onAttendanceChange = (studentId, day, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const onSave = async () => {
    if (selectedCourse === "All" || selectedBranch === "All" || selectedYear === "All") {
      toast.error("Please select a specific Course, Branch, and Year first.");
      return;
    }

    setLoading(true);
    const day = parseInt(format(date, "d"));
    const dateStr = format(date, "yyyy-MM-dd");
    
    const attendanceData = Object.keys(attendance).map(studentId => ({
      studentId: parseInt(studentId),
      status: attendance[studentId],
      day: day,
      date: dateStr,
    })).filter(item => item.status !== undefined);

    try {
      await GlobalApi.takeBulkAttendance(attendanceData);
      toast.success(`Attendance for ${format(date, "PPP")} saved!`);
      setIsOpen(false);
      reFetchData();
    } catch (error) {
      toast.error("Error saving attendance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="h-11 px-6 rounded-xl shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all font-bold gap-2">
          <CalendarIcon className="h-4 w-4" />
          Quick Mark
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 overflow-hidden border-none shadow-2xl rounded-3xl bg-white dark:bg-slate-950">
        <div className="p-8 pb-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-black tracking-tight">Mark Daily Attendance</DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">Select Date</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[260px] h-12 justify-start text-left font-bold rounded-xl border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:bg-white dark:hover:bg-slate-900",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-3 h-5 w-5 text-primary" />
                    {date ? format(date, "PPPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-2xl overflow-hidden shadow-2xl border-slate-200 dark:border-slate-800" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => d && setDate(d)}
                    initialFocus
                    disabled={(date) => date > new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-wrap items-center gap-4 px-5 py-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">Quick Legend</span>
              {[
                { label: 'P', color: 'bg-emerald-500' },
                { label: 'A', color: 'bg-rose-500' },
                { label: 'L', color: 'bg-amber-500' },
                { label: 'O', color: 'bg-sky-500' },
                { label: 'H', color: 'bg-slate-500' },
              ].map(item => (
                <div key={item.label} className={`w-5 h-5 rounded-md ${item.color} text-white flex items-center justify-center text-[10px] font-bold`}>
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-8 pt-6 custom-scrollbar">
          {fetching ? (
            <div className="flex flex-col items-center justify-center p-20 gap-4">
              <div className="relative">
                <Loader2Icon className="h-12 w-12 animate-spin text-primary opacity-30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
                </div>
              </div>
              <p className="text-sm font-bold text-slate-400 animate-pulse tracking-widest uppercase">Syncing student list...</p>
            </div>
          ) : (
            <div className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm bg-slate-50/30 dark:bg-slate-900/20">
              <table className="w-full border-collapse">
                <thead className="bg-white dark:bg-slate-950 sticky top-0 z-10 border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Student Name</th>
                    <th className="px-6 py-4 text-center text-[11px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {allStudents.map(student => (
                    <tr key={student.id} className="hover:bg-white dark:hover:bg-slate-900 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-primary group-hover:scale-110 transition-transform">
                            {student.name.charAt(0)}
                          </div>
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{student.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <AttendanceStatusSelect
                          studentId={student.id}
                          day={parseInt(format(date, "d"))}
                          onAttendanceChange={onAttendanceChange}
                          initialStatus={attendance[student.id]}
                        />
                      </td>
                    </tr>
                  ))}
                  {allStudents.length === 0 && (
                    <tr>
                      <td colSpan={2} className="p-20 text-center">
                         <div className="flex flex-col items-center gap-4 opacity-40">
                           <Loader2Icon className="h-10 w-10 text-slate-300" />
                           <p className="text-sm font-black uppercase tracking-widest">No students found</p>
                         </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end gap-4">
          <Button variant="ghost" onClick={() => setIsOpen(false)} className="h-12 px-8 rounded-xl font-bold text-slate-500">
            Cancel
          </Button>
          <Button onClick={onSave} disabled={loading || fetching} className="h-12 px-10 rounded-xl font-bold shadow-xl shadow-primary/20 transition-all hover:scale-[1.02]">
            {loading ? "Saving Changes..." : "Save Attendance"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DailyAttendanceModal;
