"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Edit, Trash, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

const ManagementTable = ({
  title,
  fetchData,
  createData,
  updateData,
  deleteData,
  dataKey,
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogState, setDialogState] = useState({ type: null, data: null });
  
  const { 
    register: registerAdd, 
    handleSubmit: handleSubmitAdd, 
    reset: resetAdd, 
    formState: { errors: errorsAdd } 
  } = useForm();

  const { 
    register: registerEdit, 
    handleSubmit: handleSubmitEdit, 
    reset: resetEdit, 
    setValue: setValueEdit,
    formState: { errors: errorsEdit } 
  } = useForm();

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await fetchData();
      setData(response.data.result || []);
    } catch (error) {
      toast.error(`Failed to fetch ${title.toLowerCase()}.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [fetchData]);

  const handleCreate = async (formData) => {
    try {
      await createData(formData);
      toast.success(`${title} created successfully.`);
      setDialogState({ type: null, data: null });
      resetAdd();
      loadData();
    } catch (error) {
      toast.error(`Failed to create ${title.toLowerCase()}.`);
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await updateData({ id: dialogState.data.id, ...formData });
      toast.success(`${title} updated successfully.`);
      setDialogState({ type: null, data: null });
      resetEdit();
      loadData();
    } catch (error) {
      toast.error(`Failed to update ${title.toLowerCase()}.`);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteData(id);
      toast.success(`${title} deleted successfully.`);
      loadData();
    } catch (error) {
      toast.error(`Failed to delete ${title.toLowerCase()}.`);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">{title}</h3>
        <Dialog
          open={dialogState.type === "add"}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setDialogState({ type: null, data: null });
              resetAdd();
            }
          }}
        >
          <DialogTrigger asChild>
            <Button onClick={() => setDialogState({ type: "add", data: null })}>
              Add New
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New {title}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmitAdd(handleCreate)} className="py-4">
              <Input
                placeholder={`Enter ${dataKey}`}
                {...registerAdd(dataKey, { 
                  required: `${dataKey} is required`,
                  minLength: { value: 2, message: `${dataKey} must be at least 2 characters` }
                })}
              />
              {errorsAdd[dataKey] && (
                <p className="text-red-500 text-sm mt-1">{errorsAdd[dataKey].message}</p>
              )}
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setDialogState({ type: null, data: null });
                    resetAdd();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Create</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>{dataKey.toUpperCase()}</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item[dataKey]}</TableCell>
                <TableCell>
                  <Dialog
                    open={dialogState.type === "edit" && dialogState.data?.id === item.id}
                    onOpenChange={(isOpen) => {
                      if (!isOpen) {
                        setDialogState({ type: null, data: null });
                        resetEdit();
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                            setDialogState({ type: "edit", data: item });
                            setValueEdit(dataKey, item[dataKey]);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit {title}</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleSubmitEdit(handleUpdate)} className="py-4">
                        <Input
                          placeholder={`Enter ${dataKey}`}
                          {...registerEdit(dataKey, { 
                            required: `${dataKey} is required`,
                            minLength: { value: 2, message: `${dataKey} must be at least 2 characters` }
                          })}
                        />
                        {errorsEdit[dataKey] && (
                            <p className="text-red-500 text-sm mt-1">{errorsEdit[dataKey].message}</p>
                        )}
                        <div className="flex justify-end gap-2 mt-4">
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => {
                              setDialogState({ type: null, data: null });
                              resetEdit();
                            }}
                          >
                            Cancel
                          </Button>
                          <Button type="submit">Update</Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the item.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(item.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default ManagementTable;
