"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import GlobalApi from "../../../_services/GlobalApi";
import { toast } from "sonner";
import { LoaderIcon } from "lucide-react";

function AddNewStudent({ refreshData, courseList, branchList, yearList }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (open) return;
    reset();
  }, [open, reset]);

  const onSubmit = (data) => {
    setLoading(true);
    GlobalApi.CreateNewStudent(data)
      .then((Response) => {
        if (Response.data) {
          reset();
          setOpen(false);
          toast.success("New Student Added Successfully!");
          refreshData();
        }
      })
      .catch((error) => {
        console.error("Error creating student:", error);
        toast.error(error.message || "An error occurred while adding the student.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      <Button
        onClick={() => setOpen(true)}
        variant="ghost"
        className="justify-start w-full h-10 rounded-lg font-bold text-primary hover:bg-primary/5 hover:text-primary transition-all"
      >
        + Add New Student
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[92vh] p-0 overflow-hidden border-none shadow-2xl rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-950 flex flex-col">
          <div className="p-6 sm:p-8 pb-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <DialogHeader>
              <DialogTitle className="text-xl sm:text-2xl font-black tracking-tight">Register New Student</DialogTitle>
              <DialogDescription className="text-slate-500 font-medium text-xs sm:text-sm">
                Complete the form below to add a student to the directory.
              </DialogDescription>
            </DialogHeader>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Full Name
                </label>
                <Input
                  placeholder="e.g. John Doe"
                  id="name"
                  className="h-11 sm:h-12 rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 focus:ring-primary/20 font-bold text-sm"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && <p className="text-rose-500 text-[10px] font-bold mt-1 ml-1">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Email Address
                </label>
                <Input
                  placeholder="john@university.edu"
                  id="email"
                  type="email"
                  className="h-11 sm:h-12 rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 focus:ring-primary/20 font-bold text-sm"
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Invalid email address"
                    }
                  })}
                />
                {errors.email && <p className="text-rose-500 text-[10px] font-bold mt-1 ml-1">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Phone Number
                </label>
                <Input
                  placeholder="10-digit mobile number"
                  id="phone"
                  type="number"
                  className="h-11 sm:h-12 rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 focus:ring-primary/20 font-bold text-sm"
                  {...register("phone")}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="course" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Assigned Course
                </label>
                <select
                  id="course"
                  className="w-full h-11 sm:h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 text-slate-700 dark:text-slate-200 font-bold focus:ring-2 focus:ring-primary/20 focus:outline-none appearance-none cursor-pointer transition-all text-sm"
                  {...register("courseId", { required: "Course is required" })}
                >
                  <option value="">Select Course</option>
                  {Array.isArray(courseList) &&
                    courseList.map((course) => (
                      <option key={course.id} value={course.id} className="dark:bg-slate-950">
                        {course.name}
                      </option>
                    ))}
                </select>
                {errors.courseId && <p className="text-rose-500 text-[10px] font-bold mt-1 ml-1">{errors.courseId.message}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="branch" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Academic Branch
                </label>
                <select
                  id="branch"
                  className="w-full h-11 sm:h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 text-slate-700 dark:text-slate-200 font-bold focus:ring-2 focus:ring-primary/20 focus:outline-none appearance-none cursor-pointer transition-all text-sm"
                  {...register("branchId", { required: "Branch is required" })}
                >
                  <option value="">Select Branch</option>
                  {Array.isArray(branchList) &&
                    branchList.map((branch) => (
                      <option key={branch.id} value={branch.id} className="dark:bg-slate-950">
                        {branch.name}
                      </option>
                    ))}
                </select>
                {errors.branchId && <p className="text-rose-500 text-[10px] font-bold mt-1 ml-1">{errors.branchId.message}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="year" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Academic Year
                </label>
                <select
                  id="year"
                  className="w-full h-11 sm:h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 text-slate-700 dark:text-slate-200 font-bold focus:ring-2 focus:ring-primary/20 focus:outline-none appearance-none cursor-pointer transition-all text-sm"
                  {...register("yearId", { required: "Year is required" })}
                >
                  <option value="">Select Year</option>
                  {Array.isArray(yearList) &&
                    yearList.map((year) => (
                      <option key={year.id} value={year.id} className="dark:bg-slate-950">
                        {year.value}
                      </option>
                    ))}
                </select>
                {errors.yearId && <p className="text-rose-500 text-[10px] font-bold mt-1 ml-1">{errors.yearId.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="address" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Residential Address
              </label>
              <Input
                placeholder="Full address details..."
                id="address"
                className="h-11 sm:h-12 rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 focus:ring-primary/20 font-bold text-sm"
                {...register("address")}
              />
            </div>

            {/* Footer moved inside form but will be sticky-like if we adjust structure, 
                or just keep it at the end of the scroll if preferred. 
                Let's separate it for true sticky behavior. */}
          </form>

          <div className="p-6 sm:p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="h-11 sm:h-12 px-6 sm:px-8 rounded-xl font-bold text-slate-500"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={loading}
              className="h-11 sm:h-12 px-8 sm:px-10 rounded-xl font-bold shadow-xl shadow-primary/20 transition-all hover:scale-[1.02]"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <LoaderIcon className="h-4 w-4 animate-spin" /> 
                  <span>Registering...</span>
                </div>
              ) : (
                "Add Student"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewStudent;
