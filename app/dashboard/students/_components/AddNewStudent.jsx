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
        console.log("--", Response);
        if (Response.data) {
          reset();
          setOpen(false);
          toast("New Student Added Successfully!", { type: "success" });
          refreshData();
        }
      })
      .catch((error) => {
        console.error("Error creating student:", error);
        toast(error.message || "An error occurred while adding the student.", {
          type: "error",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      <Button
        onClick={() => setOpen(true)}
        className="bg-blue-500 text-white ml-5 hover:bg-blue-900"
      >
        + Add New Student
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
            <DialogDescription>
              Make sure to fill all the fields.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                Full Name
              </label>
              <div className="col-span-3">
                <Input
                  placeholder="John Doe"
                  id="name"
                  type="text"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="email" className="text-right">
                Email
              </label>
              <div className="col-span-3">
                <Input
                  placeholder="jonedoe@example.com"
                  id="email"
                  type="email"
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Invalid email address"
                    }
                  })}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="phone" className="text-right">
                Phone
              </label>
              <div className="col-span-3">
                <Input
                  placeholder="9876543210"
                  id="phone"
                  type={"number"}
                  {...register("phone")}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="course" className="text-right">
                Course
              </label>
              <div className="col-span-3">
                <select
                  id="course"
                  className="w-full border border-input p-2 rounded-md bg-background text-foreground"
                  {...register("courseId", { required: "Course is required" })}
                >
                  <option value="">Select Course</option>
                  {Array.isArray(courseList) &&
                    courseList.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    ))}
                </select>
                {errors.courseId && <p className="text-red-500 text-xs mt-1">{errors.courseId.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="branch" className="text-right">
                Branch
              </label>
              <div className="col-span-3">
                <select
                  id="branch"
                  className="w-full border border-input p-2 rounded-md bg-background text-foreground"
                  {...register("branchId", { required: "Branch is required" })}
                >
                  <option value="">Select Branch</option>
                  {Array.isArray(branchList) &&
                    branchList.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                    ))}
                </select>
                {errors.branchId && <p className="text-red-500 text-xs mt-1">{errors.branchId.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="year" className="text-right">
                Year
              </label>
              <div className="col-span-3">
                <select
                  id="year"
                  className="w-full border border-input p-2 rounded-md bg-background text-foreground"
                  {...register("yearId", { required: "Year is required" })}
                >
                  <option value="">Select Year</option>
                  {Array.isArray(yearList) &&
                    yearList.map((year) => (
                      <option key={year.id} value={year.id}>
                        {year.value}
                      </option>
                    ))}
                </select>
                {errors.yearId && <p className="text-red-500 text-xs mt-1">{errors.yearId.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="address" className="text-right">
                Address
              </label>
              <div className="col-span-3">
                <Input
                  placeholder="123, Main Street, City, Country"
                  id="address"
                  {...register("address")}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className={`bg-blue-600 text-white hover:bg-blue-800 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {loading ? (
                  <>
                    <LoaderIcon className="animate-spin" /> Adding...
                  </>
                ) : (
                  "Add Student"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewStudent;
