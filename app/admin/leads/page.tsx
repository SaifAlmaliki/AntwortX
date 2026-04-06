import { Suspense } from "react";
import { AdminLeadsClient } from "./admin-leads-client";
import { Skeleton } from "@/components/ui/skeleton";

function LeadsPageFallback() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-48 bg-zinc-800" />
        <Skeleton className="mt-2 h-4 w-96 max-w-full bg-zinc-800" />
      </div>
      <Skeleton className="h-24 w-full bg-zinc-800" />
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full bg-zinc-800" />
        ))}
      </div>
    </div>
  );
}

export default function AdminLeadsPage() {
  return (
    <Suspense fallback={<LeadsPageFallback />}>
      <AdminLeadsClient />
    </Suspense>
  );
}
