"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { deleteProject } from "../actions";

interface DeleteProjectButtonProps {
  projectId: string;
}

export function DeleteProjectButton({ projectId }: DeleteProjectButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deleteProject(projectId);
      toast.success("Project deleted successfully");
      router.push("/admin/projects");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete project"
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <ConfirmDialog
      title="Delete Project"
      description="Are you sure you want to delete this project? This action cannot be undone."
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
