import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { wordwareGenerator } from "@/lib/wordwareGenerator";

export async function POST(req: Request, res: Response) {
	try {
		const { hypothesisId, instructions } = await req.json();
		// Fetch research question and hypothesis
		const hypothesisGeneration = await prisma.hypothesisGeneration.findFirst({
			where: {
				id: hypothesisId
			}
		});

		// Handle no hypothesis found
		if (!hypothesisGeneration)
			return NextResponse.json({ error: "Hypothesis not found" });

		const relatedPrompt = await prisma.prompt.findFirst({
			where: {
				id: hypothesisGeneration?.promptId
			}
		});
		// Handle no prompt found

		if (!relatedPrompt) return NextResponse.json({ error: "Prompt not found" });

		const researchQuestion = relatedPrompt.researchQuestion;
		let inputs;
		if (instructions !== "") {
			inputs = {
				hypothesis: hypothesisGeneration.hypothesis,
				research_question: researchQuestion,
				instructions: instructions
			};
		} else {
			inputs = {
				instructions: "No specific instructions provided",
				hypothesis: hypothesisGeneration.hypothesis,
				research_question: researchQuestion
			};
		}
		// Generate experiments via wordware

		console.log("Generating experiment:", inputs);
		const experiment = await wordwareGenerator({
			inputs: inputs,
			wordwarePromptId: "f25f5a1f-844c-4c01-9927-b2af1f8adf28"
		});

		const updatedHypothesisGeneration =
			await prisma.hypothesisGeneration.update({
				where: {
					id: hypothesisId
				},
				data: {
					proposedExperiments: experiment
				}
			});
		console.log(
			"Experiment generated, new hypothesis instance",
			updatedHypothesisGeneration
		);
		return NextResponse.json({
			updatedHypothesisGeneration
		});
	} catch (error) {
		console.error("Error updating instructions:"), error;
		return NextResponse.json({
			error: "Something went wrong",
			errorMeta: JSON.stringify(error)
		});
	}
}
