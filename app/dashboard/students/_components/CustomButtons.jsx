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
    <div className="flex gap-2">
      <button
        onClick={handleEdit}
        className="p-2 rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200"
      >
        <Edit className="h-4 w-4" />
      </button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button className="p-2 rounded-md bg-red-100 text-red-600 hover:bg-red-200">
            <Trash2 className="h-4 w-4" />
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Student</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this student? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                deleteRecord(rowData?.id)
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog */}
      <AlertDialog open={editOpen} onOpenChange={setEditOpen}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Student</AlertDialogTitle>
            <AlertDialogDescription>
              Update the student details.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <form onSubmit={handleSubmit(onEditSubmit)} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-name" className="text-right">
                Full Name
              </label>
              <Input
                placeholder="John Doe"
                id="edit-name"
                type="text"
                className="col-span-3"
                {...register("name", { required: true })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-email" className="text-right">
                Email
              </label>
              <Input
                placeholder="johndoe@example.com"
                id="edit-email"
                type="email"
                className="col-span-3"
                {...register("email", { required: true })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-phone" className="text-right">
                Phone
              </label>
              <Input
                placeholder="9876543210"
                id="edit-phone"
                type="number"
                className="col-span-3"
                {...register("phone")}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-course" className="text-right">
                Course
              </label>
              <select
                id="edit-course"
                className="col-span-3 border p-2 rounded-md"
                {...register("courseId", { required: true })}
              >
                {Array.isArray(courses) &&
                  courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-branch" className="text-right">
                Branch
              </label>
              <select
                id="edit-branch"
                className="col-span-3 border p-2 rounded-md"
                {...register("branchId", { required: true })}
              >
                {Array.isArray(branches) &&
                  branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-year" className="text-right">
                Year
              </label>
              <select
                id="edit-year"
                className="col-span-3 border p-2 rounded-md"
                {...register("yearId", { required: true })}
              >
                {Array.isArray(years) &&
                  years.map((year) => (
                    <option key={year.id} value={year.id}>
                      {year.value}
                    </option>
                  ))}
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-address" className="text-right">
                Address
              </label>
              <Input
                placeholder="123, Main Street, City, Country"
                id="edit-address"
                className="col-span-3"
                {...register("address")}
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 text-white hover:bg-blue-800"
              >
                Update Student
              </Button>
            </div>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CustomButtons;
