"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { deletePayment } from "../actions";

interface DeletePaymentButtonProps {
  paymentId: string;
  billId: string;
}

export function DeletePaymentButton({
  paymentId,
  billId,
}: DeletePaymentButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deletePayment(paymentId);
      toast.success("Payment deleted successfully");
      router.push(`/admin/bills/${billId}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete payment"
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <ConfirmDialog
      title="Delete Payment"
      description="Are you sure you want to delete this payment? This will update the bill status and cannot be undone."
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
