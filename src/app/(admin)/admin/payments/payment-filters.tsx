"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

const methodOptions = [
  { value: "", label: "All Methods" },
  { value: "CASH", label: "Cash" },
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
  { value: "MOBILE_BANKING", label: "Mobile Banking" },
  { value: "CHEQUE", label: "Cheque" },
  { value: "OTHER", label: "Other" },
];

export function PaymentFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = React.useState(searchParams.get("query") || "");
  const currentMethod = searchParams.get("method") || "";

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (currentMethod) params.set("method", currentMethod);
    params.set("page", "1");
    router.push(`/admin/payments?${params.toString()}`);
  }

  function handleMethodChange(value: string) {
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (value) params.set("method", value);
    params.set("page", "1");
    router.push(`/admin/payments?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSearch} className="flex flex-col gap-4 sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search payments..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>
      <Select
        options={methodOptions}
        value={currentMethod}
        onChange={(e) => handleMethodChange(e.target.value)}
        className="w-full sm:w-48"
      />
      <Button type="submit" variant="secondary">
        Search
      </Button>
    </form>
  );
}
