"use client";
import React, { useState } from "react";
import { SavedPaper as SavedPaperTypes } from "@/types";

import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from "@/components/ui/sheet";
import { Loader2, Menu, Trash2 } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { prisma } from "@/lib/db";
import axios from "axios";

type Props = {
	savedPapers: SavedPaperTypes[];
	promptId: string;
};

const ResearchPaperSidebar = ({ savedPapers, promptId }: Props) => {
	const [loading, setLoading] = useState(false);
	const deleteSavedPaper = async (savedPaperId: string) => {
		setLoading(true);
		const response = await axios.post("/api/deleteSavedPaper", {
			savedPaperId,
			promptId
		});
		setSavedPaperState(response.data.savedPapers);
		setLoading(false);
	};
	const [savedPaperState, setSavedPaperState] =
		useState<SavedPaperTypes[]>(savedPapers);
	return (
		<div className="flex w-full justify-end px-4 py-8">
			<Sheet>
				<SheetTrigger className="flex gap-4 py-2 border border-primary px-4 rounded-xl">
					See collected papers
					<Menu size={24} />
				</SheetTrigger>
				<ScrollArea>
					<SheetContent
						style={{ maxWidth: "60vw" }}
						side={"right"}
						className="overflow-auto"
					>
						<SheetHeader>
							<SheetTitle>Research papers</SheetTitle>
							<SheetDescription>
								These are the collected research papers. You can check them out
								and remove any papers you do not find interesting.
							</SheetDescription>
						</SheetHeader>
						<div className="grid gap-4 grid-cols-1 mt-4">
							{savedPaperState.map((paper) => (
								<div
									key={paper.id}
									className="px-4 py-2 border border-slate-400 rounded-xl space-y-2"
								>
									<div className="flex justify-between gap-4">
										<h4 className="text-lg font-bold">{paper.title}</h4>
										<Button
											disabled={loading}
											variant={"outline"}
											onClick={() => deleteSavedPaper(paper.id)}
										>
											{loading ? (
												<Loader2 className="h-6 w-6 animate-spin" />
											) : (
												<Trash2 size={20} />
											)}
										</Button>
									</div>
									<p>{paper.summary.slice(0, 200) + "..."}</p>
								</div>
							))}
						</div>
					</SheetContent>
				</ScrollArea>
			</Sheet>
		</div>
	);
};

export default ResearchPaperSidebar;
