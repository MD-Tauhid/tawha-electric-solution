"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SheetContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SheetContext = React.createContext<SheetContextValue | undefined>(
  undefined
);

function useSheet() {
  const context = React.useContext(SheetContext);
  if (!context) {
    throw new Error("Sheet components must be used within a Sheet provider");
  }
  return context;
}

interface SheetProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function Sheet({ children, open: controlledOpen, onOpenChange }: SheetProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const open = controlledOpen ?? uncontrolledOpen;
  const onOpenChangeFn = onOpenChange ?? setUncontrolledOpen;

  return (
    <SheetContext.Provider value={{ open, onOpenChange: onOpenChangeFn }}>
      {children}
    </SheetContext.Provider>
  );
}

interface SheetTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const SheetTrigger = React.forwardRef<HTMLButtonElement, SheetTriggerProps>(
  ({ onClick, ...props }, ref) => {
    const { onOpenChange } = useSheet();
    return (
      <button
        ref={ref}
        onClick={(e) => {
          onClick?.(e);
          onOpenChange(true);
        }}
        {...props}
      />
    );
  }
);
SheetTrigger.displayName = "SheetTrigger";

interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: "left" | "right" | "top" | "bottom";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
  ({ className, children, side = "right", ...props }, ref) => {
    const { open, onOpenChange } = useSheet();

    React.useEffect(() => {
      if (open) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
      return () => {
        document.body.style.overflow = "";
      };
    }, [open]);

    React.useEffect(() => {
      function handleKeyDown(e: KeyboardEvent) {
        if (e.key === "Escape") {
          onOpenChange(false);
        }
      }
      if (open) {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
      }
    }, [open, onOpenChange]);

    if (!open) return null;

    const sideClasses = {
      left: "inset-y-0 left-0 h-full w-3/4 max-w-sm border-r",
      right: "inset-y-0 right-0 h-full w-3/4 max-w-sm border-l",
      top: "inset-x-0 top-0 border-b",
      bottom: "inset-x-0 bottom-0 border-t",
    };

    return (
      <div className="fixed inset-0 z-50">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/80 animate-in fade-in"
          onClick={() => onOpenChange(false)}
        />
        {/* Content */}
        <div
          ref={ref}
          className={cn(
            "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out",
            sideClasses[side],
            className
          )}
          {...props}
        >
          {children}
        </div>
      </div>
    );
  }
);
SheetContent.displayName = "SheetContent";

type SheetHeaderProps = React.HTMLAttributes<HTMLDivElement>;

function SheetHeader({ className, ...props }: SheetHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-2 text-center sm:text-left",
        className
      )}
      {...props}
    />
  );
}

type SheetTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

function SheetTitle({ className, ...props }: SheetTitleProps) {
  return (
    <h2
      className={cn("text-lg font-semibold text-foreground", className)}
      {...props}
    />
  );
}

function SheetClose({
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { onOpenChange } = useSheet();
  return (
    <button
      onClick={(e) => {
        onClick?.(e);
        onOpenChange(false);
      }}
      {...props}
    />
  );
}

export { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetClose };
