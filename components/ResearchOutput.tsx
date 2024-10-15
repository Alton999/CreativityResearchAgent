"use client";
import React, { useState, useEffect } from "react";
import { PromptType } from "@/types";
import SearchTerms from "./promptSections/SearchTerms";
import SearchResultsSummary from "./promptSections/SearchResultsSummary";
import HypothesisGenerated from "./promptSections/HypothesisGenerated";
import useResearchStore from "@/store/useResearchStore";

type Props = {
	initialPrompt: PromptType;
};

const ResearchOutput = ({ initialPrompt }: Props) => {
	const { setPrompt, prompt } = useResearchStore();

	const [hypothesisButtonActive, setHypothesisButtonActive] =
		useState<boolean>(false);

	useEffect(() => {
		setPrompt(initialPrompt);
	}, [initialPrompt, setPrompt]);

	useEffect(() => {
		if (prompt) {
			if (prompt.searchResultsSummary.length > 0) {
				setHypothesisButtonActive(true);
			}

			if (prompt.hypothesisGeneration) {
				if (prompt.hypothesisGeneration.length > 0) {
					setHypothesisButtonActive(false);
				}
			}
		}
	}, [prompt]);

	if (!prompt) {
		return <div>Prompt not found.</div>;
	}
	return (
		<div className="space-y-8">
			<SearchTerms />
			{prompt.searchResultsSummary && (
				<SearchResultsSummary hypothesisButtonActive={hypothesisButtonActive} />
			)}
			{
				// Display hypothesis generation
				prompt.hypothesisGeneration.length > 0 && <HypothesisGenerated />
			}
		</div>
	);
};

export default ResearchOutput;
