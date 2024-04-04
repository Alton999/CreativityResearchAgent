import { ZodError } from "zod";
export const maxDuration = 300;
import { promptInputsSchema } from "@/schemas/promptInputs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { wordware } from "@/lib/wordware";

export async function POST(req: Request, res: Response) {
	try {
		const body = await req.json();
		const { question, field } = promptInputsSchema.parse(body);
		const cookieStore = cookies();
		const userId = cookieStore.get("userId");
		if (!userId) {
			return NextResponse.json(
				{ error: "User not authenticated, please sign in." },
				{ status: 401 }
			);
		}
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

		const search_terms = await wordware({
			question: question,
			field: field,
			wordwarePromptId: "2241c8ff-339f-4330-a284-383bda778d8f"
		});
		await prisma.searchTerms.create({
			data: {
				promptId: promptInstance.id,
				question: question,
				field: field,
				searchTerm: search_terms
			}
		});
		const promptId = promptInstance.id;
		return NextResponse.json({ promptId });
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
