"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";

interface FiltersBarProps {
  status: string;
  grade: string;
  search: string;
  dateFrom: string;
  dateTo: string;
  minScore: string;
  maxScore: string;
  onFilterChange: (filters: Record<string, string>) => void;
}

export function FiltersBar({
  status,
  grade,
  search,
  dateFrom,
  dateTo,
  minScore,
  maxScore,
  onFilterChange,
}: FiltersBarProps) {
  const [localSearch, setLocalSearch] = useState(search);

  const handleSearch = () => {
    onFilterChange({ status, grade, search: localSearch, dateFrom, dateTo, minScore, maxScore });
  };

  const handleClear = () => {
    setLocalSearch("");
    onFilterChange({ status: "", grade: "", search: "", dateFrom: "", dateTo: "", minScore: "", maxScore: "" });
  };

  const hasFilters = status || grade || search || dateFrom || dateTo || minScore || maxScore;

  return (
    <div className="space-y-3 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input
            placeholder="Search email, URL, company..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="bg-zinc-800 border-zinc-700 pl-9 text-sm text-zinc-100 placeholder:text-zinc-500"
          />
        </div>

        <Select value={status} onValueChange={(v) => onFilterChange({ status: v === "all" ? "" : v, grade, search: localSearch, dateFrom, dateTo, minScore, maxScore })}>
          <SelectTrigger className="w-[140px] bg-zinc-800 border-zinc-700 text-sm text-zinc-100">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 border-zinc-700">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={grade} onValueChange={(v) => onFilterChange({ status, grade: v === "all" ? "" : v, search: localSearch, dateFrom, dateTo, minScore, maxScore })}>
          <SelectTrigger className="w-[130px] bg-zinc-800 border-zinc-700 text-sm text-zinc-100">
            <SelectValue placeholder="Grade" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 border-zinc-700">
            <SelectItem value="all">All Grades</SelectItem>
            <SelectItem value="Excellent">Excellent</SelectItem>
            <SelectItem value="Good">Good</SelectItem>
            <SelectItem value="Fair">Fair</SelectItem>
            <SelectItem value="Poor">Poor</SelectItem>
            <SelectItem value="Critical">Critical</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="date"
          value={dateFrom}
          onChange={(e) => onFilterChange({ status, grade, search: localSearch, dateFrom: e.target.value, dateTo, minScore, maxScore })}
          className="w-[150px] bg-zinc-800 border-zinc-700 text-sm text-zinc-100"
          placeholder="From"
        />

        <Input
          type="date"
          value={dateTo}
          onChange={(e) => onFilterChange({ status, grade, search: localSearch, dateFrom, dateTo: e.target.value, minScore, maxScore })}
          className="w-[150px] bg-zinc-800 border-zinc-700 text-sm text-zinc-100"
          placeholder="To"
        />

        <Input
          type="number"
          placeholder="Min score"
          value={minScore}
          onChange={(e) => onFilterChange({ status, grade, search: localSearch, dateFrom, dateTo, minScore: e.target.value, maxScore })}
          className="w-[100px] bg-zinc-800 border-zinc-700 text-sm text-zinc-100"
          min={0}
          max={100}
        />

        <Input
          type="number"
          placeholder="Max score"
          value={maxScore}
          onChange={(e) => onFilterChange({ status, grade, search: localSearch, dateFrom, dateTo, minScore, maxScore: e.target.value })}
          className="w-[100px] bg-zinc-800 border-zinc-700 text-sm text-zinc-100"
          min={0}
          max={100}
        />

        <Button onClick={handleSearch} size="sm" className="text-sm">
          Apply
        </Button>

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={handleClear} className="text-zinc-400">
            <X className="mr-1 h-3 w-3" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
