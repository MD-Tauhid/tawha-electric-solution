"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface CollapsibleContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CollapsibleContext = React.createContext<
  CollapsibleContextValue | undefined
>(undefined);

interface CollapsibleProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function Collapsible({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
  ...props
}: CollapsibleProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const open = controlledOpen ?? uncontrolledOpen;
  const onOpenChangeFn = onOpenChange ?? setUncontrolledOpen;

  return (
    <CollapsibleContext.Provider value={{ open, onOpenChange: onOpenChangeFn }}>
      <div {...props}>{children}</div>
    </CollapsibleContext.Provider>
  );
}

function CollapsibleTrigger({
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { open, onOpenChange } = React.useContext(CollapsibleContext)!;
  return (
    <button
      aria-expanded={open}
      onClick={(e) => {
        onClick?.(e);
        onOpenChange(!open);
      }}
      {...props}
    />
  );
}

type CollapsibleContentProps = React.HTMLAttributes<HTMLDivElement>;

function CollapsibleContent({
  className,
  children,
  ...props
}: CollapsibleContentProps) {
  const { open } = React.useContext(CollapsibleContext)!;

  if (!open) return null;

  return (
    <div
      className={cn("animate-in slide-in-from-top-1", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
