import React, { useEffect, useState } from "react";
import FetchLoading from "../FetchLoading";
import SearchTerm from "../SearchTerm";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { SearchTerm as SearchTermType } from "@/types";
import axios from "axios";

type Props = {
	searchTerms: SearchTermType[];
	setSearchTerms: React.Dispatch<React.SetStateAction<SearchTermType[]>>;
	setSearchResultsSummary: React.Dispatch<React.SetStateAction<string>>;
	setSearchResultsSummaryLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const SearchTerms = ({
	searchTerms,
	setSearchTerms,
	setSearchResultsSummary,
	setSearchResultsSummaryLoading
}: Props) => {
	const [selectedSearchTerms, setSelectedSearchTerms] = useState<
		SearchTermType[]
	>([]);
	const [
		generateSearchSummaryButtonActive,
		setGenerateSearchSummaryButtonActive
	] = useState<Boolean>(false);
	// console.log("Search terms", searchTerms);
	const handleSearchTermSelection = (searchTerm: SearchTermType) => {
		setSelectedSearchTerms((prevSelectedSearchTerms) => {
			if (prevSelectedSearchTerms.some((term) => term.id === searchTerm.id)) {
				// If the search term is already selected, remove it from the array
				return prevSelectedSearchTerms.filter(
					(term) => term.id !== searchTerm.id
				);
			} else if (prevSelectedSearchTerms.length < 3) {
				// If the search term is not selected and the limit is not reached, add it to the array
				return [...prevSelectedSearchTerms, searchTerm];
			} else {
				// If the limit is already reached, return the previous state without adding the search term
				return prevSelectedSearchTerms;
			}
		});
	};
	const addNewSearchTerm = (newSearchTerm: SearchTermType) => {
		setSearchTerms((prevSearchTerms) => [...prevSearchTerms, newSearchTerm]);
	};

	const generateSearchResults = async () => {
		console.log("Prompt search terms:", selectedSearchTerms);
		setSearchResultsSummaryLoading(true);
		const response = await axios.post("/api/generate/searchEngine", {
			searchTermInstance: selectedSearchTerms
		});
		console.log("Response from generate search results: ", response);
		setGenerateSearchSummaryButtonActive(false);
		setSearchResultsSummary(response.data.searchResultsSummary);
	};
	useEffect(() => {
		if (selectedSearchTerms.length === 3) {
			setGenerateSearchSummaryButtonActive(true);
		} else {
			setGenerateSearchSummaryButtonActive(false);
		}
	}, [selectedSearchTerms]);
	return (
		<Card>
			<CardHeader>
				<CardTitle>Search terms</CardTitle>
			</CardHeader>
			<CardContent>
				<p className="mb-3">
					Selected search terms for summary: {selectedSearchTerms.length}/3
				</p>

				<div className="space-y-4">
					{searchTerms.map((searchTerm, index: Number) => (
						<SearchTerm
							key={`${searchTerm.id}`}
							searchTerm={searchTerm}
							addNewSearchTerm={addNewSearchTerm}
							selectedSearchTerms={selectedSearchTerms}
							handleSearchTermSelection={handleSearchTermSelection}
						/>
					))}
					<Button
						variant={generateSearchSummaryButtonActive ? "default" : "outline"}
						disabled={!generateSearchSummaryButtonActive}
						className="w-full"
						onClick={() => generateSearchResults()}
					>
						Generate search summary
					</Button>
				</div>
			</CardContent>
		</Card>
	);
};

export default SearchTerms;
