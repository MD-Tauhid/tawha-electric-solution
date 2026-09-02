"use client";

import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { toggleServiceActive } from "./actions";

interface ToggleActiveButtonProps {
  serviceId: string;
  isActive: boolean;
}

export function ToggleActiveButton({
  serviceId,
  isActive,
}: ToggleActiveButtonProps) {
  const [isToggling, setIsToggling] = React.useState(false);

  async function handleToggle() {
    setIsToggling(true);
    try {
      await toggleServiceActive(serviceId);
      toast.success(
        isActive ? "Service deactivated" : "Service activated"
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update service"
      );
    } finally {
      setIsToggling(false);
    }
  }

  return (
    <Button
      variant={isActive ? "default" : "secondary"}
      size="sm"
      onClick={handleToggle}
      disabled={isToggling}
      className="min-w-[70px]"
    >
      {isToggling ? (
        <LoadingSpinner size="sm" />
      ) : isActive ? (
        "Active"
      ) : (
        "Inactive"
      )}
    </Button>
  );
}
