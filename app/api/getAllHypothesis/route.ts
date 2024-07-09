import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request, res: Response) {
	try {
		const { promptId } = await req.json();
		// Fetch the prompt
		if (!promptId) {
			return NextResponse.json(
				{ error: "Hypothesis ID not provided" },
				{ status: 400 }
			);
		}
		console.log("Prompt ID:", promptId);
		const prompt = await prisma.prompt.findUnique({
			where: {
				id: promptId
			},
			include: {
				hypothesisGeneration: true
			}
		});
		if (!prompt) {
			return NextResponse.json({ error: "Prompt not found" }, { status: 400 });
		}
		return NextResponse.json(prompt.hypothesisGeneration);
	} catch (error) {
		console.error("Error fetching hypothesis:");
		console.error("Error message:", error);
		return NextResponse.json(
			{
				error: "Error fetching hypothesis"
			},
			{
				status: 500
			}
		);
	}
}
