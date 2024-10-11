export const maxDuration = 300;

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { wordwareGenerator } from "@/lib/wordwareGenerator";
import { cleanupStringToJSON } from "@/lib/cleanStringToJSON";

export async function POST(req: Request, res: Response) {
	try {
		let { selectedHypothesis, instructions } = await req.json();
		console.log("Selected Hypothesis:", selectedHypothesis);

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

		if (instructions === "") {
			instructions = "No instructions provided";
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

		await prisma.hypothesisGeneration.create({
			data: {
				promptId: hypothesisInstance.promptId,
				hypothesis: newHypothesis
			}
		});

		const allHypothesis = await prisma.hypothesisGeneration.findMany({
			where: {
				promptId: hypothesisInstance.promptId
			}
		});
		return NextResponse.json({
			allHypothesis
		});
	} catch (error) {
		console.error("Error branching off hypothesis:"), error;
		return NextResponse.json({
			error: `Error branching off hypothesis: ${error}`,
			errorMeta: JSON.stringify
		});
	}
}
