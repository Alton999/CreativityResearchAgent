"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp, LoaderCircle } from "lucide-react";
import { z } from "zod";
import { feedbackSchema } from "@/schemas/feedback";
import axios from "axios";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SearchTerm as SearchTermType } from "@/types";
import { SavedPaper as SavedPaperTypes } from "@/types";
type Input = z.infer<typeof feedbackSchema>;

type SearchTermProps = {
	searchTerm: SearchTermType;
	addNewSearchTerm: (newSearchTerm: SearchTermType) => void;
	// selectedSearchTerms: SearchTermType[];
	// handleSearchTermSelection: (searchTerm: SearchTermType) => void;
	index: number;
};
const SearchTerm = ({
	searchTerm,
	addNewSearchTerm,
	// selectedSearchTerms,
	// handleSearchTermSelection,
	index
}: SearchTermProps) => {
	const [loadingPaperStatus, setLoadingPaperStatus] = useState<string>("");
	const [isOpen, setIsOpen] = useState(false);
	const [feedbackLoading, setFeedbackLoading] = useState(false);
	const [savedPapers, setSavedPapers] = useState<SavedPaperTypes[]>([]);

	const [expandedAbstractId, setExpandedAbstractId] = useState<string | null>(
		null
	);

	const toggleAbstract = (paperId: string) => {
		setExpandedAbstractId((prevId) => (prevId === paperId ? null : paperId));
	};

	const [feedback, setFeedback] = useState<string>("");

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
	useEffect(() => {
		const getAndSetPapers = async (index: number) => {
			setLoadingPaperStatus("loading");
			console.log("Loading");
			const response = await axios.post("/api/getResearchFromSearchTerms", {
				searchTerm,
				index
			});
			setSavedPapers(response.data.allPapers);
			console.log("Response from fetchResearchPaper: ", response);
			setLoadingPaperStatus("done");
		};
		getAndSetPapers(index);
	}, [index, searchTerm]);

	return (
		<div>
			<motion.div className="border text-card-foreground p-8 rounded-xl">
				<div className="space-y-4">
					<div className="w-full flex justify-between gap-8">
						<h4 className="text-xl font-bold flex flex-1">
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

				{savedPapers && (
					<motion.div>
						<h4 className="text-lg font-bold mb-2">Saved papers</h4>
						{
							// Check if loading
							loadingPaperStatus === "loading" && (
								<div className="w-full flex justify-between p-4 border border-gray-400 rounded-lg">
									<p>Loading research...</p>
									<LoaderCircle className="h-6 w-6 animate-spin" />
								</div>
							)
						}
						{
							// Check if there are saved papers
							savedPapers.length > 0 && (
								<div className="w-full flex flex-col gap-4">
									{savedPapers.map((paper) => (
										<div
											key={paper.id}
											className="w-full p-4 border border-gray-400 rounded-lg space-y-2"
										>
											<h4 className="text-lg font-bold">{paper.title}</h4>
											<motion.div
												key={paper.id}
												initial="collapsed"
												animate={
													expandedAbstractId === paper.id
														? "expanded"
														: "collapsed"
												}
												variants={{
													expanded: { height: "auto", opacity: 1 },
													collapsed: { height: "4.5em", opacity: 1 }
												}}
												transition={{
													duration: 0.3,
													ease: [0.04, 0.62, 0.23, 0.98]
												}}
												className="overflow-hidden"
											>
												{expandedAbstractId === paper.id
													? paper.summary
													: paper.summary.slice(0, 200) +
													  (paper.summary.length > 200 ? "..." : "")}
											</motion.div>
											{paper.summary.length > 200 && (
												<Button
													onClick={() => toggleAbstract(paper.id)}
													className="mt-2 flex items-center"
													variant="outline"
												>
													<AnimatePresence mode="wait" initial={false}>
														{expandedAbstractId === paper.id ? (
															<motion.div
																key="less"
																initial={{ opacity: 0, y: -20 }}
																animate={{ opacity: 1, y: 0 }}
																exit={{ opacity: 0, y: 20 }}
																transition={{ duration: 0.2 }}
																className="flex items-center"
															>
																Show Less <ChevronUp className="ml-2 h-4 w-4" />
															</motion.div>
														) : (
															<motion.div
																key="more"
																initial={{ opacity: 0, y: 20 }}
																animate={{ opacity: 1, y: 0 }}
																exit={{ opacity: 0, y: -20 }}
																transition={{ duration: 0.2 }}
																className="flex items-center"
															>
																Show More
																<ChevronDown className="ml-2 h-4 w-4" />
															</motion.div>
														)}
													</AnimatePresence>
												</Button>
											)}
											<div className="w-full flex justify-end">
												<a
													href={paper.url}
													target="_blank"
													className="text-blue-500 hover:underline"
												>
													View paper source
												</a>
											</div>
											{/* <div>
												<h4 className="font-bold">Authors</h4>
												<ul className="flex flex-wrap gap-3">
													{paper.authors.map((author, index) => (
														<li
															key={index + author}
															className="px-2 py-1 rounded-sm bg-gray-300"
														>
															{author}
														</li>
													))}
												</ul>
											</div> */}
										</div>
									))}
								</div>
							)
						}
					</motion.div>
				)}
				<div className="w-full flex justify-end gap-4 my-2">
					<Button onClick={() => setIsOpen(!isOpen)}>
						{isOpen ? "Close" : "Feedback"}
					</Button>
				</div>
				<motion.div
					initial={false}
					animate={{ height: isOpen ? "auto" : 0 }}
					className="w-full overflow-hidden b-t-0 border rounded-lg "
				>
					<div className="w-full py-6 flex gap-4  px-4 ">
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
			</motion.div>
		</div>
	);
};

export default SearchTerm;
