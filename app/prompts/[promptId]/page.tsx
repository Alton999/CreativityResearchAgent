"use client";

// Page used for redirection to the correct page
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card";
import axios from "axios";

import FetchLoading from "@/components/FetchLoading";
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

type Props = {
	params: {
		promptId: string;
	};
};
type PromptType = {
	id: string;
	userId: string;
	researchQuestion: string;
	researchField: string;
	createdAt: string;
	searchResultsSummary: string;
	searchTerms: {
		id: string;
		question: string;
		field: string;
		createdAt: string;
		promptId: string;
		searchTerm: string;
		explanation: string;
	}[];
	searchResults: {
		id: string;
		searchResult: string;
		createdAt: string;
		promptId: string;
		searchTermId: string;
	}[];
	hypothesisGeneration: {
		id: string;
		promptId: string;
		searchTermId: string;
		searchResultId: string;
		hypothesis: string;
		createdAt: string;
	}[];
	hypothesisEvaluation: {
		id: string;
		promptId: string;
		searchTermId: string;
		searchResultId: string;
		hypothesisId: string;
		evaluation: string;
		createdAt: string;
	}[];
	reinitiator: {
		id: string;
		promptId: string;
		hypothesisId: string;
		searchTermId: string;
		searchResultId: string;
		hypothesisEvaluationId: string;
		reinitiation: string;
		createdAt: string;
	}[];
};
const PromptResults = ({ params: { promptId } }: Props) => {
	const [prompt, setPrompt] = useState<PromptType>({
		id: "",
		userId: "",
		researchQuestion: "",
		researchField: "",
		createdAt: "",
		searchResultsSummary: "",
		searchTerms: [],
		searchResults: [],
		hypothesisGeneration: [],
		hypothesisEvaluation: [],
		reinitiator: []
	});
	const [searchResults, setSearchResults] = useState<
		PromptType["searchResults"][0] | null
	>(null);
	const [hypothesisGeneration, setHypothesisGeneration] = useState<
		PromptType["hypothesisGeneration"][0] | null
	>(null);
	const [hypothesisEvaluation, setHypothesisEvaluation] = useState<
		PromptType["hypothesisEvaluation"][0] | null
	>();
	const [reinitiation, setReinitiation] = useState<
		PromptType["reinitiator"][0] | null
	>();

	// Initial fetch for the prompt
	useEffect(() => {
		const fetchPrompt = async () => {
			const response = await axios.get(`/api/fetch/getPrompt`, {
				params: { promptId }
			});
			setPrompt(response.data);
			return response.data;
		};
		fetchPrompt();
	}, [promptId]);

	useEffect(() => {
		const fetchSearchResults = async () => {
			if (prompt && prompt.searchTerms.length > 0) {
				console.log("Prompt search terms:", prompt.searchTerms);
				const response = await axios.post("/api/generate/searchEngine", {
					searchTermInstance: prompt.searchTerms
				});
				console.log(response);
				setSearchResults(response.data.searchResultsSummary);
			}
		};
		fetchSearchResults();
	}, [prompt]);

	useEffect(() => {
		const fetchHypothesisGeneration = async () => {
			if (prompt.searchResultsSummary !== "") {
				const response = await axios.post("/api/generate/hypothesisGenerator", {
					promptInstance: prompt
				});
				setHypothesisGeneration(response.data.hypothesisGeneration);
			}
		};

		fetchHypothesisGeneration();
	}, [prompt.searchResultsSummary]);

	useEffect(() => {
		const fetchHypothesisEvaluation = async () => {
			if (hypothesisGeneration) {
				console.log("Hypothesis generation:", hypothesisGeneration);
				const response = await axios.post("/api/generate/evaluator", {
					hypothesisGenerationInstance: hypothesisGeneration
				});
				setHypothesisEvaluation(response.data.hypothesisEvaluation);
			}
		};

		fetchHypothesisEvaluation();
	}, [hypothesisGeneration]);

	useEffect(() => {
		const fetchReinitiation = async () => {
			if (hypothesisEvaluation) {
				console.log("hypothesisEvaluation from FE:", hypothesisEvaluation);
				const response = await axios.post("/api/generate/reinitiator", {
					hypothesisEvaluationInstance: hypothesisEvaluation
				});
				setReinitiation(response.data.reinitiation);
			}
		};

		fetchReinitiation();
	}, [hypothesisEvaluation]);
	if (!prompt) {
		return <div>Loading...</div>;
	}
	return (
		<section className="mt-24 flex flex-col items-center justify-center">
			<ScrollArea className="">
				<Card className="h-full w-[1080px] max-h-[90vh] overflow-y-auto">
					<CardHeader>
						<CardTitle className="leading-7">Research question</CardTitle>
						<CardDescription className="text-lg">
							{prompt ? prompt.researchQuestion : "Loading prompt..."}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-8">
						<Card>
							<CardHeader>
								<CardTitle>Search terms</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								{prompt ? (
									prompt.searchTerms.map((searchTerm, index: Number) => (
										<div key={`${searchTerm.id}`}>
											<pre
												className="font-bold text-lg"
												style={{ whiteSpace: "pre-wrap" }}
											>
												{searchTerm.searchTerm}
											</pre>
											<pre style={{ whiteSpace: "pre-wrap" }}>
												{searchTerm.explanation}
											</pre>
										</div>
									))
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
										<pre style={{ whiteSpace: "pre-wrap" }}>
											{prompt.searchResultsSummary}
										</pre>
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
										<pre style={{ whiteSpace: "pre-wrap" }}>
											{hypothesisGeneration.hypothesis}
										</pre>
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
				</Card>
			</ScrollArea>
		</section>
	);
};

export default PromptResults;
