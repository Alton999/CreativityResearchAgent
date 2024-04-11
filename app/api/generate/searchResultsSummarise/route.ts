// export const maxDuration = 300;
// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/db";
// import { searchSummmaryWordware } from "@/lib/searchSummaryWordware";
// import { wordwareSummarise } from "@/lib/wordwareSummarise";

// type SearchResult = {
// 	id: string;
// 	searchTermId: string;
// 	searchResult: string;
// };

// export async function POST(req: Request, res: Response) {
// 	try {
// 		const searchResults = await req.json();
// 		// Search terms is an array of search terms

// 		console.log("Search results:", searchResults);
// 		// Combine all the search results into a string
// 		const searchResultsString = searchResults
// 			.map((searchResult: SearchResult) => searchResult.searchResult)
// 			.join(" ");
// 		const searchResultsSummary = await wordwareSummarise({
// 			context: searchResultsString,
// 			wordwarePromptId: "59716311-82a5-4ecc-b125-36fcef1b5d8e"
// 		});
// 		return NextResponse.json({ searchResultsSummary: searchResultsSummary });
// 	} catch (error: any) {
// 		console.error("Error generating search results summary:");
// 		console.error("Error message:", error.message);
// 		console.error("Error stack trace:", error.stack);

// 		return NextResponse.json({
// 			error: "Something went wrong",
// 			errorMeta: JSON.stringify(error)
// 		});
// 	}
// }
