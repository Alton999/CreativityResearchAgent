"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp, LoaderCircle } from "lucide-react";
import { z } from "zod";
import { feedbackSchema } from "@/schemas/feedback";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	SearchTerm as SearchTermType,
	SavedPaper as SavedPaperTypes
} from "@/types";

import useResearchStore from "@/store/useResearchStore";

type Input = z.infer<typeof feedbackSchema>;

type SearchTermProps = {
	searchTermId: string;
	index: number;
};
const SearchTerm = ({ searchTermId, index }: SearchTermProps) => {
	const { addSearchTerm, setSavedPapers, prompt } = useResearchStore();
	const isMounted = useRef(false);
	const apiCallInProgress = useRef(false);

	const searchTerm = prompt?.searchTerms.find(
		(searchTerm) => searchTerm.id === searchTermId
	);
	const [loadingPaperStatus, setLoadingPaperStatus] = useState<string>("");
	const [isOpen, setIsOpen] = useState(false);
	const [feedbackLoading, setFeedbackLoading] = useState(false);
	const [expandedAbstractId, setExpandedAbstractId] = useState<string | null>(
		null
	);
	const [error, setError] = useState<string | null>(null);
	const [feedback, setFeedback] = useState<string>("");
	const [fetchAttempted, setFetchAttempted] = useState(false);

	const toggleAbstract = (paperId: string) => {
		setExpandedAbstractId((prevId) => (prevId === paperId ? null : paperId));
	};
	const generateNewSearchTerm = async () => {
		if (feedback === "") {
			setError("Feedback cannot be empty");
			return;
		}
		setFeedbackLoading(true);
		const response = await axios.post("/api/aiFeedback/searchTerms", {
			feedback,
			searchTerm
		});
		if (!response.data.searchTermInstance) {
			setError(
				"Error generating new search term, please refresh and try again."
			);
			setFeedbackLoading(false);
			return;
		}
		setFeedbackLoading(false);
		setFeedback("");
		setError(null);
		setIsOpen(false);
		addSearchTerm(response.data.searchTermInstance);
	};

	const getAndSetPapers = async () => {
		// Guard clauses to prevent duplicate calls
		if (!searchTerm) return;
		if (apiCallInProgress.current) return;
		if (searchTerm.savedPapers && searchTerm.savedPapers.length > 0) return;

		try {
			apiCallInProgress.current = true;
			setLoadingPaperStatus("loading");

			const response = await axios.post("/api/getResearchFromSearchTerms", {
				searchTerm,
				index
			});

			if (response.data.allPapers) {
				setSavedPapers(searchTerm.id, response.data.allPapers);
			}
		} catch (err: any) {
			setError(err?.response?.data?.error || "Failed to fetch research papers");
		} finally {
			setLoadingPaperStatus("done");
			apiCallInProgress.current = false;
		}
	};
	useEffect(() => {
		// Only run on mount
		if (!isMounted.current) {
			isMounted.current = true;
			getAndSetPapers();
		}

		// Cleanup function
		return () => {
			apiCallInProgress.current = false;
		};
	}, []);

	if (!searchTerm) return <div>Error loading in search term.</div>;
	return (
		<div id={searchTerm.id}>
			<motion.div className="border text-card-foreground p-8 rounded-xl">
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
					<p>{searchTerm.explanation}</p>
				</div>

				{searchTerm.savedPapers && (
					<motion.div>
						<h4 className="text-lg font-bold my-5">Saved papers</h4>
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
							searchTerm.savedPapers.length > 0 && (
								<ul className="w-full flex flex-col gap-4">
									{searchTerm.savedPapers.map((paper, index) => (
										<li
											key={`${paper.id}-${index}`}
											className="w-full p-4 border border-gray-400 rounded-lg space-y-3"
										>
											<h4 className="text-lg font-bold">{paper.title}</h4>
											<div>
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
																	// key="less"
																	initial={{ opacity: 0, y: -20 }}
																	animate={{ opacity: 1, y: 0 }}
																	exit={{ opacity: 0, y: 20 }}
																	transition={{ duration: 0.2 }}
																	className="flex items-center"
																>
																	Show Less{" "}
																	<ChevronUp className="ml-2 h-4 w-4" />
																</motion.div>
															) : (
																<motion.div
																	// key="more"
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
											</div>
											<div>
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
											</div>
											{paper.publishedYear !== 0 && (
												<div>
													<p>Year published: {paper.publishedYear}</p>
												</div>
											)}
										</li>
									))}
								</ul>
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
					<AnimatePresence>
						{error && (
							<motion.div
								className="px-4 py-2"
								initial={{ opacity: 0, x: -50 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: 50 }}
								transition={{ duration: 0.5, ease: "easeOut" }}
							>
								<p className="text-red-500 font-bold text-lg">{error}</p>
							</motion.div>
						)}
					</AnimatePresence>
				</motion.div>
			</motion.div>
		</div>
	);
};

export default SearchTerm;
