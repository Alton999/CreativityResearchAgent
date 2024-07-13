import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { wordwareGenerator } from "@/lib/wordwareGenerator";

export async function POST(req: Request, res: Response) {
	try {
		const { selectedHypothesis, reframeResearchQuestionSelected } =
			await req.json();
		console.log("Selected Hypothesis:", selectedHypothesis);
		console.log(
			"Reframe Research Question Selected:",
			reframeResearchQuestionSelected
		);

		// Start with getting generation for hypothesis association
		// Form input string

		return NextResponse.json({
			selectedHypothesis
		});
	} catch (error) {
		console.error("Error updating instructions:"), error;
		return NextResponse.json({
			error: "Something went wrong",
			errorMeta: JSON.stringify(error)
		});
	}
}
