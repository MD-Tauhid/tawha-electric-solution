"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface ComboboxOption {
  value: string;
  label: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  /** id of the selected existing option ("" when custom text) */
  value: string;
  /** custom text typed by the user (used when value is "") */
  customText?: string;
  onChange: (next: { id: string; name: string }) => void;
  placeholder?: string;
  id?: string;
  invalid?: boolean;
}

export function Combobox({
  options,
  value,
  customText = "",
  onChange,
  placeholder,
  id,
  invalid,
}: ComboboxProps) {
  const selected = options.find((o) => o.value === value);
  const [query, setQuery] = React.useState(selected?.label ?? customText);
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const trimmed = query.trim();
  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(trimmed.toLowerCase())
  );
  const hasExact = options.some(
    (o) => o.label.toLowerCase() === trimmed.toLowerCase()
  );
  const showCreate = trimmed.length > 0 && !hasExact;
  const total = filtered.length + (showCreate ? 1 : 0);

  function pick(option: ComboboxOption) {
    setQuery(option.label);
    onChange({ id: option.value, name: option.label });
    setOpen(false);
  }

  function useCustom() {
    onChange({ id: "", name: trimmed });
    setOpen(false);
  }

  function handleInput(text: string) {
    setQuery(text);
    setOpen(true);
    setActive(0);
    const exact = options.find(
      (o) => o.label.toLowerCase() === text.trim().toLowerCase()
    );
    // Exact match -> select the existing record, otherwise treat as new text
    onChange(exact ? { id: exact.value, name: exact.label } : { id: "", name: text.trim() });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((a) => Math.min(a + 1, total - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && open) {
      e.preventDefault(); // don't submit the form
      if (active < filtered.length) pick(filtered[active]);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      else if (showCreate) useCustom();
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={ref} className="relative">
      <Input
        id={id}
        value={query}
        placeholder={placeholder}
        autoComplete="off"
        aria-invalid={invalid}
        onChange={(e) => handleInput(e.target.value)}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
      />
      {open && total > 0 && (
        <ul className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 shadow-md bg-opacity-90 backdrop-blur-sm animate-in fade-in-80">
          {filtered.map((o, i) => (
            <li
              key={o.value}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => pick(o)}
              className={cn(
                "cursor-pointer rounded-sm px-2 py-1.5 text-sm",
                i === active && "bg-accent text-accent-foreground",
                o.value === value && "font-medium"
              )}
            >
              {o.label}
            </li>
          ))}
          {showCreate && (
            <li
              onMouseDown={(e) => e.preventDefault()}
              onClick={useCustom}
              className={cn(
                "cursor-pointer rounded-sm px-2 py-1.5 text-sm text-primary",
                active === filtered.length && "bg-accent"
              )}
            >
              Use “{trimmed}” as new
            </li>
          )}
        </ul>
      )}
    </div>
  );
}