"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { LeadActionsMenu } from "./lead-actions-menu";

interface Lead {
  id: string;
  email: string;
  company: string | null;
  websiteUrl: string;
  city: string | null;
  compositeScore: number | null;
  grade: string | null;
  status: string;
  pdfGenerated: boolean;
  createdAt: Date;
}

interface LeadsTableProps {
  page: number;
  status: string;
  grade: string;
  search: string;
  dateFrom: string;
  dateTo: string;
  minScore: string;
  maxScore: string;
  onPageChange: (page: number) => void;
  onRefresh: () => void;
}

const statusColors: Record<string, string> = {
  completed: "bg-green-500/10 text-green-400 border-green-500/20",
  processing: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  failed: "bg-red-500/10 text-red-400 border-red-500/20",
};

const gradeColors: Record<string, string> = {
  Excellent: "bg-green-500/10 text-green-400 border-green-500/20",
  Good: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Fair: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Poor: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  Critical: "bg-red-500/10 text-red-400 border-red-500/20",
};

export function LeadsTable({
  page,
  status,
  grade,
  search,
  dateFrom,
  dateTo,
  minScore,
  maxScore,
  onPageChange,
  onRefresh,
}: LeadsTableProps) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    if (status) params.set("status", status);
    if (grade) params.set("grade", grade);
    if (search) params.set("search", search);
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);
    if (minScore) params.set("minScore", minScore);
    if (maxScore) params.set("maxScore", maxScore);

    setLoading(true);
    fetch("/api/admin/leads?" + params.toString())
      .then((res) => res.json())
      .then((data) => {
        setLeads(data.leads);
        setTotalPages(data.pagination.totalPages);
        setTotal(data.pagination.total);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, status, grade, search, dateFrom, dateTo, minScore, maxScore]);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full bg-zinc-800" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="text-zinc-400">Company / Email</TableHead>
              <TableHead className="text-zinc-400">Website</TableHead>
              <TableHead className="text-zinc-400">Score</TableHead>
              <TableHead className="text-zinc-400">Grade</TableHead>
              <TableHead className="text-zinc-400">Status</TableHead>
              <TableHead className="text-zinc-400">Date</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id} className="border-zinc-800">
                <TableCell>
                  <Link href={"/admin/leads/" + lead.id} className="text-sm font-medium text-zinc-100 hover:underline">
                    {lead.company || lead.email}
                  </Link>
                  {lead.company && (
                    <p className="text-xs text-zinc-500 truncate max-w-[200px]">{lead.email}</p>
                  )}
                </TableCell>
                <TableCell>
                  <p className="text-sm text-zinc-300 truncate max-w-[200px]" title={lead.websiteUrl}>
                    {lead.websiteUrl}
                  </p>
                </TableCell>
                <TableCell>
                  {lead.compositeScore !== null ? (
                    <span className="text-sm font-semibold text-zinc-100">
                      {lead.compositeScore}/100
                    </span>
                  ) : (
                    <span className="text-xs text-zinc-600">N/A</span>
                  )}
                </TableCell>
                <TableCell>
                  {lead.grade ? (
                    <Badge variant="outline" className={cn("text-xs", gradeColors[lead.grade])}>
                      {lead.grade}
                    </Badge>
                  ) : (
                    <span className="text-xs text-zinc-600">N/A</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("text-xs", statusColors[lead.status] || "bg-zinc-800 text-zinc-400")}>
                    {lead.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-zinc-500">
                    {new Date(lead.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </TableCell>
                <TableCell>
                  <LeadActionsMenu
                    leadId={lead.id}
                    status={lead.status}
                    onAction={onRefresh}
                  />
                </TableCell>
              </TableRow>
            ))}
            {leads.length === 0 && (
              <TableRow className="border-zinc-800">
                <TableCell colSpan={7} className="text-center py-8 text-sm text-zinc-500">
                  No leads found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {leads.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-zinc-500">
            Showing {((page - 1) * 20) + 1}-{Math.min(page * 20, total)} of {total}
          </p>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => { e.preventDefault(); if (page > 1) onPageChange(page - 1); }}
                  className={cn("text-zinc-400", page <= 1 && "pointer-events-none opacity-50")}
                />
              </PaginationItem>
              {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                let pageNum = 0;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onPageChange(pageNum);
                      }}
                      isActive={page === pageNum}
                      className={
                        page === pageNum
                          ? "bg-zinc-800 text-zinc-100"
                          : "text-zinc-400 hover:text-zinc-100"
                      }
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              {totalPages > 5 && page < totalPages - 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => { e.preventDefault(); if (page < totalPages) onPageChange(page + 1); }}
                  className={cn("text-zinc-400", page >= totalPages && "pointer-events-none opacity-50")}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
