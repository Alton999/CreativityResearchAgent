import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";

export async function POST(req: Request, res: Response) {
	try {
		const { savedPaperId, promptId } = await req.json();
		await prisma.savedPaper.delete({
			where: {
				id: savedPaperId
			}
		});

		// Return back the entire fetch to refresh the UI
		const prompt = await prisma.prompt.findUnique({
			where: {
				id: promptId
			},
			select: {
				searchTerms: {
					select: {
						savedPapers: true
					}
				}
			}
		});
		if (!prompt) return NextResponse.json({ error: "Prompt not found" });
		const savedPapers = prompt.searchTerms.flatMap((term) => term.savedPapers);
		console.log("Saved paper deleted successfully");
		return NextResponse.json({
			savedPapers
		});
	} catch (error) {
		console.error("Error deleting hypothesis:"), error;
		return NextResponse.json({
			error: "Something went wrong",
			errorMeta: JSON.stringify(error)
		});
	}
}
