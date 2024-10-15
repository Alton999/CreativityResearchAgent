import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import {
	PromptType,
	SearchTerm,
	SavedPaper,
	SearchResult,
	HypothesisGeneration
} from "@/types";

interface ResearchStore {
	prompt: PromptType | null;
	searchTerms: SearchTerm[];
	hypotheses: HypothesisGeneration[];
	searchResults: SearchResult[];
	searchResultsSummary: string;
	setPrompt: (prompt: PromptType) => void;
	updatePrompt: (updates: Partial<PromptType>) => void;

	setSearchTerms: (searchTerms: SearchTerm[]) => void;
	addSearchTerm: (searchTerm: SearchTerm) => void;
	updateSearchTerm: (
		searchTermId: string,
		updates: Partial<SearchTerm>
	) => void;
	updateSearchResultsSummary: (summary: string) => void;
	setHypotheses: (hypotheses: HypothesisGeneration[]) => void;
	addHypothesis: (hypothesis: HypothesisGeneration) => void;
	updateHypothesis: (
		hypothesisId: string,
		updates: Partial<HypothesisGeneration>
	) => void;
	removeHypothesis: (hypothesisId: string) => void;

	addSavedPaper: (searchTermId: string, paper: SavedPaper) => void;
	removeSavedPaper: (searchTermId: string, paperId: string) => void;

	setSearchResults: (searchResults: SearchResult[]) => void;
	addSearchResult: (result: SearchResult) => void;
}

const useResearchStore = create<ResearchStore>()(
	immer((set) => ({
		prompt: null,
		searchTerms: [],
		hypotheses: [],
		searchResults: [],
		searchResultsSummary: "",
		setPrompt: (prompt) =>
			set((state) => {
				state.prompt = prompt;
				state.searchTerms = prompt.searchTerms;
				state.hypotheses = prompt.hypothesisGeneration;
				state.searchResults = prompt.searchResults || [];
				state.searchResultsSummary = prompt.searchResultsSummary;
			}),

		updatePrompt: (updates) =>
			set((state) => {
				if (state.prompt) {
					Object.assign(state.prompt, updates);
				}
			}),

		setSearchTerms: (searchTerms) =>
			set((state) => {
				state.searchTerms = searchTerms;
			}),
		addSearchTerm: (searchTerm) =>
			set((state) => {
				state.searchTerms.push(searchTerm);
			}),
		updateSearchTerm: (searchTermId, updates) =>
			set((state) => {
				const searchTerm = state.searchTerms.find(
					(term) => term.id === searchTermId
				);
				if (searchTerm) {
					Object.assign(searchTerm, updates);
				}
			}),

		updateSearchResultsSummary: (summary: string) =>
			set((state) => {
				state.searchResultsSummary = summary;
			}),

		setHypotheses: (hypotheses) =>
			set((state) => {
				state.hypotheses = hypotheses;
			}),

		addHypothesis: (hypothesis) =>
			set((state) => {
				state.hypotheses.push(hypothesis);
			}),

		updateHypothesis: (hypothesisId, updates) =>
			set((state) => {
				const hypothesis = state.hypotheses.find((h) => h.id === hypothesisId);
				if (hypothesis) {
					Object.assign(hypothesis, updates);
				}
			}),

		removeHypothesis: (hypothesisId) =>
			set((state) => {
				state.hypotheses = state.hypotheses.filter(
					(h) => h.id !== hypothesisId
				);
			}),

		addSavedPaper: (searchTermId, paper) =>
			set((state) => {
				const searchTerm = state.searchTerms.find(
					(term) => term.id === searchTermId
				);
				if (searchTerm) {
					searchTerm.savedPapers.push(paper);
				}
			}),
		removeSavedPaper: (searchTermId, paperId) =>
			set((state) => {
				const searchTerm = state.searchTerms.find(
					(term) => term.id === searchTermId
				);
				if (searchTerm) {
					searchTerm.savedPapers = searchTerm.savedPapers.filter(
						(paper) => paper.id !== paperId
					);
				}
			}),

		setSearchResults: (searchResults) =>
			set((state) => {
				state.searchResults = searchResults;
			}),
		addSearchResult: (result) =>
			set((state) => {
				state.searchResults.push(result);
			})
	}))
);

export default useResearchStore;
