"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderCircle } from "lucide-react";
import { z } from "zod";
import { feedbackSchema } from "@/schemas/feedback";
import axios from "axios";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SearchTerm as SearchTermType } from "@/types";
import { SavedPaper as SavedPaperTypes } from "@/types";
type Input = z.infer<typeof feedbackSchema>;

type SearchTermProps = {
	searchTerm: SearchTermType;
	addNewSearchTerm: (newSearchTerm: SearchTermType) => void;
	selectedSearchTerms: SearchTermType[];
	handleSearchTermSelection: (searchTerm: SearchTermType) => void;
};
const SearchTerm = ({
	searchTerm,
	addNewSearchTerm,
	selectedSearchTerms,
	handleSearchTermSelection
}: SearchTermProps) => {
	const [loadingPaperStatus, setLoadingPaperStatus] = useState<string>("");
	const [isOpen, setIsOpen] = useState(false);
	const [isSelected, setIsSelected] = useState(false);
	const [feedbackLoading, setFeedbackLoading] = useState(false);
	console.log("Search term", searchTerm);
	const [savedPapers, setSavedPapers] = useState(searchTerm.savedPapers);
	const className = `border text-card-foreground p-8 cursor-pointer rounded-xl ${
		isSelected ? "shadow-xl" : ""
	}`;
	const backgroundVariants = {
		selected: {
			border: "1px solid rgb(229, 231, 235)",
			boxShadow:
				"0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
		},
		unselected: { boxShadow: "none" }
	};
	const [feedback, setFeedback] = useState<string>("");
	useEffect(() => {
		const selected = selectedSearchTerms.some(
			(term) => term.id === searchTerm.id
		);
		setIsSelected(selected);
	}, [selectedSearchTerms, searchTerm]);

	const generateNewSearchTerm = async () => {
		if (feedback.length < 40) {
			alert("Please provide more feedback");
			return;
		}
		setFeedbackLoading(true);
		const response = await axios.post("/api/aiFeedback/searchTerms", {
			feedback,
			searchTerm
		});
		const newSearchTerm = response.data.searchTermInstance;
		setFeedbackLoading(false);
		setFeedback("");
		addNewSearchTerm(newSearchTerm);
	};
	// TODO Make this run in the background to allow seamless research experience
	const fetchResearchPaper = async () => {
		const response = await axios.post("/api/getResearchFromSearchTerms", {
			searchTerm
		});
		setSavedPapers(response.data.allPapers);
		console.log("Response from fetchResearchPaper: ", response);
	};
	useEffect(() => {
		if (!searchTerm.savedPapers) {
			setLoadingPaperStatus("done");
		}
	}, [searchTerm.savedPapers]);
	return (
		<div>
			<motion.div
				animate={isSelected ? "selected" : "unselected"}
				variants={backgroundVariants}
				transition={{ duration: 0.3 }}
				className={className}
				onClick={() => handleSearchTermSelection(searchTerm)}
			>
				<div className="space-y-4">
					<div className="w-full flex justify-between gap-8">
						<h4 className="text-lg font-bold flex flex-1">
							{searchTerm.searchTerm}
						</h4>
						{searchTerm.newSearchTerm ? (
							<div className=" px-4 bg-slate-300/20  rounded-lg h-10 flex items-center justify-center">
								<p>Regenerated term</p>
							</div>
						) : (
							<div className="px-4 bg-slate-300/20 rounded-lg h-10 flex items-center justify-center">
								<p>Original search term</p>
							</div>
						)}
					</div>
					<p>Reasoning: {searchTerm.explanation}</p>
				</div>
				<div className="w-full flex justify-end gap-4 my-2">
					{/* <Button onClick={() => fetchResearchPaper()}>Do search</Button> */}
					<Button onClick={() => setIsOpen(!isOpen)}>
						{isOpen ? "Close" : "Feedback"}
					</Button>
				</div>
				{savedPapers && (
					<motion.div>
						<h4 className="text-lg font-bold">Saved papers</h4>
						<div>
							{savedPapers.map((paper: SavedPaperTypes) => (
								<div key={paper.id} className="flex gap-4 items-center">
									<p>{paper.title}</p>
									<p>{paper.authors}</p>
								</div>
							))}
						</div>
					</motion.div>
				)}
			</motion.div>
			<motion.div
				initial={false}
				animate={{ height: isOpen ? "auto" : 0 }}
				className="w-full overflow-hidden"
			>
				<div className="w-full py-6 flex gap-4 border px-4 b-t-0">
					<Input
						value={feedback}
						onChange={(e) => setFeedback(e.target.value)}
					/>
					<Button onClick={generateNewSearchTerm}>
						{feedbackLoading ? (
							<LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
						) : (
							"Submit"
						)}
					</Button>
				</div>
			</motion.div>
		</div>
	);
};

export default SearchTerm;
