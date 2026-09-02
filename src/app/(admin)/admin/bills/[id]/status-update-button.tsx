"use client";

import * as React from "react";
import { toast } from "sonner";
import { updateBillStatus } from "../actions";

const statusOptions = [
  { value: "DRAFT", label: "Draft" },
  { value: "ISSUED", label: "Issued" },
  { value: "PARTIALLY_PAID", label: "Partially Paid" },
  { value: "PAID", label: "Paid" },
  { value: "CANCELLED", label: "Cancelled" },
] as const;

interface StatusUpdateButtonProps {
  billId: string;
  currentStatus:
    | "DRAFT"
    | "ISSUED"
    | "PARTIALLY_PAID"
    | "PAID"
    | "CANCELLED";
}

export function StatusUpdateButton({
  billId,
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
      await updateBillStatus(billId, newStatus);
      toast.success("Bill status updated");
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
