"use client";

import * as React from "react";
import { toast } from "sonner";
import { updateProjectStatus } from "../actions";

const statusOptions = [
  { value: "PLANNED", label: "Planned" },
  { value: "ONGOING", label: "Ongoing" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
] as const;

interface StatusUpdateButtonProps {
  projectId: string;
  currentStatus: "PLANNED" | "ONGOING" | "COMPLETED" | "CANCELLED";
}

export function StatusUpdateButton({
  projectId,
  currentStatus,
}: StatusUpdateButtonProps) {
  const [isUpdating, setIsUpdating] = React.useState(false);

  async function handleStatusChange(
    e: React.ChangeEvent<HTMLSelectElement>
  ) {
    const newStatus = e.target.value as typeof currentStatus;
    if (newStatus === currentStatus) return;

    setIsUpdating(true);
    try {
      await updateProjectStatus(projectId, newStatus);
      toast.success("Project status updated");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update status"
      );
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <select
      value={currentStatus}
      onChange={handleStatusChange}
      disabled={isUpdating}
      className="h-7 rounded-md border border-input bg-transparent px-2 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
    >
      {statusOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
