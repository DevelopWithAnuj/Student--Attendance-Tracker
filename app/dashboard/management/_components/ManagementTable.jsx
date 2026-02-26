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
      toast.error(error.message || `Failed to fetch ${title.toLowerCase()}.`);
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
      toast.error(error.message || `Failed to create ${title.toLowerCase()}.`);
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
      toast.error(error.message || `Failed to update ${title.toLowerCase()}.`);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteData(id);
      toast.success(`${title} deleted successfully.`);
      loadData();
    } catch (error) {
      toast.error(error.message || `Failed to delete ${title.toLowerCase()}.`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{title} Configuration</h3>
          <p className="text-sm text-slate-500 font-medium mt-0.5">Define and manage the active {title.toLowerCase()} list.</p>
        </div>
        
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
            <Button 
              onClick={() => setDialogState({ type: "add", data: null })}
              className="h-11 px-8 rounded-xl font-black shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
            >
              + Create {title}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md p-0 overflow-hidden border-none shadow-2xl rounded-3xl bg-white dark:bg-slate-950">
            <div className="p-8 pb-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black tracking-tight tracking-tight">New {title}</DialogTitle>
              </DialogHeader>
            </div>
            <form onSubmit={handleSubmitAdd(handleCreate)} className="p-8 pt-6 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{dataKey}</label>
                <Input
                  placeholder={`e.g. ${title === 'Years' ? '2024-25' : 'Computer Science'}`}
                  className="h-12 rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 focus:ring-primary/20 font-bold"
                  {...registerAdd(dataKey, { 
                    required: `${dataKey} is required`,
                    minLength: { value: 2, message: `${dataKey} must be at least 2 characters` }
                  })}
                />
                {errorsAdd[dataKey] && (
                  <p className="text-rose-500 text-[10px] font-bold mt-1 ml-1">{errorsAdd[dataKey].message}</p>
                )}
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setDialogState({ type: null, data: null });
                    resetAdd();
                  }}
                  className="h-11 px-6 rounded-xl font-bold text-slate-500"
                >
                  Cancel
                </Button>
                <Button type="submit" className="h-11 px-8 rounded-xl font-black shadow-lg shadow-primary/10 transition-all">Create {title}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-24 gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary opacity-30" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 animate-pulse">Syncing data...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                <TableRow className="hover:bg-transparent border-slate-100 dark:border-slate-800">
                  <TableHead className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400 w-24">ID</TableHead>
                  <TableHead className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">{dataKey.toUpperCase()}</TableHead>
                  <TableHead className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item) => (
                  <TableRow key={item.id} className="group hover:bg-slate-50 dark:hover:bg-slate-900/40 border-slate-100 dark:border-slate-800 transition-colors">
                    <TableCell className="px-8 py-4 font-bold text-slate-400">#{item.id}</TableCell>
                    <TableCell className="px-8 py-4">
                      <span className="text-sm font-black text-slate-700 dark:text-slate-200 group-hover:text-primary transition-colors">{item[dataKey]}</span>
                    </TableCell>
                    <TableCell className="px-8 py-4 text-right">
                      <div className="flex justify-end gap-2">
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
                              className="h-9 w-9 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md p-0 overflow-hidden border-none shadow-2xl rounded-3xl bg-white dark:bg-slate-950">
                            <div className="p-8 pb-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                              <DialogHeader>
                                <DialogTitle className="text-2xl font-black tracking-tight tracking-tight">Modify {title}</DialogTitle>
                              </DialogHeader>
                            </div>
                            <form onSubmit={handleSubmitEdit(handleUpdate)} className="p-8 pt-6 space-y-6">
                              <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{dataKey}</label>
                                <Input
                                  placeholder={`Update ${dataKey}`}
                                  className="h-12 rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 focus:ring-primary/20 font-bold"
                                  {...registerEdit(dataKey, { 
                                    required: `${dataKey} is required`,
                                    minLength: { value: 2, message: `${dataKey} must be at least 2 characters` }
                                  })}
                                />
                                {errorsEdit[dataKey] && (
                                    <p className="text-rose-500 text-[10px] font-bold mt-1 ml-1">{errorsEdit[dataKey].message}</p>
                                )}
                              </div>
                              <div className="flex justify-end gap-3 pt-2">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  onClick={() => {
                                    setDialogState({ type: null, data: null });
                                    resetEdit();
                                  }}
                                  className="h-11 px-6 rounded-xl font-bold text-slate-500"
                                >
                                  Cancel
                                </Button>
                                <Button type="submit" className="h-11 px-8 rounded-xl font-black shadow-lg shadow-primary/10 transition-all">Save Changes</Button>
                              </div>
                            </form>
                          </DialogContent>
                        </Dialog>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-900/20 dark:text-rose-400">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-3xl border-none shadow-2xl">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-xl font-black tracking-tight">Delete Confirmation</AlertDialogTitle>
                              <AlertDialogDescription className="font-medium text-slate-500">
                                You are about to permanently remove <span className="text-slate-900 dark:text-white font-bold">{item[dataKey]}</span> from the system. This cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="mt-4 gap-3">
                              <AlertDialogCancel className="rounded-xl font-bold h-11 px-6 mt-0">Keep It</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(item.id)}
                                className="bg-rose-600 hover:bg-rose-700 rounded-xl font-black h-11 px-6 shadow-lg shadow-rose-500/20"
                              >
                                Delete {title}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {data.length === 0 && !loading && (
              <div className="p-20 text-center flex flex-col items-center justify-center gap-4">
                <div className="h-16 w-16 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center border border-slate-100 dark:border-slate-800">
                  <LayoutListIcon className="h-8 w-8 text-slate-200" />
                </div>
                <p className="text-sm font-black text-slate-300 uppercase tracking-widest">No entries found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagementTable;
