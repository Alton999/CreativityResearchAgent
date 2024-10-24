import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import {
	PromptType,
	SearchTerm,
	SavedPaper,
	SearchResult,
	HypothesisGeneration
} from "@/types";

type LatestGeneration = {
	id: string;
	type: "searchTerm" | "hypothesis";
};

interface ResearchStore {
	prompt: PromptType | null;
	latestGeneration: LatestGeneration | null; // New state for tracking latest generation

	setPrompt: (prompt: PromptType) => void;
	updatePrompt: (updates: Partial<PromptType>) => void;

	setSearchTerms: (searchTerms: SearchTerm[]) => void;
	addSearchTerm: (searchTerm: SearchTerm) => void;
	updateSearchTerm: (
		searchTermId: string,
		updates: Partial<SearchTerm>
	) => void;

	updateSearchResultsSummary: (summary: string) => void;

	addHypothesis: (hypothesis: HypothesisGeneration) => void;
	updateHypothesis: (
		hypothesisId: string,
		updates: Partial<HypothesisGeneration>
	) => void;
	removeHypothesis: (hypothesisId: string) => void;

	setSavedPapers: (searchTermId: string, papers: SavedPaper[]) => void;
	removeSavedPaper: (searchTermId: string, paperId: string) => void;

	setSearchResults: (searchResults: SearchResult[]) => void;
	addSearchResult: (result: SearchResult) => void;
}

const useResearchStore = create<ResearchStore>()(
	immer((set) => ({
		prompt: null,
		latestGeneration: null, // Initialize as null

		setPrompt: (prompt: PromptType) => set(() => ({ prompt })),

		updatePrompt: (updates) =>
			set((state) => {
				if (state.prompt) {
					Object.assign(state.prompt, updates);
				}
			}),

		setSearchTerms: (searchTerms) =>
			set((state) => {
				if (state.prompt) {
					state.prompt.searchTerms = searchTerms;
				}
			}),

		addSearchTerm: (searchTerm) =>
			set((state) => {
				if (state.prompt) {
					if (!searchTerm.savedPapers) {
						searchTerm.savedPapers = [];
					}
					state.prompt.searchTerms.push(searchTerm);
					state.latestGeneration = {
						id: searchTerm.id,
						type: "searchTerm"
					};
				}
			}),

		updateSearchTerm: (searchTermId, updates) =>
			set((state) => {
				if (state.prompt) {
					const searchTerm = state.prompt.searchTerms.find(
						(term) => term.id === searchTermId
					);
					if (searchTerm) {
						Object.assign(searchTerm, updates);
					}
				}
			}),

		updateSearchResultsSummary: (summary: string) =>
			set((state) => {
				if (state.prompt) {
					state.prompt.searchResultsSummary = summary;
				}
			}),

		addHypothesis: (hypothesis) =>
			set((state) => {
				if (state.prompt) {
					state.prompt.hypothesisGeneration.push(hypothesis);
					state.latestGeneration = {
						id: hypothesis.id,
						type: "hypothesis"
					};
				}
			}),

		updateHypothesis: (hypothesisId, updates) =>
			set((state) => {
				if (state.prompt) {
					const hypothesis = state.prompt.hypothesisGeneration.find(
						(h) => h.id === hypothesisId
					);
					if (hypothesis) {
						Object.assign(hypothesis, updates);
					}
				}
			}),

		removeHypothesis: (hypothesisId) =>
			set((state) => {
				if (state.prompt) {
					state.prompt.hypothesisGeneration =
						state.prompt.hypothesisGeneration.filter(
							(h) => h.id !== hypothesisId
						);
				}
			}),

		setSavedPapers: (searchTermId: string, papers: SavedPaper[]) =>
			set((state) => {
				if (!state.prompt) return;
				if (!papers || !Array.isArray(papers)) return;

				const searchTerm = state.prompt.searchTerms.find(
					(term) => term.id === searchTermId
				);

				if (searchTerm) {
					searchTerm.savedPapers = papers;
				}
			}),

		removeSavedPaper: (searchTermId, paperId) =>
			set((state) => {
				if (state.prompt) {
					const searchTerm = state.prompt.searchTerms.find(
						(term) => term.id === searchTermId
					);
					if (searchTerm) {
						searchTerm.savedPapers = searchTerm.savedPapers.filter(
							(paper) => paper.id !== paperId
						);
					}
				}
			}),

		setSearchResults: (searchResults) =>
			set((state) => {
				if (state.prompt) {
					state.prompt.searchResults = searchResults;
				}
			}),

		addSearchResult: (result) =>
			set((state) => {
				if (state.prompt) {
					state.prompt.searchResults.push(result);
				}
			})
	}))
);

export default useResearchStore;
