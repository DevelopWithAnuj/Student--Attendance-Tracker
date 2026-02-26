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
        <Button variant="secondary">
          <CalendarIcon className="mr-2 h-4 w-4" />
          Mark Daily Attendance
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Mark Daily Attendance</DialogTitle>
        </DialogHeader>
        
        <div className="flex items-center gap-4 py-4">
          <span className="text-sm font-medium">Select Date:</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
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

        <div className="flex flex-wrap gap-3 items-center text-[10px] mb-2 px-1">
          <span className="font-bold text-muted-foreground uppercase">Legend:</span>
          <div className="flex items-center gap-1">
            <span className="font-bold text-green-600">P</span>: Present
          </div>
          <div className="flex items-center gap-1">
            <span className="font-bold text-red-600">A</span>: Absent
          </div>
          <div className="flex items-center gap-1">
            <span className="font-bold text-yellow-600">L</span>: Late
          </div>
          <div className="flex items-center gap-1">
            <span className="font-bold text-blue-600">O</span>: On Leave
          </div>
          <div className="flex items-center gap-1">
            <span className="font-bold text-gray-600">H</span>: Holiday
          </div>
        </div>

        <div className="flex-1 overflow-auto border rounded-md">
          {fetching ? (
            <div className="flex items-center justify-center p-8">
              <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-muted sticky top-0">
                <tr>
                  <th className="p-2 text-left text-sm font-medium">Student Name</th>
                  <th className="p-2 text-center text-sm font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {allStudents.map(student => (
                  <tr key={student.id}>
                    <td className="p-2 text-sm">{student.name}</td>
                    <td className="p-2 text-center">
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
                    <td colSpan={2} className="p-4 text-center text-muted-foreground">
                      No students found for current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={onSave} disabled={loading || fetching}>
            {loading ? "Saving..." : "Save Attendance"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DailyAttendanceModal;
