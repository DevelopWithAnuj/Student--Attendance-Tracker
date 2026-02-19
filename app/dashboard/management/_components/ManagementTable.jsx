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
  const [newItemValue, setNewItemValue] = useState("");
  const [validationError, setValidationError] = useState("");

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

  const handleCreate = async () => {
    if (!newItemValue.trim()) {
      setValidationError(`${dataKey} cannot be empty.`);
      return;
    }
    setValidationError("");
    try {
      await createData({ [dataKey]: newItemValue });
      toast.success(`${title} created successfully.`);
      setDialogState({ type: null, data: null });
      setNewItemValue("");
      loadData();
    } catch (error) {
      toast.error(`Failed to create ${title.toLowerCase()}.`);
    }
  };

  const handleUpdate = async () => {
    if (!dialogState.data || !dialogState.data[dataKey]?.trim()) {
      setValidationError(`${dataKey} cannot be empty.`);
      return;
    }
    setValidationError("");
    try {
      await updateData({ id: dialogState.data.id, [dataKey]: dialogState.data[dataKey] });
      toast.success(`${title} updated successfully.`);
      setDialogState({ type: null, data: null });
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
              setNewItemValue("");
              setValidationError("");
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
            <div className="py-4">
              <Input
                placeholder={`Enter ${dataKey}`}
                value={newItemValue}
                onChange={(e) => {
                  setNewItemValue(e.target.value);
                  setValidationError("");
                }}
              />
              {validationError && (
                <p className="text-red-500 text-sm mt-1">{validationError}</p>
              )}
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="ghost"
                  onClick={() => setDialogState({ type: null, data: null })}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreate}>Create</Button>
              </div>
            </div>
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
                        setValidationError("");
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                            setDialogState({ type: "edit", data: item });
                            setValidationError(""); // Clear error on opening edit
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit {title}</DialogTitle>
                      </DialogHeader>
                      <div className="py-4">
                        <Input
                          placeholder={`Enter ${dataKey}`}
                          value={dialogState.data?.[dataKey] || ""}
                          onChange={(e) => {
                            setDialogState((prev) => ({
                              ...prev,
                              data: { ...prev.data, [dataKey]: e.target.value },
                            }));
                            setValidationError("");
                          }}
                        />
                        {validationError && (
                            <p className="text-red-500 text-sm mt-1">{validationError}</p>
                        )}
                        <div className="flex justify-end gap-2 mt-4">
                          <Button
                            variant="ghost"
                            onClick={() => setDialogState({ type: null, data: null })}
                          >
                            Cancel
                          </Button>
                          <Button onClick={handleUpdate}>Update</Button>
                        </div>
                      </div>
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
