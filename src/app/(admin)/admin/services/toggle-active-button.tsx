// "use client";

// import * as React from "react";
// import { toast } from "sonner";
// import { Button } from "@/components/ui/button";
// import { LoadingSpinner } from "@/components/shared/loading-spinner";
// import { toggleServiceActive } from "./actions";

// interface ToggleActiveButtonProps {
//   serviceId: string;
//   isActive: boolean;
// }

// export function ToggleActiveButton({
//   serviceId,
//   isActive,
// }: ToggleActiveButtonProps) {
//   const [isToggling, setIsToggling] = React.useState(false);

//   async function handleToggle() {
//     setIsToggling(true);
//     try {
//       await toggleServiceActive(serviceId);
//       toast.success(
//         isActive ? "Service deactivated" : "Service activated"
//       );
//     } catch (error) {
//       toast.error(
//         error instanceof Error ? error.message : "Failed to update service"
//       );
//     } finally {
//       setIsToggling(false);
//     }
//   }

//   return (
//     <Button
//       variant={isActive ? "default" : "secondary"}
//       size="sm"
//       onClick={handleToggle}
//       disabled={isToggling}
//       className="min-w-[70px]"
//     >
//       {isToggling ? (
//         <LoadingSpinner size="sm" />
//       ) : isActive ? (
//         "Active"
//       ) : (
//         "Inactive"
//       )}
//     </Button>
//   );
// }


"use client";

import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { cn } from "@/lib/utils";
import { toggleServiceActive } from "./actions";

interface ToggleActiveButtonProps {
  serviceId: string;
  isActive: boolean;
  serviceName?: string;
}

export function ToggleActiveButton({
  serviceId,
  isActive,
  serviceName = "this service",
}: ToggleActiveButtonProps) {
  const [isPending, startTransition] = React.useTransition();
  const [optimisticActive, setOptimisticActive] = React.useOptimistic(isActive);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const titleId = React.useId();
  const descId = React.useId();

  function runToggle() {
    startTransition(async () => {
      // Flip the UI immediately; it reverts automatically if the action throws
      setOptimisticActive(!isActive);
      try {
        await toggleServiceActive(serviceId);
        toast.success(isActive ? "Service deactivated" : "Service activated");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to update service"
        );
      }
    });
  }

  function handleClick() {
    // Only deactivation is disruptive, so only that needs confirmation
    if (isActive) setConfirmOpen(true);
    else runToggle();
  }

  function handleConfirm() {
    setConfirmOpen(false);
    runToggle();
  }

  const statusLabel = optimisticActive ? "Active" : "Inactive";
  const actionLabel = optimisticActive ? "Deactivate" : "Activate";

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={handleClick}
        disabled={isPending}
        aria-label={`${actionLabel} ${serviceName}`}
        className={cn(
          "group min-w-[112px] gap-2 border font-medium transition-all duration-200 active:scale-95",
          optimisticActive
            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive dark:text-emerald-400"
            : "border-transparent text-muted-foreground hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-400"
        )}
      >
        {isPending ? (
          <LoadingSpinner size="sm" />
        ) : (
          <>
            {/* Status dot, replaced by the power icon on hover/focus */}
            <span
              className={cn(
                "size-1.5 rounded-full transition-colors group-hover:hidden group-focus-visible:hidden",
                optimisticActive ? "bg-emerald-500" : "bg-muted-foreground/50"
              )}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="hidden group-hover:block group-focus-visible:block"
            >
              <path d="M12 2v10" />
              <path d="M18.4 6.6a9 9 0 1 1-12.77.04" />
            </svg>
            {/* Both labels share one grid cell, so the width never jumps */}
            <span className="grid place-items-center">
              <span className="col-start-1 row-start-1 transition-opacity group-hover:opacity-0 group-focus-visible:opacity-0">
                {statusLabel}
              </span>
              <span className="col-start-1 row-start-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                {actionLabel}
              </span>
            </span>
          </>
        )}
      </Button>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent
          role="alertdialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descId}
          className="max-w-md"
        >
          <DialogHeader>
            <DialogTitle id={titleId}>Deactivate service?</DialogTitle>
            <DialogDescription id={descId}>
              {serviceName} will no longer be available until it is activated
              again.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Deactivate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
