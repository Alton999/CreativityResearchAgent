import { ZodError } from "zod";
export const maxDuration = 300;
import { promptInputsSchema } from "@/schemas/promptInputs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { wordware } from "@/lib/wordware";

export async function POST(req: Request, res: Response) {
	const cookieStore = cookies();
	const userId = cookieStore.get("userId");
	if (!userId) {
		return NextResponse.json(
			{ error: "User not authenticated, please sign in." },
			{ status: 401 }
		);
	}
	try {
		const body = await req.json();
		const { question, field } = promptInputsSchema.parse(body);

		const userIdString = userId.value as string;
		console.log("User ID:", userIdString);

		// Check if user exists in the database
		const existingUser = await prisma.user.findUnique({
			where: { id: userIdString }
		});
		if (!existingUser) {
			return NextResponse.json(
				{ error: "User does not exist, please sign in." },
				{ status: 401 }
			);
		}
		// Create prompt instance in the database
		const promptInstance = await prisma.prompt.create({
			data: {
				userId: userIdString,
				researchQuestion: question,
				researchField: field
			}
		});

		const searchTerms = await wordware({
			question: question,
			field: field,
			wordwarePromptId: "1bc52400-ac36-4904-81fd-968baa6b2946"
		});

		const allSearchTerms = searchTerms.map((term) => {
			return {
				promptId: promptInstance.id,
				question: question,
				field: field,
				searchTerm: term.searchTerm,
				explanation: term.explanation
			};
		});
		await prisma.searchTerms.createMany({
			data: allSearchTerms
		});

		const promptId = promptInstance.id;
		return NextResponse.json({ promptId: promptId });
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
