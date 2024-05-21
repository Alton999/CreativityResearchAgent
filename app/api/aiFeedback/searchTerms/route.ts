import { ZodError } from "zod";
export const maxDuration = 300;
import { feedbackSchema } from "@/schemas/feedback";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { searchTermFeedbackWordware } from "@/lib/searchTermFeedbackWordware";

export async function POST(req: Request, res: Response) {
	try {
		const body = await req.json();
		const { feedback, searchTerm } = feedbackSchema.parse(body);

		const newSearchTerm = await searchTermFeedbackWordware({
			searchTerm: searchTerm.searchTerm,
			searchTermEvaluation: searchTerm.explanation,
			userFeedback: feedback,
			researchQuestion: searchTerm.question,
			wordwarePromptId: "b6226ac8-335c-4301-9c0e-1dd8ec47f6ea"
		});

		// Update prisma record of the search term
		const newSearchTermInstance = await prisma.searchTerms.create({
			data: {
				promptId: searchTerm.promptId,
				searchTerm: newSearchTerm.searchTerm,
				explanation: newSearchTerm.explanation,
				question: searchTerm.question,
				field: searchTerm.field,
				newSearchTerm: true,
				parentId: searchTerm.id
			}
		});
		// const allSearchTerms = searchTerms.map((term) => {
		// 	return {
		// 		promptId: promptInstance.id,
		// 		question: question,
		// 		field: field,
		// 		searchTerm: term.searchTerm,
		// 		explanation: term.explanation
		// 	};
		// });
		// await prisma.searchTerms.createMany({
		// 	data: allSearchTerms
		// });

		// const promptId = promptInstance.id;
		return NextResponse.json({ searchTermInstance: newSearchTermInstance });
	} catch (error: any) {
		console.error("Error creating prompt:");
		console.error("Error message:", error.message);
		console.error("Error stack trace:", error.stack);
		if (error instanceof ZodError) {
			return NextResponse.json({ error: error.issues }, { status: 400 });
		}
		return NextResponse.json({
			error: "Something went wrong",
			errorMeta: JSON.stringify(error)
		});
	}
}
