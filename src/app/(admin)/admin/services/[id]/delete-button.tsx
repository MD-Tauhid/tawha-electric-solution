"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { deleteService } from "../actions";

interface DeleteServiceButtonProps {
  serviceId: string;
}

export function DeleteServiceButton({ serviceId }: DeleteServiceButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deleteService(serviceId);
      toast.success("Service deleted successfully");
      router.push("/admin/services");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete service"
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <ConfirmDialog
      title="Delete Service"
      description="Are you sure you want to delete this service? This action cannot be undone."
      confirmText="Delete"
      onConfirm={handleDelete}
    >
      <Button variant="destructive" size="sm" disabled={isDeleting}>
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </Button>
    </ConfirmDialog>
  );
}
