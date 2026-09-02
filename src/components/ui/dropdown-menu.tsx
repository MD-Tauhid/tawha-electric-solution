"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface DropdownMenuContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const DropdownMenuContext = React.createContext<
  DropdownMenuContextValue | undefined
>(undefined);

function useDropdownMenu() {
  const context = React.useContext(DropdownMenuContext);
  if (!context) {
    throw new Error(
      "DropdownMenu components must be used within a DropdownMenu provider"
    );
  }
  return context;
}

interface DropdownMenuProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function DropdownMenu({
  children,
  open: controlledOpen,
  onOpenChange,
}: DropdownMenuProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const open = controlledOpen ?? uncontrolledOpen;
  const onOpenChangeFn = onOpenChange ?? setUncontrolledOpen;
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  return (
    <DropdownMenuContext.Provider
      value={{ open, onOpenChange: onOpenChangeFn, triggerRef }}
    >
      <div className="relative inline-block">{children}</div>
    </DropdownMenuContext.Provider>
  );
}

interface DropdownMenuTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const DropdownMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  DropdownMenuTriggerProps
>(({ onClick, asChild, children, ...props }, ref) => {
  const { open, onOpenChange, triggerRef } = useDropdownMenu();

  const mergedRef = React.useCallback(
    (node: HTMLButtonElement | null) => {
      (triggerRef as React.MutableRefObject<HTMLButtonElement | null>).current =
        node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref, triggerRef]
  );

  if (asChild && React.isValidElement(children)) {
    const childProps = (children.props || {}) as Record<string, unknown>;
    return React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
      ref: mergedRef,
      onClick: (e: React.MouseEvent) => {
        if (typeof childProps.onClick === "function") {
          (childProps.onClick as React.MouseEventHandler)(e);
        }
        onOpenChange(!open);
      },
      "aria-expanded": open,
      "aria-haspopup": "menu",
    });
  }

  return (
    <button
      ref={mergedRef}
      aria-expanded={open}
      aria-haspopup="menu"
      onClick={(e) => {
        onClick?.(e);
        onOpenChange(!open);
      }}
      {...props}
    >
      {children}
    </button>
  );
});
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

interface DropdownMenuContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "center" | "end";
  sideOffset?: number;
}

const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  DropdownMenuContentProps
>(({ className, align = "end", sideOffset = 4, children, ...props }, ref) => {
  const { open, onOpenChange, triggerRef } = useDropdownMenu();
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        contentRef.current &&
        !contentRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        onOpenChange(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [open, onOpenChange, triggerRef]);

  if (!open) return null;

  const alignClasses = {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0",
  };

  return (
    <div
      ref={(node) => {
        (contentRef as React.MutableRefObject<HTMLDivElement | null>).current =
          node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      role="menu"
      className={cn(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        `mt-${sideOffset}`,
        alignClasses[align],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
DropdownMenuContent.displayName = "DropdownMenuContent";

interface DropdownMenuItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  inset?: boolean;
}

const DropdownMenuItem = React.forwardRef<
  HTMLButtonElement,
  DropdownMenuItemProps
>(({ className, inset, onClick, ...props }, ref) => {
  const { onOpenChange } = useDropdownMenu();
  return (
    <button
      ref={ref}
      role="menuitem"
      className={cn(
        "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",
        inset && "pl-8",
        className
      )}
      onClick={(e) => {
        onClick?.(e);
        onOpenChange(false);
      }}
      {...props}
    />
  );
});
DropdownMenuItem.displayName = "DropdownMenuItem";

function DropdownMenuSeparator({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="separator"
      className={cn("-mx-1 my-1 h-px bg-muted", className)}
      {...props}
    />
  );
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { inset?: boolean }) {
  return (
    <div
      className={cn(
        "px-2 py-1.5 text-sm font-semibold",
        inset && "pl-8",
        className
      )}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
};
