import { ZodError } from "zod";
import { userLoginSchema } from "@/schemas/userInfo";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    const { email } = userLoginSchema.parse(body);
    console.log("Email:", email);
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      console.log("User ID:", existingUser.id);
      // Let's set the cookie here'
      const cookieStore = cookies();
      cookieStore.set("userId", existingUser.id, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
      return NextResponse.json({ userId: existingUser.id });
    } else {
      return NextResponse.json(
        { error: "Email doesn't exist, please sign up or try another email." },
        { status: 400 },
      );
    }
  } catch (error: any) {
    console.error("Error signing in:");
    console.error("Error message:", error.message);
    console.error("Error stack trace:", error.stack);
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({
      error: "Something went wrong",
      errorMeta: JSON.stringify(error),
    });
  }
}
