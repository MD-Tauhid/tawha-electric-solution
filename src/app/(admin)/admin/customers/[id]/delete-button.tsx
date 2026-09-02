"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { deleteCustomer } from "../actions";

interface DeleteCustomerButtonProps {
  customerId: string;
}

export function DeleteCustomerButton({ customerId }: DeleteCustomerButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deleteCustomer(customerId);
      toast.success("Customer deleted successfully");
      router.push("/admin/customers");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete customer"
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <ConfirmDialog
      title="Delete Customer"
      description="Are you sure you want to delete this customer? This action cannot be undone."
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
