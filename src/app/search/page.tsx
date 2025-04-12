"use client";

import { useState, useEffect } from "react";
import Search from "../search";
import CollegeCard from "@/components/college-info-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { Loader2 } from "lucide-react";
import { SearchParams, College } from "@/lib/types";

interface ApiResponse {
  results: College[];
  error?: string;
}

export default function SearchPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchParams, setSearchParams] = useState<SearchParams>({
    paging: {
      page: 1,
      per_page: 100,
    },
  });

  const handleSearch = (params: SearchParams) => {
    setSearchParams(params);
  };

  const goToPage = (page: number) => {
    setSearchParams((prev) => ({
      ...prev,
      paging: {
        ...prev.paging,
        page,
      },
    }));
  };

  useEffect(() => {
    const fetchColleges = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/colleges", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(searchParams),
        });

        const data: ApiResponse = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch colleges");
        }

        setColleges(data.results);
      } catch (error) {
        console.error("Error fetching colleges:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchColleges();
  }, [searchParams]);

  return (
    <div className="flex flex-col h-screen">
      {/* Sticky Top Search */}
      <Search handleSearchProp={handleSearch} />

      {/* Scrollable Content */}
      <ScrollArea className="flex-1 overflow-y-auto border-b">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 p-4">
            {colleges.map((college, index) => (
              <CollegeCard key={index} college={college} />
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Sticky Bottom Pagination */}
      <div className="p-4 border-t">
        <Pagination className="flex justify-center">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() =>
                  goToPage(Math.max(1, searchParams.paging.page - 1))
                }
              />
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                onClick={() => goToPage(searchParams.paging.page + 1)}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
