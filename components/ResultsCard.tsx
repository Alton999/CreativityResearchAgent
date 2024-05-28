"use client";
import React, { useState, useEffect } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "./ui/card";
import axios from "axios";
import FetchLoading from "./FetchLoading";
import { PromptType } from "@/lib/types"; // Assuming types.ts is located in src/types.ts
import { Loader2 } from "lucide-react";

type Props = {
	prompt: PromptType;
};

const ResultsCard = ({ prompt }: Props) => {
	const [searchResults, setSearchResults] = useState<string | null>(
		prompt.searchResultsSummary
	);
	const [hypothesisGeneration, setHypothesisGeneration] = useState<
		PromptType["hypothesisGeneration"] | null
	>(null);
	const [hypothesisEvaluation, setHypothesisEvaluation] = useState<
		PromptType["hypothesisEvaluation"] | null
	>(null);
	const [reinitiation, setReinitiation] = useState<
		PromptType["Reinitiator"] | null
	>(null);

	// Loading states
	const [searchResultsLoading, setSearchResultsLoading] =
		useState<boolean>(false);
	const [hypothesisGenerationLoading, setHypothesisGenerationLoading] =
		useState<boolean>(false);
	const [hypothesisEvaluationLoading, setHypothesisEvaluationLoading] =
		useState<boolean>(false);
	const [reinitiationLoading, setReinitiationLoading] =
		useState<boolean>(false);

	useEffect(() => {
		const fetchSearchResults = async () => {
			console.log("Search engine:", prompt.searchTerms);
			if (prompt.searchTerms.length > 0 && !searchResults) {
				setSearchResultsLoading(true);
				const response = await axios.post("/api/generate/searchEngine", {
					searchTermInstance: prompt.searchTerms
				});
				setSearchResultsLoading(false);
				setSearchResults(response.data.searchResultsSummary);
			}
		};
		fetchSearchResults();
	}, [prompt, searchResults]);

	useEffect(() => {
		const fetchHypothesisGeneration = async () => {
			// First check if it already exists in prompt state
			if (prompt.hypothesisGeneration.length > 0) {
				setHypothesisGeneration(prompt.hypothesisGeneration);
				return;
			}
			if (searchResults && prompt.searchResultsSummary !== "") {
				setHypothesisGenerationLoading(true);
				const response = await axios.post("/api/generate/hypothesisGenerator", {
					promptInstance: prompt
				});
				console.log("Response from hypothesis generator:", response.data);
				setHypothesisGenerationLoading(false);
				setHypothesisGeneration(response.data.hypothesisGeneration);
				console.log("Hypothesis generation set value:", hypothesisGeneration);
			}
		};
		fetchHypothesisGeneration();
	}, [searchResults, prompt]);

	useEffect(() => {
		const fetchHypothesisEvaluation = async () => {
			if (prompt.hypothesisEvaluation.length > 0) {
				console.log("Evaluation exists:");
				console.log(prompt.hypothesisEvaluation);
				setHypothesisEvaluation(prompt.hypothesisEvaluation);
				return;
			}
			if (hypothesisGeneration) {
				console.log("No evaluation start generating");
				setHypothesisEvaluationLoading(true);
				const response = await axios.post("/api/generate/evaluator", {
					hypothesisGenerationInstance: hypothesisGeneration
				});
				console.log("Response from evaluation:", response.data);
				setHypothesisEvaluationLoading(false);
				setHypothesisEvaluation(response.data.hypothesisEvaluation);
				console.log("Hypothesis evaluation set value:", hypothesisEvaluation);
			}
		};
		fetchHypothesisEvaluation();
	}, [prompt, hypothesisGeneration]);

	useEffect(() => {
		const fetchReinitiation = async () => {
			if (prompt.Reinitiator.length > 0) {
				setReinitiation(prompt.Reinitiator);
				return;
			}
			if (hypothesisEvaluation) {
				setReinitiationLoading(true);
				const response = await axios.post("/api/generate/reinitiator", {
					hypothesisEvaluationInstance: hypothesisEvaluation
				});
				console.log("Response from reintiation:", response.data.reinitiation);
				setReinitiationLoading(false);
				setReinitiation(response.data.reinitiation);
			}
		};
		fetchReinitiation();
	}, [prompt, hypothesisEvaluation]);

	return (
		<Card className="h-full w-[1080px] max-h-[90vh] overflow-y-auto">
			<CardHeader>
				<CardTitle className="leading-7">Research question</CardTitle>
				<CardDescription className="text-lg">
					{prompt.researchQuestion}
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-8">
				<Card>
					<CardHeader>
						<CardTitle>Search terms</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{prompt.searchTerms.length > 0 ? (
							prompt.searchTerms.map((searchTerm: any) => (
								<div key={searchTerm.id}>
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
						{searchResultsLoading ? (
							<Loader2 className="animate-spin" />
						) : (
							<div>
								{searchResults ? (
									<div className="w-full">
										<pre style={{ whiteSpace: "pre-wrap" }}>
											{searchResults}
										</pre>
									</div>
								) : (
									<FetchLoading />
								)}
							</div>
						)}
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Initial hypothesis generation</CardTitle>
					</CardHeader>
					<CardContent>
						{hypothesisGenerationLoading ? (
							<Loader2 className="animate-spin" />
						) : (
							<div>
								{hypothesisGeneration ? (
									<pre style={{ whiteSpace: "pre-wrap" }}>
										{hypothesisGeneration[0].hypothesis}
									</pre>
								) : (
									<FetchLoading />
								)}
							</div>
						)}
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Revised hypothesis</CardTitle>
					</CardHeader>
					<CardContent>
						{hypothesisEvaluationLoading ? (
							<Loader2 className="animate-spin" />
						) : (
							<div>
								{hypothesisEvaluation ? (
									<pre style={{ whiteSpace: "pre-wrap" }}>
										{hypothesisEvaluation[0].evaluation}
									</pre>
								) : (
									<FetchLoading />
								)}
							</div>
						)}
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Reframed research</CardTitle>
					</CardHeader>
					<CardContent>
						{reinitiationLoading ? (
							<Loader2 className="animate-spin" />
						) : (
							<div>
								{reinitiation ? (
									<pre style={{ whiteSpace: "pre-wrap" }}>
										{reinitiation[0].reinitiation}
									</pre>
								) : (
									<FetchLoading />
								)}
							</div>
						)}
					</CardContent>
				</Card>
			</CardContent>
		</Card>
	);
};

export default ResultsCard;
