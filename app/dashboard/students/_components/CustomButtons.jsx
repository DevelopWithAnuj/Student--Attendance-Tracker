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
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation"; // <-- added

const CustomButtons = ({ rowData, courses, branches, years, onDeleteSuccess }) => {
  const router = useRouter(); // <-- added

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

  return (
    <div className="flex gap-2">
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
    </div>
  );
};

export default CustomButtons;
