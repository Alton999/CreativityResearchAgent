export const maxDuration = 300;

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { wordwareGenerator } from "@/lib/wordwareGenerator";
import { cleanupStringToJSON } from "@/lib/cleanStringToJSON";

export async function POST(req: Request, res: Response) {
	try {
		let { selectedHypothesis, instructions } = await req.json();

		// Find singular hypothesis
		const hypothesisInstance = await prisma.hypothesisGeneration.findUnique({
			where: {
				// Just assume the array has one element
				id: selectedHypothesis[0]
			},
			select: {
				hypothesis: true,
				promptId: true
			}
		});
		if (!hypothesisInstance)
			return NextResponse.json({ error: "Hypothesis not found" });
		// Fetch the prompt to find saved papers
		const prompt = await prisma.prompt.findUnique({
			where: {
				id: hypothesisInstance.promptId
			},
			include: {
				searchTerms: {
					include: {
						savedPapers: true
					}
				}
			}
		});
		if (!prompt) return NextResponse.json({ error: "Prompt not found" });
		let selectedPaper = null;
		const allSavedPapers = prompt.searchTerms.flatMap(
			(term) => term.savedPapers
		);
		const randomIndex = Math.floor(Math.random() * allSavedPapers.length);
		selectedPaper = allSavedPapers[randomIndex];
		console.log("Selected paper:", selectedPaper);
		console.log("Hypothesis instance", hypothesisInstance);
		if (instructions.trim() === "") {
			instructions = "No specific instructions";
		}
		const inputs = {
			selected_hypothesis: hypothesisInstance.hypothesis,
			selected_paper: selectedPaper.summary,
			instructions: instructions
		};
		const newHypothesis = await wordwareGenerator({
			inputs: inputs,
			wordwarePromptId: "66acef55-3df0-4fc0-9e6e-40f5bb30e087"
		});

		const hypothesisJson = JSON.parse(cleanupStringToJSON(newHypothesis, ""));
		const newHypothesisInstance = await prisma.hypothesisGeneration.create({
			data: {
				promptId: hypothesisInstance.promptId,
				hypothesis: hypothesisJson.hypothesis,
				justification: hypothesisJson.reasoning,
				hypothesisTitle: hypothesisJson.hypothesisTitle
			}
		});

		// const allHypothesis = await prisma.hypothesisGeneration.findMany({
		// 	where: {
		// 		promptId: hypothesisInstance.promptId
		// 	}
		// });
		return NextResponse.json({
			newHypothesisInstance
		});
	} catch (error) {
		console.error("Error branching off hypothesis:"), error;
		return NextResponse.json({
			error: `Error branching off hypothesis: ${error}`,
			errorMeta: JSON.stringify
		});
	}
}
