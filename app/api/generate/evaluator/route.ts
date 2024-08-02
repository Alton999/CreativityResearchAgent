// export const maxDuration = 300;
// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/db";
// import { evaluator } from "@/lib/evaluator";

// export async function POST(req: Request, res: Response) {
// 	try {
// 		console.log("Request from hypothesis evaluator");

// 		const hypothesisGeneration = await req.json();
// 		const hypothesisGenerationInstance =
// 			hypothesisGeneration.hypothesisGenerationInstance;
// 		console.log(
// 			"Hypothesis generation instance: ",
// 			hypothesisGenerationInstance
// 		);

// 		console.log("Prompt ID", hypothesisGenerationInstance.promptId);
// 		// Lets get the prompt instance
// 		const promptInstance = await prisma.prompt.findUnique({
// 			where: { id: hypothesisGenerationInstance.promptId }
// 		});
// 		if (!promptInstance) {
// 			return NextResponse.json({
// 				error: "Prompt instance not found"
// 			});
// 		}
// 		// Lets see if there is already an instance of search results in the database
// 		const existingEvaluation = await prisma.hypothesisEvaluation.findFirst({
// 			where: {
// 				promptId: hypothesisGenerationInstance.promptId
// 			}
// 		});

// 		// If instance exists return that instance else create new instance
// 		if (existingEvaluation) {
// 			console.log("Search result hypothesis exists:", existingEvaluation);
// 			return NextResponse.json({
// 				hypothesisEvaluation: existingEvaluation
// 			});
// 		} else {
// 			console.log("Creating new evaluation instance");

// 			const evaluation = await evaluator({
// 				context: hypothesisGenerationInstance.hypothesis,
// 				wordwarePromptId: "7ba6674f-7e99-4fbc-b834-931ad9c618cc",
// 				researchQuestion: promptInstance.researchQuestion
// 			});
// 			const hypothesisEvaluationInstance =
// 				await prisma.hypothesisEvaluation.create({
// 					data: {
// 						promptId: hypothesisGenerationInstance.promptId,
// 						evaluation: evaluation,
// 						searchTermId: hypothesisGenerationInstance.searchTermId
// 					}
// 				});

// 			// 	// console.log("Hypothesis generation:", hypothesisGenerationInstance);
// 			return NextResponse.json({
// 				hypothesisEvaluation: hypothesisEvaluationInstance
// 			});
// 		}
// 	} catch (error: any) {
// 		console.error("Error generating evaluation");
// 		console.error("Error message:", error.message);
// 		console.error("Error stack trace:", error.stack);

// 		return NextResponse.json({
// 			error: "Something went wrong",
// 			errorMeta: JSON.stringify(error)
// 		});
// 	}
// }
