"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { deleteProposal } from "../actions";

interface DeleteProposalButtonProps {
  proposalId: string;
}

export function DeleteProposalButton({ proposalId }: DeleteProposalButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deleteProposal(proposalId);
      toast.success("Proposal deleted successfully");
      router.push("/admin/proposals");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete proposal"
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <ConfirmDialog
      title="Delete Proposal"
      description="Are you sure you want to delete this proposal? This action cannot be undone."
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
