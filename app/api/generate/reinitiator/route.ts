export const maxDuration = 300;
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { reinitiator } from "@/lib/reinitiator";

export async function POST(req: Request, res: Response) {
	try {
		console.log("Request from hypothesis evaluator");

		const hypothesisEvaluation = await req.json();
		const hypothesisEvaluationInstance =
			hypothesisEvaluation.hypothesisEvaluationInstance;
		console.log(
			"Hypothesis generation instance: ",
			hypothesisEvaluationInstance
		);

		console.log("Prompt ID", hypothesisEvaluationInstance.promptId);
		// Lets get the prompt instance
		const promptInstance = await prisma.prompt.findUnique({
			where: { id: hypothesisEvaluationInstance.promptId }
		});
		if (!promptInstance) {
			return NextResponse.json({
				error: "Prompt instance not found"
			});
		}
		return NextResponse.json({
			message: "Prompt instance not found"
		});
		// Lets see if there is already an instance of search results in the database
		// const existingReinitiation = await prisma.reinitiator.findFirst({
		// 	where: {
		// 		promptId: hypothesisEvaluationInstance.promptId
		// 	}
		// });

		// If instance exists return that instance else create new instance
		// if (existingReinitiation) {
		// 	console.log("Search result hypothesis exists:", existingReinitiation);
		// 	return NextResponse.json({
		// 		reinitiation: existingReinitiation
		// 	});
		// } else {
		// 	console.log("Creating new evaluation instance");

		// 	const reinitiation = await reinitiator({
		// 		evaluation: hypothesisEvaluationInstance.evaluation,
		// 		wordwarePromptId: "3e8aa0e0-ecc3-4f90-8024-713ca293583e",
		// 		researchQuestion: promptInstance.researchQuestion
		// 	});
		// 	const reinitiatorInstance = await prisma.reinitiator.create({
		// 		data: {
		// 			promptId: hypothesisEvaluationInstance.promptId,
		// 			hypothesisId: hypothesisEvaluationInstance.hypothesisId,
		// 			searchTermId: hypothesisEvaluationInstance.searchTermId,
		// 			searchResultId: hypothesisEvaluationInstance.searchResultId,
		// 			hypothesisEvaluationId: hypothesisEvaluationInstance.id,
		// 			reinitiation: reinitiation
		// 		}
		// 	});

		// 	// 	// console.log("Hypothesis generation:", hypothesisGenerationInstance);
		// 	return NextResponse.json({
		// 		reinitiation: reinitiatorInstance
		// 	});
		// }
	} catch (error: any) {
		console.error("Error generating evaluation");
		console.error("Error message:", error.message);
		console.error("Error stack trace:", error.stack);

		return NextResponse.json({
			error: "Something went wrong",
			errorMeta: JSON.stringify(error)
		});
	}
}
