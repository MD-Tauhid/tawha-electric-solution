"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarContextValue {
  imageLoaded: boolean;
  setImageLoaded: (loaded: boolean) => void;
}

const AvatarContext = React.createContext<AvatarContextValue | undefined>(
  undefined
);

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  fallback?: string;
}

function Avatar({ className, fallback, children, ...props }: AvatarProps) {
  const [imageLoaded, setImageLoaded] = React.useState(false);

  return (
    <AvatarContext.Provider value={{ imageLoaded, setImageLoaded }}>
      <div
        className={cn(
          "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
          className
        )}
        {...props}
      >
        {children}
        {!imageLoaded && fallback && (
          <div className="flex h-full w-full items-center justify-center rounded-full bg-muted text-sm font-medium">
            {fallback}
          </div>
        )}
      </div>
    </AvatarContext.Provider>
  );
}

type AvatarImageProps = React.ImgHTMLAttributes<HTMLImageElement>;

function AvatarImage({ className, onLoad, ...props }: AvatarImageProps) {
  const context = React.useContext(AvatarContext);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt=""
      className={cn("aspect-square h-full w-full", className)}
      onLoad={(e) => {
        context?.setImageLoaded(true);
        onLoad?.(e);
      }}
      {...props}
    />
  );
}

type AvatarFallbackProps = React.HTMLAttributes<HTMLDivElement>;

function AvatarFallback({ className, ...props }: AvatarFallbackProps) {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-muted text-sm font-medium",
        className
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback };
