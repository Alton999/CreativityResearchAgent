import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
	try {
		// Get new text and update prisma status, expect to receive promptId and edit
		const { hypothesisId, editedText } = await req.json();

		// Update prisma record of the search summary

		// We need to handle edit of hypothesis generation instance
		console.log("Hypothesis ID:", hypothesisId);
		// Check if the record exists
		const existingRecord = await prisma.hypothesisGeneration.findUnique({
			where: { id: hypothesisId }
		});
		console.log("Existing record:", existingRecord);
		if (!existingRecord) {
			return NextResponse.json(
				{ error: `Hypothesis with ID ${hypothesisId} not found.` },
				{ status: 404 }
			);
		}
		const editedHypothesisGeneration = await prisma.hypothesisGeneration.update(
			{
				where: {
					id: hypothesisId
				},
				data: {
					hypothesis: editedText
				}
			}
		);
		return NextResponse.json(editedHypothesisGeneration);
	} catch (error) {
		console.log("Error while editing search summary:", error);
		return NextResponse.json({
			error: "There's an error while making the edits. Please try again.",
			errorMeta: JSON.stringify(error)
		});
	}
}
