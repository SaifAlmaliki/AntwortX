"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LeadsTable } from "@/components/admin/leads-table";
import { FiltersBar } from "@/components/admin/filters-bar";

export function AdminLeadsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [refreshKey, setRefreshKey] = useState(0);

  const page = parseInt(searchParams.get("page") || "1");
  const status = searchParams.get("status") || "";
  const grade = searchParams.get("grade") || "";
  const search = searchParams.get("search") || "";
  const dateFrom = searchParams.get("dateFrom") || "";
  const dateTo = searchParams.get("dateTo") || "";
  const minScore = searchParams.get("minScore") || "";
  const maxScore = searchParams.get("maxScore") || "";

  const handleFilterChange = useCallback(
    (filters: Record<string, string>) => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });
      params.set("page", "1");
      router.push(`/admin/leads?${params.toString()}`);
    },
    [router]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", newPage.toString());
      router.push(`/admin/leads?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleRefresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Audit Leads</h1>
          <p className="mt-1 text-sm text-zinc-500">
            View and manage all submitted GEO audit requests
          </p>
        </div>
      </div>

      <FiltersBar
        status={status}
        grade={grade}
        search={search}
        dateFrom={dateFrom}
        dateTo={dateTo}
        minScore={minScore}
        maxScore={maxScore}
        onFilterChange={handleFilterChange}
      />

      <LeadsTable
        key={refreshKey}
        page={page}
        status={status}
        grade={grade}
        search={search}
        dateFrom={dateFrom}
        dateTo={dateTo}
        minScore={minScore}
        maxScore={maxScore}
        onPageChange={handlePageChange}
        onRefresh={handleRefresh}
      />
    </div>
  );
}
