import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
	try {
		// Get new text and update prisma status, expect to receive promptId and edit
		const { promptId, editedText } = await req.json();

		// Update prisma record of the search summary
		const editedPromptInstance = await prisma.prompt.update({
			where: {
				id: promptId
			},
			data: {
				searchResultsSummary: editedText
			}
		});
		return NextResponse.json({ editedPromptInstance: editedPromptInstance });
	} catch (error) {
		console.log("Error while editing search summary:", error);
		return NextResponse.json({
			error: "There's an error while making the edits. Please try again.",
			errorMeta: JSON.stringify(error)
		});
	}
}
