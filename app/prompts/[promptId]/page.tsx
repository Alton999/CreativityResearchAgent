// "use client";

// Page used for redirection to the correct page
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card";
import ResearchOutput from "@/components/ResearchOutput";
import axios from "axios";
import SearchTerm from "@/components/SearchTerm";
import FetchLoading from "@/components/FetchLoading";
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { prisma } from "@/lib/db";
import { PromptType } from "@/types";

type Props = {
	params: {
		promptId: string;
	};
};
// type PromptType = {
// 	id: string;
// 	userId: string;
// 	researchQuestion: string;
// 	researchField: string;
// 	createdAt: string;
// 	searchResultsSummary: string;
// 	searchTerms: {
// 		id: string;
// 		question: string;
// 		field: string;
// 		createdAt: string;
// 		promptId: string;
// 		searchTerm: string;
// 		explanation: string;
// 		newSearchTerm: boolean;
// 		parentId: string;
// 	}[];
// 	searchResults: {
// 		id: string;
// 		searchResult: string;
// 		createdAt: string;
// 		promptId: string;
// 		searchTermId: string;
// 	}[];
// 	hypothesisGeneration: {
// 		id: string;
// 		promptId: string;
// 		searchTermId: string;
// 		searchResultId: string;
// 		hypothesis: string;
// 		createdAt: string;
// 	}[];
// 	hypothesisEvaluation: {
// 		id: string;
// 		promptId: string;
// 		searchTermId: string;
// 		searchResultId: string;
// 		hypothesisId: string;
// 		evaluation: string;
// 		createdAt: string;
// 	}[];
// 	reinitiator: {
// 		id: string;
// 		promptId: string;
// 		hypothesisId: string;
// 		searchTermId: string;
// 		searchResultId: string;
// 		hypothesisEvaluationId: string;
// 		reinitiation: string;
// 		createdAt: string;
// 	}[];
// };
const PromptResults = async ({ params: { promptId } }: Props) => {
	const prompt = await prisma.prompt.findUnique({
		where: {
			id: promptId
		},
		include: {
			searchTerms: true,
			hypothesisGeneration: true,
			Reinitiator: true
		}
	});
	// const [prompt, setPrompt] = useState<PromptType>({
	// 	id: "",
	// 	userId: "",
	// 	researchQuestion: "",
	// 	researchField: "",
	// 	createdAt: "",
	// 	searchResultsSummary: "",
	// 	searchTerms: [],
	// 	searchResults: [],
	// 	hypothesisGeneration: [],
	// 	hypothesisEvaluation: [],
	// 	reinitiator: []
	// });
	// const [searchTerms, setSearchTerms] = useState<PromptType["searchTerms"]>([]);
	// const [selectedSearchTerms, setSelectedSearchTerms] = useState<
	// 	PromptType["searchTerms"]
	// >([]);

	// // Button active states
	// const [
	// 	generateSearchSummaryButtonActive,
	// 	setGenerateSearchSummaryButtonActive
	// ] = useState<Boolean>(false);
	// const [generateHypothesisButtonActive, setGenerateHypothesisButtonActive] =
	// 	useState<Boolean>(false);
	// const [
	// 	hypothesisEvaluationButtonActive,
	// 	setHypothesisEvaluationButtonActive
	// ] = useState<Boolean>(false);
	// // Editable states
	// const [searchResultsEditable, setSearchResultsEditable] =
	// 	useState<Boolean>(false);
	// const [initialHypothesisEditable, setInitialHypothesisEditable] =
	// 	useState<Boolean>(false);

	// // Results states
	// const [searchResults, setSearchResults] = useState<
	// 	PromptType["searchResultsSummary"] | null
	// >(null);
	// const [hypothesisGeneration, setHypothesisGeneration] = useState<
	// 	PromptType["hypothesisGeneration"][0] | null
	// >(null);
	// const [hypothesisEvaluation, setHypothesisEvaluation] = useState<
	// 	PromptType["hypothesisEvaluation"][0] | null
	// >();
	// const [reinitiation, setReinitiation] = useState<
	// 	PromptType["reinitiator"][0] | null
	// >();

	// // Loading states
	// const [searchResultsSummaryLoading, setSearchResultsSummaryLoading] =
	// 	useState<boolean>(false);
	// const [searchSummaryEditLoading, setSearchSummaryEditLoading] =
	// 	useState<boolean>(false);
	// const [hypothesisGenerationLoading, setHypothesisGenerationLoading] =
	// 	useState<boolean>(false);
	// const [hypothesisGenerationEditLoading, setHypothesisGenerationEditLoading] =
	// 	useState<boolean>(false);
	// const [hypothesisEvaluationLoading, setHypothesisEvaluationLoading] =
	// 	useState<boolean>(false);

	// const handleSearchTermSelection = (
	// 	searchTerm: PromptType["searchTerms"][0]
	// ) => {
	// 	setSelectedSearchTerms((prevSelectedSearchTerms) => {
	// 		if (prevSelectedSearchTerms.some((term) => term.id === searchTerm.id)) {
	// 			// If the search term is already selected, remove it from the array
	// 			return prevSelectedSearchTerms.filter(
	// 				(term) => term.id !== searchTerm.id
	// 			);
	// 		} else if (prevSelectedSearchTerms.length < 3) {
	// 			// If the search term is not selected and the limit is not reached, add it to the array
	// 			return [...prevSelectedSearchTerms, searchTerm];
	// 		} else {
	// 			// If the limit is already reached, return the previous state without adding the search term
	// 			return prevSelectedSearchTerms;
	// 		}
	// 	});
	// };

	// const addNewSearchTerm = (newSearchTerm: PromptType["searchTerms"][0]) => {
	// 	setSearchTerms((prevSearchTerms) => [...prevSearchTerms, newSearchTerm]);
	// };

	// // Initial fetch for the prompt
	// useEffect(() => {
	// 	const fetchPrompt = async () => {
	// 		const response = await axios.get(`/api/fetch/getPrompt`, {
	// 			params: { promptId }
	// 		});
	// 		console.log("Response from fetch prompt:", response);
	// 		setPrompt(response.data);
	// 		// Can I create a check here to see what data is available within the prompt instance? If it exists or not empty string we can add it directly to local state and populate the UI
	// 		setSearchTerms(response.data.searchTerms);
	// 		if (response.data.searchResultsSummary !== "") {
	// 			setGenerateSearchSummaryButtonActive(false);
	// 			setGenerateHypothesisButtonActive(true);
	// 			setSearchResults(response.data.searchResultsSummary);
	// 		}
	// 		if (response.data.hypothesisGeneration.length > 0) {
	// 			setGenerateHypothesisButtonActive(false);
	// 			setHypothesisEvaluationButtonActive(true);
	// 			// Get last item in the array
	// 			setHypothesisGeneration(
	// 				response.data.hypothesisGeneration[
	// 					response.data.hypothesisGeneration.length - 1
	// 				]
	// 			);
	// 		}
	// 	};
	// 	fetchPrompt();
	// }, [promptId]);

	// // Handle edit to search results summary
	// // TODO: Make this dynamic for all other types of edits
	// const handleSearchSummaryEdit = async () => {
	// 	setSearchResultsEditable(!searchResultsEditable);
	// 	setSearchSummaryEditLoading(true);
	// 	console.log("Edit search summary", searchResults);
	// 	console.log("Prompt id", prompt.id);

	// 	const response = await axios.post("/api/userEdits/searchSummaryEdit", {
	// 		promptId: prompt.id,
	// 		editedText: searchResults
	// 	});
	// 	setSearchSummaryEditLoading(false);
	// 	console.log(
	// 		"Search edit success",
	// 		response.data.editedPromptInstance.searchResultsSummary
	// 	);
	// };

	// const handleHypothesisEdit = async () => {
	// 	setInitialHypothesisEditable(!initialHypothesisEditable);
	// 	setHypothesisGenerationEditLoading(true);
	// 	console.log("Edit hypothesis", hypothesisGeneration);
	// 	console.log("Prompt id", prompt.id);
	// 	if (!hypothesisGeneration) return "No hypothesis to edit";
	// 	const response = await axios.post("/api/userEdits/hypothesisEdit", {
	// 		hypothesisId: hypothesisGeneration.id,
	// 		editedText: hypothesisGeneration.hypothesis
	// 	});
	// 	setHypothesisGenerationEditLoading(false);
	// 	console.log("Hypothesis edit success", response.data.hypothesis);
	// };

	// useEffect(() => {
	// 	if (selectedSearchTerms.length === 3) {
	// 		setGenerateSearchSummaryButtonActive(true);
	// 	} else {
	// 		setGenerateSearchSummaryButtonActive(false);
	// 	}
	// }, [selectedSearchTerms]);

	// const generateSearchResults = async () => {
	// 	console.log("Prompt search terms:", selectedSearchTerms);
	// 	setSearchResultsSummaryLoading(true);
	// 	const response = await axios.post("/api/generate/searchEngine", {
	// 		searchTermInstance: selectedSearchTerms
	// 	});
	// 	console.log("Response from generate search results: ", response);
	// 	setGenerateSearchSummaryButtonActive(false);
	// 	setSearchResults(response.data.searchResultsSummary);
	// };
	// // Generate initial hypothesis:
	// const generateInitialHypothesis = async () => {
	// 	console.log("Prompt search terms:", selectedSearchTerms);
	// 	setHypothesisGenerationLoading(true);
	// 	// We will need to pass in the search results summary in case its NULL from latest state
	// 	const response = await axios.post("/api/generate/hypothesisGenerator", {
	// 		promptInstance: prompt
	// 	});
	// 	console.log(
	// 		"Response from generate hypothesis: ",
	// 		response.data.hypothesisGeneration.hypothesis
	// 	);
	// 	setGenerateHypothesisButtonActive(false);
	// 	setHypothesisEvaluationButtonActive(true);
	// 	setHypothesisGeneration(response.data.hypothesisGeneration);
	// };

	// const generateHypothesisEvaluation = async () => {
	// 	console.log("Hypothesis evaluation started...");
	// 	console.log("Current hypothesis:", hypothesisGeneration);
	// 	setHypothesisEvaluationLoading(true);
	// 	const response = await axios.post("/api/generate/evaluator", {
	// 		hypothesisGenerationInstance: hypothesisGeneration
	// 	});
	// 	setHypothesisEvaluationLoading(false);
	// 	console.log("Response from evaluator agent", response.data);
	// 	setHypothesisEvaluation(response.data.hypothesisEvaluation);
	// };

	// useEffect(() => {
	//   const fetchHypothesisEvaluation = async () => {
	//     if (hypothesisGeneration) {
	//       console.log("Hypothesis generation:", hypothesisGeneration);
	//       const response = await axios.post("/api/generate/evaluator", {
	//         hypothesisGenerationInstance: hypothesisGeneration,
	//       });
	//       setHypothesisEvaluation(response.data.hypothesisEvaluation);
	//     }
	//   };

	//   fetchHypothesisEvaluation();
	// }, [hypothesisGeneration]);

	// useEffect(() => {
	//   const fetchReinitiation = async () => {
	//     if (hypothesisEvaluation) {
	//       console.log("hypothesisEvaluation from FE:", hypothesisEvaluation);
	//       const response = await axios.post("/api/generate/reinitiator", {
	//         hypothesisEvaluationInstance: hypothesisEvaluation,
	//       });
	//       setReinitiation(response.data.reinitiation);
	//     }
	//   };

	//   fetchReinitiation();
	// }, [hypothesisEvaluation]);
	if (!prompt) {
		return <div>Loading...</div>;
	}
	return (
		<section className="mt-24 flex flex-col items-center justify-center">
			<ScrollArea className="max-w-[1080px] mx-auto max-h-[90vh] overflow-auto">
				<Card className="mb-8">
					<CardHeader>
						<CardTitle className="leading-7">Research question</CardTitle>
						<CardDescription className="text-lg">
							{prompt ? prompt.researchQuestion : "Loading prompt..."}
						</CardDescription>
					</CardHeader>
					{/*  
					<CardContent className="space-y-8">
						<Card>
							<CardHeader>
								<CardTitle>Search terms</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="mb-3">
									Selected search terms for summary:{" "}
									{selectedSearchTerms.length}/3
								</p>
								{prompt ? (
									<div className="space-y-4">
										{searchTerms.map((searchTerm, index: Number) => (
											<SearchTerm
												key={`${searchTerm.id}`}
												searchTerm={searchTerm}
												addNewSearchTerm={addNewSearchTerm}
												selectedSearchTerms={selectedSearchTerms}
												handleSearchTermSelection={handleSearchTermSelection}
											/>
										))}
										<Button
											variant={
												generateSearchSummaryButtonActive
													? "default"
													: "outline"
											}
											disabled={!generateSearchSummaryButtonActive}
											className="w-full"
											onClick={() => generateSearchResults()}
										>
											Generate search summary
										</Button>
									</div>
								) : (
									<FetchLoading />
								)}
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>Search results summary</CardTitle>
							</CardHeader>
							<CardContent>
								{searchResults ? (
									<div className="w-full">
										{searchResultsEditable ? (
											<div>
												<textarea
													value={searchResults}
													onChange={(e) => setSearchResults(e.target.value)}
													className="w-full h-[800px] p-4 border border-gray-300 rounded-lg"
												/>
											</div>
										) : (
											<pre style={{ whiteSpace: "pre-wrap" }}>
												{searchResults}
											</pre>
										)}
										
										<div className="flex gap-8 mt-8">
											<Button
												variant={
													generateHypothesisButtonActive ||
													searchResultsEditable
														? "default"
														: "outline"
												}
												disabled={
													!generateHypothesisButtonActive ||
													!!searchResultsEditable
												}
												className="w-full"
												onClick={() => generateInitialHypothesis()}
											>
												Generate initial hypothesis
											</Button>
											<Button
												variant="outline"
												className="w-full"
												onClick={
													!searchResultsEditable
														? () =>
																setSearchResultsEditable(!searchResultsEditable)
														: () => handleSearchSummaryEdit()
												}
												disabled={searchSummaryEditLoading}
											>
												{searchSummaryEditLoading ? (
													<div className="flex items-center justify-center">
														<Loader2 className="mr-2 animate-spin" />
														<p>Edit loading...</p>
													</div>
												) : searchResultsEditable ? (
													"Save edit"
												) : (
													"Edit search summary"
												)}
											</Button>
										</div>
									</div>
								) : (
									<FetchLoading />
								)}
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>Initial hypothesis generation</CardTitle>
							</CardHeader>
							<CardContent>
								{hypothesisGeneration ? (
									<div className="w-full">
										{initialHypothesisEditable ? (
											<div>
												<textarea
													value={`${hypothesisGeneration.hypothesis}`}
													onChange={(e) =>
														setHypothesisGeneration({
															...hypothesisGeneration,
															hypothesis: e.target.value
														})
													}
													className="w-full h-[800px] p-4 border border-gray-300 rounded-lg"
												/>
											</div>
										) : (
											<pre style={{ whiteSpace: "pre-wrap" }}>
												{hypothesisGeneration.hypothesis}
											</pre>
										)}
										
										<div className="flex gap-8 mt-8">
											<Button
												variant={
													hypothesisEvaluationButtonActive ||
													initialHypothesisEditable
														? "default"
														: "outline"
												}
												disabled={
													!hypothesisEvaluationButtonActive ||
													!!initialHypothesisEditable
												}
												className="w-full"
												onClick={() => generateHypothesisEvaluation()}
											>
												{hypothesisEvaluationLoading ? (
													<Loader2 className="animate-spin" />
												) : (
													"Start hypothesis evaluation"
												)}
											</Button>
											<Button
												variant="outline"
												className="w-full"
												onClick={
													!initialHypothesisEditable
														? () =>
																setInitialHypothesisEditable(
																	!initialHypothesisEditable
																)
														: () => handleHypothesisEdit()
												}
												disabled={searchSummaryEditLoading}
											>
												{hypothesisGenerationEditLoading ? (
													<div className="flex items-center justify-center">
														<Loader2 className="mr-2 animate-spin" />
														<p>Edit loading...</p>
													</div>
												) : initialHypothesisEditable ? (
													"Save edit"
												) : (
													"Edit initial hypothesis document"
												)}
											</Button>
										</div>
									</div>
								) : (
									<FetchLoading />
								)}
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>Revised hypothesis</CardTitle>
							</CardHeader>
							<CardContent>
								{hypothesisEvaluation ? (
									<div className="w-full">
										<pre style={{ whiteSpace: "pre-wrap" }}>
											{hypothesisEvaluation.evaluation}
										</pre>
									</div>
								) : (
									<FetchLoading />
								)}
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>Reframed research</CardTitle>
							</CardHeader>
							<CardContent>
								{reinitiation ? (
									<div className="w-full">
										<pre style={{ whiteSpace: "pre-wrap" }}>
											{reinitiation.reinitiation}
										</pre>
									</div>
								) : (
									<FetchLoading />
								)}
							</CardContent>
						</Card>
					</CardContent>
			*/}
				</Card>
				<ResearchOutput prompt={prompt as unknown as PromptType} />
			</ScrollArea>
		</section>
	);
};

export default PromptResults;
