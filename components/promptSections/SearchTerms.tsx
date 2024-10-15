import React, { useEffect, useState } from "react";
import useResearchStore from "@/store/useResearchStore";

import SearchTerm from "../SearchTerm";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { SearchTerm as SearchTermType } from "@/types";
import { Loader2 } from "lucide-react";
import GenerateSearchSummaryModal from "../GenerateSearchSummaryModal";

const SearchTerms = () => {
	const { searchTerms, addSearchTerm, searchResultsSummary } =
		useResearchStore();

	const [searchResultsSummaryLoading, setSearchResultsSummaryLoading] =
		useState<boolean>(false);

	const [showSearchTermSelectionModal, setShowSearchTermSelectionModal] =
		useState<boolean>(false);

	const addNewSearchTerm = (newSearchTerm: SearchTermType) => {
		addSearchTerm(newSearchTerm);
	};

	const [
		showSearchTermSelectionModalButtonActive,
		setShowSearchTermSelectionModalButtonActive
	] = useState<boolean>(false);

	useEffect(() => {
		if (searchResultsSummary.length > 0) {
			setShowSearchTermSelectionModalButtonActive(true);
		}
	}, [searchResultsSummary]);

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
						{searchTerms.map((searchTerm, index: number) => (
							<SearchTerm
								key={`${searchTerm.id}`}
								index={index}
								searchTerm={searchTerm}
								addNewSearchTerm={addNewSearchTerm}
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
					allSearchTerms={searchTerms}
					setSearchResultsSummaryLoading={setSearchResultsSummaryLoading}
					searchResultsSummaryLoading={searchResultsSummaryLoading}
					setShowSearchTermSelectionModal={setShowSearchTermSelectionModal}
				/>
			)}
		</>
	);
};

export default SearchTerms;
