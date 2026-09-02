"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

const statusOptions = [
  { value: "", label: "All Status" },
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

const featuredOptions = [
  { value: "", label: "All" },
  { value: "true", label: "Featured" },
  { value: "false", label: "Not Featured" },
];

export function ServiceFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = React.useState(searchParams.get("query") || "");
  const isActive = searchParams.get("isActive") || "";
  const isFeatured = searchParams.get("isFeatured") || "";

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (isActive) params.set("isActive", isActive);
    if (isFeatured) params.set("isFeatured", isFeatured);
    params.set("page", "1");
    router.push(`/admin/services?${params.toString()}`);
  }

  function handleFilterChange(key: string, value: string) {
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (isActive) params.set("isActive", isActive);
    if (isFeatured) params.set("isFeatured", isFeatured);
    params.set(key, value);
    params.set("page", "1");
    router.push(`/admin/services?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSearch} className="flex flex-col gap-4 sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search services..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>
      <Select
        options={statusOptions}
        value={isActive}
        onChange={(e) => handleFilterChange("isActive", e.target.value)}
        className="w-full sm:w-40"
      />
      <Select
        options={featuredOptions}
        value={isFeatured}
        onChange={(e) => handleFilterChange("isFeatured", e.target.value)}
        className="w-full sm:w-40"
      />
      <Button type="submit" variant="secondary">
        Search
      </Button>
    </form>
  );
}
