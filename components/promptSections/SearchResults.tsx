"use client";

import { useEffect, useState } from "react";
import { CardContent } from "@/components/ui/card";
import axios from "axios";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { prisma } from "@/lib/db";

type SearchResultsProps = {
	searchTermInstance: {
		searchTerm: string;
		promptId: string;
		id: string;
	};
};

const SearchResults = ({ searchTermInstance }: SearchResultsProps) => {
	const [searchResults, setSearchResults] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const getSearchResults = async () => {
			setIsLoading(true);

			const response = await axios.post("/api/generate/searchEngine", {
				searchTermInstance: searchTermInstance
			});
			setIsLoading(false);
			console.log("Search results", response.data.searchResult);
			setSearchResults(response.data.searchResult.searchResult);
			return response.data;
		};
		getSearchResults();
	}, [searchTermInstance]);
	return (
		<CardContent>
			<div className="w-full">
				<pre style={{ whiteSpace: "pre-wrap" }}>{searchResults}</pre>
			</div>
		</CardContent>
	);
};

export default SearchResults;
