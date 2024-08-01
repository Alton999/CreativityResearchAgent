import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { wordwareGenerator } from "@/lib/wordwareGenerator";
import { cleanupStringToJSON } from "@/lib/cleanStringToJSON";

export async function POST(req: Request, res: Response) {
	try {
		let { instructions, promptId } = await req.json();
		console.log(
			"Generating new hypothesis with these instructions: ",
			instructions
		);

		// fetch all hypothesis associated with the prompt
		const hypothesisInPrompt = await prisma.hypothesisGeneration.findMany({
			where: {
				promptId: promptId
			},
			select: {
				hypothesis: true
			}
		});

		// Extract the hypothesis into an array
		const hypotheses = hypothesisInPrompt.map((h) => h.hypothesis);

		// Fetch the prompt
		const prompt = await prisma.prompt.findUnique({
			where: {
				id: promptId
			}
		});
		if (!prompt) return NextResponse.json({ error: "Prompt not found" });

		// console.log("Hypothesis Generation Array:", hypotheses);
		if (instructions === "") {
			instructions = "No specific instructions";
		}
		// Create inputs for wordware
		const inputs = {
			all_hypothesis: hypotheses,
			search_results: prompt.searchResultsSummary,
			research_question: prompt.researchQuestion,
			instructions: instructions
		};
		console.log;
		const newHypothesis = await wordwareGenerator({
			inputs: inputs,
			wordwarePromptId: "7c078190-b478-4eb5-999d-36e70fd00b3c"
		});

		// console.log("Raw string output", newHypothesis);
		const hypothesisJson = JSON.parse(cleanupStringToJSON(newHypothesis, ""));
		// Create the new hypothesis
		await prisma.hypothesisGeneration.create({
			data: {
				promptId: prompt.id,
				hypothesis: hypothesisJson.hypothesis,
				justification: hypothesisJson.reasoning
			}
		});
		// Fetch all hypothesis
		const allHypothesis = await prisma.hypothesisGeneration.findMany({
			where: {
				promptId: prompt.id
			}
		});
		// console.log("New Hypothesis:", allHypothesis);
		return NextResponse.json({
			allHypothesis
		});
	} catch (error) {
		console.error("Error generating associations:", error);
		return NextResponse.json({
			error: "Something went wrong",
			errorMeta: JSON.stringify(error)
		});
	}
}
