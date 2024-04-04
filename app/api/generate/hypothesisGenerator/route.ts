export const maxDuration = 300;
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hypothesisGeneration } from "@/lib/hypothesisGeneration";

export async function POST(req: Request, res: Response) {
	try {
		console.log("Request from hypothesis generator");

		const searchResult = await req.json();
		const searchResultInstance = searchResult.searchResultInstance;
		console.log("Search result instance:", searchResultInstance);

		// Lets get the prompt instance
		const promptInstance = await prisma.prompt.findUnique({
			where: { id: searchResultInstance.promptId }
		});
		if (!promptInstance) {
			return NextResponse.json({
				error: "Prompt instance not found"
			});
		}
		// Lets see if there is already an instance of search results in the database
		const existingHypothesisGeneration =
			await prisma.hypothesisGeneration.findFirst({
				where: {
					promptId: searchResultInstance.promptId
				}
			});

		// If instance exists return that instance else create new instance
		if (existingHypothesisGeneration) {
			console.log(
				"Hypothesis generation exists:",
				existingHypothesisGeneration
			);
			return NextResponse.json({
				hypothesisGeneration: existingHypothesisGeneration
			});
		} else {
			const hypothesis = await hypothesisGeneration({
				searchResults: searchResultInstance.searchResult,
				wordwarePromptId: "77a66890-8637-4c3d-a030-1cc1de67f72f",
				researchQuestion: promptInstance.researchQuestion
			});
			const hypothesisGenerationInstance =
				await prisma.hypothesisGeneration.create({
					data: {
						promptId: searchResultInstance.promptId,
						hypothesis: hypothesis,
						searchTermId: searchResultInstance.searchTermId,
						searchResultId: searchResultInstance.id
					}
				});

			// console.log("Hypothesis generation:", hypothesisGenerationInstance);
			return NextResponse.json({
				hypothesisGeneration: hypothesisGenerationInstance
			});
		}
	} catch (error: any) {
		console.error("Error generating hypothesis");
		console.error("Error message:", error.message);
		console.error("Error stack trace:", error.stack);

		return NextResponse.json({
			error: "Something went wrong",
			errorMeta: JSON.stringify(error)
		});
	}
}
