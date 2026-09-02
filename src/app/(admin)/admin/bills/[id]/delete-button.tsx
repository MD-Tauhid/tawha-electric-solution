"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { deleteBill } from "../actions";

interface DeleteBillButtonProps {
  billId: string;
}

export function DeleteBillButton({ billId }: DeleteBillButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deleteBill(billId);
      toast.success("Bill deleted successfully");
      router.push("/admin/bills");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete bill"
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <ConfirmDialog
      title="Delete Bill"
      description="Are you sure you want to delete this bill? This action cannot be undone."
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
