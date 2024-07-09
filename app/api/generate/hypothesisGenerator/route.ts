export const maxDuration = 300;
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
// import { hypothesisGeneration } from "@/lib/hypothesisGeneration";
import { cleanupStringToJSON } from "@/lib/cleanStringToJSON";
import { HypothesisGeneration as HypothesisGenerationTypes } from "@/types";
import { wordwareGenerator } from "@/lib/wordwareGenerator";

export async function POST(req: Request, res: Response) {
	try {
		console.log("Request from hypothesis generator");

		const { promptId } = await req.json();
		// const promptInstance: PromptInstance = prompt.promptInstance;
		const promptInstance = await prisma.prompt.findUnique({
			where: {
				id: promptId
			}
		});
		// Fetch prompt
		if (!promptInstance)
			return NextResponse.json({
				error: "Prompt not found"
			});
		const hypothesisInputs = {
			search_results: promptInstance.searchResultsSummary,
			research_question: promptInstance.researchQuestion
		};

		const hypothesis = await wordwareGenerator({
			inputs: hypothesisInputs,
			wordwarePromptId: "ba95aea5-852b-4b2b-9feb-6f88c0a26cb5"
		});
		console.log("Hypothesis:", hypothesis);

		// Using ANY type just for output from wordware
		const hypothesisJson = JSON.parse(cleanupStringToJSON(hypothesis));
		const hypothesisArray = hypothesisJson.map(
			(hypothesis: HypothesisGenerationTypes) => {
				return {
					promptId: promptInstance.id,
					hypothesis: hypothesis.hypothesis
				};
			}
		);
		await prisma.hypothesisGeneration.createMany({
			data: hypothesisArray
		});

		// Need to do a fetch and return ALL generated hypothesis related to this prompt
		const allHypothesisGenerated = await prisma.hypothesisGeneration.findMany({
			where: {
				promptId: promptInstance.id
			}
		});
		console.log("Hypothesis generated array", allHypothesisGenerated);
		return NextResponse.json({
			hypothesisGenerationArray: allHypothesisGenerated
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
