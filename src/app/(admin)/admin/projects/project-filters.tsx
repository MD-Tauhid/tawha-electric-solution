"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

const statusOptions = [
  { value: "", label: "All Status" },
  { value: "PLANNED", label: "Planned" },
  { value: "ONGOING", label: "Ongoing" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

export function ProjectFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = React.useState(searchParams.get("query") || "");
  const status = searchParams.get("status") || "";

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (status) params.set("status", status);
    params.set("page", "1");
    router.push(`/admin/projects?${params.toString()}`);
  }

  function handleStatusChange(value: string) {
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (value) params.set("status", value);
    params.set("page", "1");
    router.push(`/admin/projects?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSearch} className="flex flex-col gap-4 sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>
      <Select
        options={statusOptions}
        value={status}
        onChange={(e) => handleStatusChange(e.target.value)}
        className="w-full sm:w-48"
      />
      <Button type="submit" variant="secondary">
        Search
      </Button>
    </form>
  );
}
