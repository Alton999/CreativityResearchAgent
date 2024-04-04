"use client";

import { useEffect, useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card";
import axios from "axios";
import { Skeleton } from "./ui/skeleton";

type HypothesisEvaluationProps = {
	hypothesisInstance: {
		id: string;
		promptId: string;
		searchTermId: string;
		searchResultId: string;
		hypothesis: string;
		createdAt: Date;
	};
};

const HypothesisEvaluation = ({
	hypothesisInstance
}: HypothesisEvaluationProps) => {
	const [evaluation, setEvaluation] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	const getSearchResults = async () => {
		setIsLoading(true);

		const response = await axios.post("/api/generate/evaluator", {
			hypothesisInstance: hypothesisInstance
		});
		setIsLoading(false);
		console.log("Hypothesis evaluation results", response.data);
		setEvaluation(response.data.hypothesisEvaluation.evaluation);
		// setSearchResults(response.data.searchResultsInstance.searchResult);
		return response.data;
	};
	useEffect(() => {
		getSearchResults();
	}, []);
	return (
		<Card>
			<CardHeader>
				<CardTitle>Revised hypothesis generation</CardTitle>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<div className="space-y-2">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-5/6" />
						<Skeleton className="h-4 w-4/6" />
						<Skeleton className="h-4 w-5/6" />
						<Skeleton className="h-4 w-6/6" />
					</div>
				) : (
					<div className="w-full">
						<pre style={{ whiteSpace: "pre-wrap" }}>{evaluation}</pre>
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default HypothesisEvaluation;
