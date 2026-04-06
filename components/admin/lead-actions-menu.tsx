"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, RefreshCw, Trash2, Code } from "lucide-react";
import { toast } from "sonner";

interface LeadActionsMenuProps {
  leadId: string;
  status: string;
  onAction: () => void;
}

export function LeadActionsMenu({ leadId, status, onAction }: LeadActionsMenuProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [rawOpen, setRawOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rawData, setRawData] = useState<string | null>(null);

  async function handleRerun() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/leads?action=rerun", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: leadId }),
      });
      if (res.ok) {
        toast.success("Lead queued for re-run");
        onAction();
      } else {
        toast.error("Failed to re-run lead");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Lead deleted");
        setDeleteOpen(false);
        onAction();
      } else {
        toast.error("Failed to delete lead");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  }

  async function handleViewRaw() {
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`);
      const data = await res.json();
      setRawData(JSON.stringify(data.lead, null, 2));
      setRawOpen(true);
    } catch {
      toast.error("Failed to fetch lead data");
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-zinc-800 border-zinc-700">
          {status === "failed" && (
            <DropdownMenuItem onClick={handleRerun} disabled={loading}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Re-run Audit
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={handleViewRaw}>
            <Code className="mr-2 h-4 w-4" />
            View Raw JSON
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-400 focus:text-red-400"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-zinc-100">Delete Lead</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              This action cannot be undone. The lead record and all associated data will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 border-zinc-700 text-zinc-300">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={rawOpen} onOpenChange={setRawOpen}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800 max-w-3xl max-h-[80vh]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-zinc-100">Raw Lead Data</AlertDialogTitle>
          </AlertDialogHeader>
          <pre className="overflow-auto max-h-[60vh] text-xs text-zinc-300 bg-zinc-950 p-4 rounded-md border border-zinc-800">
            {rawData || "Loading..."}
          </pre>
          <AlertDialogFooter>
            <AlertDialogAction className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100">
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
