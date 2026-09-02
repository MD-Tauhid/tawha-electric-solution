"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { toggleServiceFeatured } from "./actions";

interface ToggleFeaturedButtonProps {
  serviceId: string;
  isFeatured: boolean;
}

export function ToggleFeaturedButton({
  serviceId,
  isFeatured,
}: ToggleFeaturedButtonProps) {
  const [isToggling, setIsToggling] = React.useState(false);

  async function handleToggle() {
    setIsToggling(true);
    try {
      await toggleServiceFeatured(serviceId);
      toast.success(
        isFeatured ? "Service unfeatured" : "Service featured"
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
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      disabled={isToggling}
      className={isFeatured ? "text-yellow-600" : "text-muted-foreground"}
    >
      {isToggling ? (
        <LoadingSpinner size="sm" />
      ) : (
        <Star className={`h-4 w-4 ${isFeatured ? "fill-current" : ""}`} />
      )}
    </Button>
  );
}
