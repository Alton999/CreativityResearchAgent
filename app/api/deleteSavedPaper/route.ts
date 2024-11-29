import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";

export async function POST(req: Request, res: Response) {
	try {
		const { savedPaperId, promptId } = await req.json();

		const paperToDelete = await prisma.savedPaper.findUnique({
            where: {
                id: savedPaperId
            }
        });

    if (!paperToDelete) {
        return NextResponse.json({ error: "Saved paper not found" });
    }

    await prisma.savedPaper.delete({
      where: {
          id: savedPaperId
      }
    });

		// Return back the entire fetch to refresh the UI
		const savedPapers = await prisma.savedPaper.findMany({
      where: {
          searchTermsId: paperToDelete.searchTermsId
      }
    });

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
