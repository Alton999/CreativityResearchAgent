import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url);
		const promptId = searchParams.get("promptId");
		console.log("PromptID:", promptId);
		if (!promptId) {
			return NextResponse.json(
				{ error: "Prompt ID not provided" },
				{ status: 400 }
			);
		}
		const prompt = await prisma.prompt.findUnique({
			where: {
				id: promptId
			},
			include: {
				searchTerms: true,
				// searchResults: true,
				hypothesisGeneration: true
			}
		});
		console.log("Prompt:", prompt);
		if (!prompt) {
			return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
		}
		return NextResponse.json(prompt);
	} catch (error: any) {
		console.error("Error fetching prompt:");
		console.error("Error message:", error.message);
		return NextResponse.json(
			{ error: "Error fetching prompt" },
			{ status: 500 }
		);
	}
}
