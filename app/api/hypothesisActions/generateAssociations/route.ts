export const maxDuration = 300;

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { wordwareGenerator } from "@/lib/wordwareGenerator";
import { cleanupStringToJSON } from "@/lib/cleanStringToJSON";

export async function POST(req: Request, res: Response) {
	try {
		const { selectedHypothesis } = await req.json();
		if (selectedHypothesis.length < 2 || selectedHypothesis.length > 3) {
			return NextResponse.json({
				error: "Please select 2 or 3 hypothesis to generate associations"
			});
		}
		// selected hypothesis is a list of hypothesis ids
		// fetch all hypothesis
		const hypothesisGenerationArray =
			await prisma.hypothesisGeneration.findMany({
				where: {
					id: {
						in: selectedHypothesis
					}
				},
				select: {
					promptId: true,
					hypothesis: true
				}
			});
		// Extract the hypothesis into an array
		const hypotheses = hypothesisGenerationArray.map((h) => h.hypothesis);

		// Fetch the prompt
		const prompt = await prisma.prompt.findUnique({
			where: {
				id: hypothesisGenerationArray[0].promptId
			}
		});
		if (!prompt) return NextResponse.json({ error: "Prompt not found" });

		// console.log("Hypothesis Generation Array:", hypotheses);

		// Create inputs for wordware
		const inputs = {
			all_hypothesis: hypotheses,
			search_results: prompt.searchResultsSummary,
			research_question: prompt.researchQuestion,
			instructions: "No specific instructions"
		};
		const newHypothesis = await wordwareGenerator({
			inputs: inputs,
			wordwarePromptId: "1a8452aa-f040-4703-ba9e-b9a28fdc6d44"
		});

		// console.log("Raw string output", newHypothesis);
		const hypothesisJson = JSON.parse(cleanupStringToJSON(newHypothesis, ""));
		console.log("Associations wordware response", hypothesisJson);
		// Create the new hypothesis
		const newHypothesisInstance = await prisma.hypothesisGeneration.create({
			data: {
				promptId: prompt.id,
				hypothesis: hypothesisJson.hypothesis,
				justification: hypothesisJson.reasoning,
				hypothesisTitle: hypothesisJson.hypothesisTitle
			}
		});

		return NextResponse.json({
			newHypothesisInstance
		});
	} catch (error) {
		console.error("Error generating associations:", error);
		return NextResponse.json({
			error: "Something went wrong",
			errorMeta: JSON.stringify(error)
		});
	}
}
