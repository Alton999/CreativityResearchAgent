export type SearchTerm = {
	id: string;
	question: string;
	field: string;
	createdAt: string;
	promptId: string;
	searchTerm: string;
	explanation: string;
};

export type SearchResult = {
	id: string;
	searchResult: string;
	createdAt: string;
	promptId: string;
	searchTermId: string;
};

export type HypothesisGeneration = {
	id: string;
	promptId: string;
	searchTermId: string;
	searchResultId: string;
	hypothesis: string;
	createdAt: string;
};

export type HypothesisEvaluation = {
	id: string;
	promptId: string;
	searchTermId: string;
	searchResultId: string;
	hypothesisId: string;
	evaluation: string;
	createdAt: string;
};

export type Reinitiator = {
	id: string;
	promptId: string;
	hypothesisId: string;
	searchTermId: string;
	searchResultId: string;
	hypothesisEvaluationId: string;
	reinitiation: string;
	createdAt: string;
};

export type PromptType = {
	id: string;
	userId: string;
	researchQuestion: string;
	researchField: string;
	createdAt: string;
	searchResultsSummary: string;
	searchTerms: SearchTerm[];
	searchResults: SearchResult[];
	hypothesisGeneration: HypothesisGeneration[];
	hypothesisEvaluation: HypothesisEvaluation[];
	Reinitiator: Reinitiator[];
};
