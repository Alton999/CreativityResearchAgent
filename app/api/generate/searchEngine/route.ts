export const maxDuration = 300;
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { wordwareGenerator } from "@/lib/wordwareGenerator";
import { SearchTerm as SearchTermType } from "@/types";

export async function POST(req: Request, res: Response) {
	try {
		const searchTerms = await req.json();
		const searchTermsInstance: SearchTermType[] =
			await searchTerms.searchTermInstance;
		// Search terms is an array of search terms
		console.log("Search terms:", searchTermsInstance);
		const searchResultsArray = Promise.all(
			searchTermsInstance.map(
				async (searchTerm: SearchTermType, index: Number) => {
					// Lets see if there is already an instance of search results in the database
					const existingSearchResults = await prisma.searchResults.findFirst({
						where: {
							searchTermId: searchTerm.id
						}
					});
					const existingPrompt = await prisma.prompt.findUnique({
						where: {
							id: searchTerm.promptId
						}
					});
					console.log("Existing prompt:", existingPrompt);
					if (existingSearchResults) {
						console.log("Search result exists:", existingSearchResults);
						if (existingPrompt?.searchResultsSummary !== "") {
							console.log("Search results summary exists:");
							NextResponse.json({
								searchResultsSummary: existingPrompt?.searchResultsSummary
							});
						}
						return existingSearchResults;
					} else {
						console.log("Creating new search results instance");
						// Construct an saved papers array from the search term
						// construct inputs
						// Get saved papers from search term
						const savedPapers = await prisma.savedPaper.findMany({
							where: {
								searchTermsId: searchTerm.id
							}
						});
						console.log("Saved papers from route:", savedPapers);
						const inputs = {
							search_terms: searchTerm.searchTerm,
							saved_papers: JSON.stringify(savedPapers)
						};
						const searchResult = await wordwareGenerator({
							inputs: inputs,
							wordwarePromptId: "df77f083-8a4c-4bd7-aeea-c52348fe0383"
						});

						const newSearchResultInstance = await prisma.searchResults.create({
							data: {
								searchTermId: searchTerm.id,
								searchResult: searchResult
							}
						});
						return newSearchResultInstance;
					}
				}
			)
		);
		// Join all search results into a single string
		const searchResultsString = (await searchResultsArray)
			.map((searchResult: any) => searchResult.searchResult)
			.join(" ");

		const searchResultSummaryInputs = {
			context: searchResultsString
		};
		const searchResultsSummary = await wordwareGenerator({
			inputs: searchResultSummaryInputs,
			wordwarePromptId: "59716311-82a5-4ecc-b125-36fcef1b5d8e"
		});
		// Save this summary to the prompt instance
		if (searchResultsSummary) {
			await prisma.prompt.update({
				where: {
					id: searchTermsInstance[0].promptId
				},
				data: {
					searchResultsSummary: {
						set: searchResultsSummary
					}
				}
			});
		}
		return NextResponse.json({ searchResultsSummary: searchResultsSummary });
	} catch (error: any) {
		console.error("Error generating search results:");
		console.error("Error message:", error.message);
		console.error("Error stack trace:", error.stack);

		return NextResponse.json({
			error: "Something went wrong",
			errorMeta: JSON.stringify(error)
		});
	}
}
