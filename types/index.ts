export type SearchTerm = {
	id: string;
	question: string;
	field: string;
	createdAt: string;
	promptId: string;
	searchTerm: string;
	explanation: string;
	savedPapers: SavedPaper[];
	newSearchTerm: boolean;
};

export type SavedPaper = {
	id: string;
	paperId: string;
	title: string;
	authors: string[];
	summary: string;
	text: string;
	publishedYear: number;
	url: string;
	searchTermsId: string;
};
export type SearchResult = {
	id: string;
	searchResult: string;
	createdAt: string;
	searchTermId: string;
};

export type HypothesisGeneration = {
	id: string;
	promptId: string;
	hypothesis: string;
	proposedExperiments: string;
	justification: string;
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
};

export type WordwareGeneration = {
	inputs: Object;
	wordwarePromptId: string;
};
