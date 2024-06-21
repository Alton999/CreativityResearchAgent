"use client";
import React, { useState } from "react";
import {
	PromptType,
	SearchTerm as SearchTermType,
	HypothesisGeneration as HypothesisGenerationTypes
} from "@/types";
import SearchTerms from "./promptSections/SearchTerms";
import SearchResultsSummary from "./promptSections/SearchResultsSummary";
import HypothesisGenerated from "./promptSections/HypothesisGenerated";

type Props = {
	prompt: PromptType;
};

const ResearchOutput = ({ prompt }: Props) => {
	const [searchTerms, setSearchTerms] = useState<SearchTermType[]>(
		prompt.searchTerms
	);
	const [searchResultsSummary, setSearchResultsSummary] = useState<string>(
		prompt.searchResultsSummary
	);
	const [hypothesisGeneration, setHypothesisGeneration] = useState<
		HypothesisGenerationTypes[]
	>(prompt.hypothesisGeneration);

	return (
		<div className="space-y-8">
			<SearchTerms
				searchTerms={searchTerms as SearchTermType[]}
				setSearchTerms={setSearchTerms}
				setSearchResultsSummary={setSearchResultsSummary}
				searchResultsSummary={searchResultsSummary}
			/>
			{searchResultsSummary && (
				<SearchResultsSummary
					searchResultsSummary={searchResultsSummary}
					setHypothesisGeneration={setHypothesisGeneration}
					setSearchResultsSummary={setSearchResultsSummary}
					promptId={prompt.id}
				/>
			)}
			{
				// Display hypothesis generation
				hypothesisGeneration.length > 0 && (
					<HypothesisGenerated hypothesisGeneration={hypothesisGeneration} />
				)
			}
		</div>
	);
};

export default ResearchOutput;
