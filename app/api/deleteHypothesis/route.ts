import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";

export async function POST(req: Request, res: Response) {
	try {
		const { hypothesisId, promptId } = await req.json();
		await prisma.hypothesisGeneration.delete({
			where: {
				id: hypothesisId
			}
		});

		// Return back the entire fetch to refresh the UI
		const hypothesisGenerationArray =
			await prisma.hypothesisGeneration.findMany({
				where: {
					promptId
				}
			});
		console.log("Hypothesis deleted successfully");
		return NextResponse.json({
			hypothesisGenerationArray
		});
	} catch (error) {
		console.error("Error deleting hypothesis:"), error;
		return NextResponse.json({
			error: "Something went wrong",
			errorMeta: JSON.stringify(error)
		});
	}
}
