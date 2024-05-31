"use client";
import React, { useState } from "react";
import { PromptType, SearchTerm as SearchTermType } from "@/types";
import SearchTerms from "./promptSections/SearchTerms";

type Props = {
	prompt: PromptType;
};

const ResearchOutput = ({ prompt }: Props) => {
	const [searchTerms, setSearchTerms] = useState<SearchTermType[]>(
		prompt.searchTerms
	);
	console.log("Prompt", prompt);
	// Search terms states

	return (
		<div>
			<SearchTerms
				searchTerms={searchTerms as SearchTermType[]}
				setSearchTerms={setSearchTerms}
			/>
		</div>
	);
};

export default ResearchOutput;
