import { ZodError } from "zod";
import { userInfoSchema } from "@/schemas/userInfo";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    const { name, email, organisation, role } = userInfoSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists, please login or use another email." },
        { status: 400 },
      );
    } else {
      const user = await prisma.user.create({
        data: {
          name,
          email,
          organisation,
          role,
        },
      });
      const cookieStore = cookies();
      cookieStore.set("userId", user.id, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
      console.log("User created successfully, User ID:", user);
      return NextResponse.json({ userId: user.id });
    }
  } catch (error: any) {
    console.error("Error creating user:");
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
