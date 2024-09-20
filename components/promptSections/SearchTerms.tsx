import React, { useEffect, useState } from "react";
import SearchTerm from "../SearchTerm";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { SearchTerm as SearchTermType } from "@/types";
import { Loader2 } from "lucide-react";
import GenerateSearchSummaryModal from "../GenerateSearchSummaryModal";

type Props = {
	searchTerms: SearchTermType[];
	setSearchTerms: React.Dispatch<React.SetStateAction<SearchTermType[]>>;
	setSearchResultsSummary: React.Dispatch<React.SetStateAction<string>>;
	searchResultsSummary: string;
};

const SearchTerms = ({
	searchTerms,
	setSearchTerms,
	setSearchResultsSummary,
	searchResultsSummary
}: Props) => {
	console.log("Search terms: ", searchTerms);
	const [searchResultsSummaryLoading, setSearchResultsSummaryLoading] =
		useState<boolean>(false);

	const [showSearchTermSelectionModal, setShowSearchTermSelectionModal] =
		useState<boolean>(false);

	const addNewSearchTerm = (newSearchTerm: SearchTermType) => {
		setSearchTerms((prevSearchTerms) => [...prevSearchTerms, newSearchTerm]);
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
	// const generateSearchResults = async () => {
	// 	setSearchResultsSummaryLoading(true);
	// 	const response = await axios.post("/api/generate/searchEngine", {
	// 		searchTermInstance: selectedSearchTerms
	// 	});
	// 	console.log("Response from generate search results: ", response);
	// 	setGenerateSearchSummaryButtonActive(false);
	// 	setSearchResultsSummary(response.data.searchResultsSummary);
	// };
	// useEffect(() => {
	// 	if (searchResultsSummary.length > 0) {
	// 		setShowSearchTermSelectionModalButtonActive(true);
	// 	}
	// }, [searchResultsSummary]);

	// useEffect(() => {
	// 	if (selectedSearchTerms.length === 3) {
	// 		setGenerateSearchSummaryButtonActive(true);
	// 	} else {
	// 		setGenerateSearchSummaryButtonActive(false);
	// 	}
	// }, [selectedSearchTerms]);

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
					setSearchResultsSummary={setSearchResultsSummary}
				/>
			)}
		</>
	);
};

export default SearchTerms;
