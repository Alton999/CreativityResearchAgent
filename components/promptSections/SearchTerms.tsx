import React, { useEffect, useState } from "react";
import useResearchStore from "@/store/useResearchStore";

import SearchTerm from "../SearchTerm";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { SearchTerm as SearchTermType } from "@/types";
import { Loader2 } from "lucide-react";
import GenerateSearchSummaryModal from "../GenerateSearchSummaryModal";

const SearchTerms = () => {
	const { prompt } = useResearchStore();

	const [searchResultsSummaryLoading, setSearchResultsSummaryLoading] =
		useState<boolean>(false);

	const [showSearchTermSelectionModal, setShowSearchTermSelectionModal] =
		useState<boolean>(false);

	const [
		showSearchTermSelectionModalButtonActive,
		setShowSearchTermSelectionModalButtonActive
	] = useState<boolean>(false);

	useEffect(() => {
		if (!prompt) return;
		if (prompt.searchResultsSummary.length > 0) {
			setShowSearchTermSelectionModalButtonActive(true);
		}
	}, [prompt]);

	if (!prompt) return <div>Prompt not found.</div>;
	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle>Search terms</CardTitle>
				</CardHeader>
				<CardContent>
					{/* <p className="mb-3">
						Selected search terms for summary: {selectedSearchTerms.length}/3
					</p> */}
					<div className="space-y-4">
						{prompt.searchTerms.map((searchTerm, index: number) => (
							<SearchTerm
								key={`${searchTerm.id}`}
								index={index}
								searchTerm={searchTerm}
								// selectedSearchTerms={selectedSearchTerms}
								// handleSearchTermSelection={handleSearchTermSelection}
							/>
						))}
						{
							<Button
								disabled={
									showSearchTermSelectionModalButtonActive ||
									searchResultsSummaryLoading
								}
								className="w-full"
								onClick={() => setShowSearchTermSelectionModal(true)}
							>
								{searchResultsSummaryLoading ? (
									<Loader2 className="animate-spin" />
								) : (
									"Generate search summary"
								)}
							</Button>
						}
					</div>
				</CardContent>
			</Card>

			{/* Render modal for generating search summary */}
			{showSearchTermSelectionModal && (
				<GenerateSearchSummaryModal
					allSearchTerms={prompt.searchTerms}
					setSearchResultsSummaryLoading={setSearchResultsSummaryLoading}
					searchResultsSummaryLoading={searchResultsSummaryLoading}
					setShowSearchTermSelectionModal={setShowSearchTermSelectionModal}
				/>
			)}
		</>
	);
};

export default SearchTerms;
