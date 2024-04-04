export const maxDuration = 300;
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { searchSummmaryWordware } from "@/lib/searchSummaryWordware";

export async function POST(req: Request, res: Response) {
	try {
		const searchTerm = await req.json();
		const searchTermInstance = searchTerm.searchTermInstance;

		// Lets see if there is already an instance of search results in the database
		const existingSearchResults = await prisma.searchResults.findFirst({
			where: {
				promptId: searchTermInstance.promptId,
				searchTermId: searchTermInstance.id
			}
		});

		// If instance exists return that instance else create new instance
		if (existingSearchResults) {
			// console.log("Search results already exist:", existingSearchResults);
			return NextResponse.json({
				searchResult: existingSearchResults
			});
		} else {
			console.log("Creating new search results instance");
			const searchSummary = await searchSummmaryWordware({
				searchTerms: searchTermInstance.searchTerm,
				wordwarePromptId: "df77f083-8a4c-4bd7-aeea-c52348fe0383"
			});
			const searchResultsInstance = await prisma.searchResults.create({
				data: {
					promptId: searchTermInstance.promptId,
					searchTermId: searchTermInstance.id,
					searchResult: searchSummary
				}
			});

			// console.log("Search summary:", searchSummary);
			return NextResponse.json({ searchResult: searchResultsInstance });
		}
	} catch (error: any) {
		console.error("Error generating search summary:");
		console.error("Error message:", error.message);
		console.error("Error stack trace:", error.stack);

		return NextResponse.json({
			error: "Something went wrong",
			errorMeta: JSON.stringify(error)
		});
	}
}
