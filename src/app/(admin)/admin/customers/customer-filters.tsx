"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

const customerTypeOptions = [
  { value: "", label: "All Types" },
  { value: "RESIDENTIAL", label: "Residential" },
  { value: "COMMERCIAL", label: "Commercial" },
  { value: "INDUSTRIAL", label: "Industrial" },
  { value: "RESTAURANT", label: "Restaurant" },
  { value: "OTHER", label: "Other" },
];

export function CustomerFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = React.useState(searchParams.get("query") || "");
  const type = searchParams.get("type") || "";

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (type) params.set("type", type);
    params.set("page", "1");
    router.push(`/admin/customers?${params.toString()}`);
  }

  function handleTypeChange(value: string) {
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (value) params.set("type", value);
    params.set("page", "1");
    router.push(`/admin/customers?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSearch} className="flex flex-col gap-4 sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search customers..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>
      <Select
        options={customerTypeOptions}
        value={type}
        onChange={(e) => handleTypeChange(e.target.value)}
        className="w-full sm:w-48"
      />
      <Button type="submit" variant="secondary">
        Search
      </Button>
    </form>
  );
}
