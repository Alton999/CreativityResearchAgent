"use client";
import React, { useState } from "react";
import { SavedPaper as SavedPaperTypes } from "@/types";
import useResearchStore from "@/store/useResearchStore";
import Link from "next/link";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Loader2, ArrowLeft, Trash2 } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import axios from "axios";

const ResearchPaperSidebar = () => {
  const { prompt, removeSavedPaper } = useResearchStore();
  const [loading, setLoading] = useState(false);

  const deleteSavedPaper = async (
    savedPaperId: string,
    searchTermId: string,
  ) => {
    setLoading(true);
    await axios.post("/api/deleteSavedPaper", {
      savedPaperId,
      promptId: prompt?.id,
    });
    removeSavedPaper(searchTermId, savedPaperId);
    setLoading(false);
  };

  const hasValidPapers = (searchTerm: any) => {
    return (
      searchTerm.savedPapers &&
      Array.isArray(searchTerm.savedPapers) &&
      searchTerm.savedPapers.length > 0
    );
  };

  if (!prompt) return <div>Prompt not found.</div>;

  return (
    <Sheet>
      <SheetTrigger className="flex gap-4 px-2 hover:cursor-pointer">
        <ArrowLeft size={24} />
        See papers collected
      </SheetTrigger>
      {/* <ScrollArea> */}
      <SheetContent
        style={{ maxWidth: "60vw" }}
        side={"right"}
        className="overflow-auto"
      >
        <SheetHeader>
          <SheetTitle>Research papers</SheetTitle>
          <SheetDescription>
            These are the collected research papers. You can check them out and
            remove any papers you do not find interesting.
          </SheetDescription>
        </SheetHeader>
        {!prompt?.searchTerms ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : prompt.searchTerms.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            No search terms found. Start a search to collect papers.
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 mt-4">
            {prompt.searchTerms.map((searchTerm) => (
              <div key={`search-term-${searchTerm.id}`} className="mb-8">
                <h3 className="text-lg font-medium text-slate-600 mb-4">
                  Results for &quot;{searchTerm.searchTerm}&quot;
                </h3>

                <div className="grid gap-4">
                  {!hasValidPapers(searchTerm) ? (
                    <div
                      key={`no-papers-${searchTerm.id}`}
                      className="text-center py-4 text-slate-500"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="h-5 w-5 animate-spin mr-2" />
                          <span>Loading papers...</span>
                        </div>
                      ) : (
                        "No papers found for this search term"
                      )}
                    </div>
                  ) : (
                    searchTerm.savedPapers.map((paper: SavedPaperTypes) => (
                      <div
                        key={`paper-${paper.id}`}
                        className="group relative bg-white rounded-lg border border-slate-200 transition-all hover:border-slate-300 hover:shadow-sm"
                      >
                        <Link
                          href={paper.url}
                          className="block p-4 w-full overflow-x-hidden"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <h4 className="text-base font-semibold text-slate-900 mb-2">
                            {paper.title}
                          </h4>
                          <p className="text-sm text-slate-600 line-clamp-2">
                            {paper.summary}
                          </p>
                        </Link>

                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            disabled={loading}
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault();
                              deleteSavedPaper(paper.id, searchTerm.id);
                            }}
                            className="h-8 w-8 p-0"
                          >
                            {loading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4 text-slate-400 hover:text-red-400" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </SheetContent>
      {/* </ScrollArea> */}
    </Sheet>
  );
};

export default ResearchPaperSidebar;
