export const maxDuration = 300;
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hypothesisGeneration } from "@/lib/hypothesisGeneration";

type PromptInstance = {
	searchResultsSummary: string;
	researchQuestion: string;
	id: string;
	userId: string;
	researchField: string;
};
export async function POST(req: Request, res: Response) {
	try {
		console.log("Request from hypothesis generator");

		const prompt = await req.json();
		const promptInstance: PromptInstance = prompt.promptInstance;
		console.log("Prompt instance:", promptInstance);

		console.log(
			"Creating new hypothesis generation instance from this search summary",
			promptInstance.searchResultsSummary
		);
		const hypothesis = await hypothesisGeneration({
			searchResults: promptInstance.searchResultsSummary,
			wordwarePromptId: "77a66890-8637-4c3d-a030-1cc1de67f72f",
			researchQuestion: promptInstance.researchQuestion
		});

		const hypothesisGenerationInstance =
			await prisma.hypothesisGeneration.create({
				data: {
					promptId: promptInstance.id,
					hypothesis: hypothesis
				}
			});
		console.log(
			"Hypothesis generated:",
			hypothesisGenerationInstance.hypothesis
		);
		return NextResponse.json({
			hypothesisGeneration: hypothesisGenerationInstance
		});
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
