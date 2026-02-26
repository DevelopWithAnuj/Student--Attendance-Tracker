"use client";
import GlobalApi from "@/app/_services/GlobalApi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const CustomButtons = ({ rowData, courses, branches, years, onDeleteSuccess }) => {
  const [editOpen, setEditOpen] = useState(false);
  const { register, handleSubmit, reset, setValue } = useForm();

  const deleteRecord = async (id) => {
    if (!id) {
      toast.error("Invalid student ID");
      return;
    }

    try {
      const res = await GlobalApi.DeleteStudentRecord(id);
      if (res) {
        toast.success("Student record deleted successfully");
        if (onDeleteSuccess) {
          await onDeleteSuccess(); // Wait for parent to refresh
        }
      }
    } catch (error) {
      toast.error("Error deleting student");
      console.error(error);
    }
  };

  const onEditSubmit = (data) => {
    GlobalApi.UpdateStudent(rowData.id, data)
      .then((Response) => {
        console.log("--", Response);
        if (Response.data) {
          reset();
          setEditOpen(false);
          toast("Student Updated Successfully!", { type: "success" });
          if (onDeleteSuccess) onDeleteSuccess();
        }
      })
      .catch((error) => {
        console.error("Error updating student:", error);
        if (error?.response?.status) {
          toast(error?.response?.data?.error || `Error: ${error.response.status}`, {
            type: "error",
          });
          return;
        }
        toast("An error occurred while updating the student.", {
          type: "error",
        });
      });
  };

  const handleEdit = () => {
    const courseId = rowData.courseId || rowData.course?.id;
    const branchId = rowData.branchId || rowData.branch?.id;
    const yearId = rowData.yearId || rowData.year?.id;
    setValue("name", rowData.name);
    setValue("email", rowData.email);
    setValue("phone", rowData.phone);
    setValue("courseId", courseId);
    setValue("branchId", branchId);
    setValue("yearId", yearId);
    setValue("address", rowData.address);
    setEditOpen(true);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleEdit}
        className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
      >
        <Edit className="h-4 w-4" />
      </Button>
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 dark:bg-rose-900/20 dark:text-rose-400"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="rounded-3xl border-none shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black">Delete Student Record</AlertDialogTitle>
            <AlertDialogDescription className="font-medium">
              Are you sure you want to remove <span className="text-slate-900 dark:text-white font-bold">{rowData.name}</span>? This action cannot be reversed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end mt-4">
            <AlertDialogCancel className="rounded-xl font-bold h-11 px-6">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                deleteRecord(rowData?.id)
              }}
              className="bg-rose-600 hover:bg-rose-700 rounded-xl font-bold h-11 px-6"
            >
              Delete Student
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog - Refactored for mobile responsiveness */}
      <AlertDialog open={editOpen} onOpenChange={setEditOpen}>
        <AlertDialogContent className="max-w-2xl max-h-[92vh] p-0 overflow-hidden border-none shadow-2xl rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-950 flex flex-col">
          <div className="p-6 sm:p-8 pb-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl sm:text-2xl font-black tracking-tight">Edit Student Profile</AlertDialogTitle>
              <AlertDialogDescription className="text-slate-500 font-medium text-xs sm:text-sm">
                Update information for {rowData.name}.
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>

          <form onSubmit={handleSubmit(onEditSubmit)} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                <Input
                  placeholder="John Doe"
                  className="h-11 sm:h-12 rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 focus:ring-primary/20 font-bold text-sm"
                  {...register("name", { required: true })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                <Input
                  placeholder="johndoe@example.com"
                  type="email"
                  className="h-11 sm:h-12 rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 focus:ring-primary/20 font-bold text-sm"
                  {...register("email", { required: true })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
                <Input
                  placeholder="9876543210"
                  type="number"
                  className="h-11 sm:h-12 rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 focus:ring-primary/20 font-bold text-sm"
                  {...register("phone")}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Assigned Course</label>
                <select
                  className="w-full h-11 sm:h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 text-slate-700 dark:text-slate-200 font-bold focus:ring-2 focus:ring-primary/20 focus:outline-none appearance-none cursor-pointer text-sm"
                  {...register("courseId", { required: true })}
                >
                  {Array.isArray(courses) &&
                    courses.map((course) => (
                      <option key={course.id} value={course.id} className="dark:bg-slate-950">
                        {course.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Academic Branch</label>
                <select
                  className="w-full h-11 sm:h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 text-slate-700 dark:text-slate-200 font-bold focus:ring-2 focus:ring-primary/20 focus:outline-none appearance-none cursor-pointer text-sm"
                  {...register("branchId", { required: true })}
                >
                  {Array.isArray(branches) &&
                    branches.map((branch) => (
                      <option key={branch.id} value={branch.id} className="dark:bg-slate-950">
                        {branch.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Academic Year</label>
                <select
                  className="w-full h-11 sm:h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 text-slate-700 dark:text-slate-200 font-bold focus:ring-2 focus:ring-primary/20 focus:outline-none appearance-none cursor-pointer text-sm"
                  {...register("yearId", { required: true })}
                >
                  {Array.isArray(years) &&
                    years.map((year) => (
                      <option key={year.id} value={year.id} className="dark:bg-slate-950">
                        {year.value}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Residential Address</label>
              <Input
                placeholder="Address"
                className="h-11 sm:h-12 rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 focus:ring-primary/20 font-bold text-sm"
                {...register("address")}
              />
            </div>
          </form>

          <div className="p-6 sm:p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setEditOpen(false)}
              className="h-11 sm:h-12 px-6 sm:px-8 rounded-xl font-bold text-slate-500"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit(onEditSubmit)}
              className="h-11 sm:h-12 px-8 sm:px-10 rounded-xl font-bold shadow-xl shadow-primary/20 transition-all hover:scale-[1.02]"
            >
              Save Changes
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CustomButtons;
