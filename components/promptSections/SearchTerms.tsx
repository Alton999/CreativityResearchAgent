import React, { useEffect, useState } from "react";
import FetchLoading from "../FetchLoading";
import SearchTerm from "../SearchTerm";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { SearchTerm as SearchTermType } from "@/types";
import axios from "axios";
import { Loader2 } from "lucide-react";

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
	const [selectedSearchTerms, setSelectedSearchTerms] = useState<
		SearchTermType[]
	>([]);
	const [
		generateSearchSummaryButtonActive,
		setGenerateSearchSummaryButtonActive
	] = useState<Boolean>(false);
	const [searchResultsSummaryLoading, setSearchResultsSummaryLoading] =
		useState<boolean>(false);
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
					{searchResultsSummary === "" && (
						<Button
							variant={
								generateSearchSummaryButtonActive ? "default" : "outline"
							}
							disabled={
								!generateSearchSummaryButtonActive ||
								searchResultsSummaryLoading
							}
							className="w-full"
							onClick={() => generateSearchResults()}
						>
							{searchResultsSummaryLoading ? (
								<Loader2 className="animate-spin" />
							) : (
								"Generate search summary"
							)}
						</Button>
					)}
				</div>
			</CardContent>
		</Card>
	);
};

export default SearchTerms;
