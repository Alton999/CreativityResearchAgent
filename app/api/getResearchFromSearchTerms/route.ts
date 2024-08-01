import axios from "axios";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { SavedPaper as SavedPaperTypes } from "@/types";

type COREPaperResponseType = {
	id: string;
	title: string;
	authors: string[];
	abstract: string;
	year: number;
	downloadUrl: string;
};

export async function POST(req: Request, res: Response) {
	try {
		const { searchTerm } = await req.json();
		console.log("Search term:", searchTerm);
		const response = await axios.get(`https://api.core.ac.uk/v3/search/works`, {
			params: {
				q: searchTerm.searchTerm,
				limit: 3,
				offset: 0,
				fields: "id,title,authors,abstract,year,downloadUrl"
			},
			headers: {
				Authorization: `Bearer ${process.env.CORE_API_KEY}`
			}
		});

		// Check if response actually found a paper
		if (response.data.totalHits === 0) {
			return NextResponse.json({ savedPapers: [] });
		}
		console.log("Response:", response.data);
		const formattedPaperData = response.data.results.map(
			(paper: COREPaperResponseType) => {
				return {
					paperId: JSON.stringify(paper.id),
					title: paper.title,
					authors: paper.authors.map((author: any) => author.name),
					abstract: paper.abstract,
					year: paper.year,
					url: paper.downloadUrl,
					searchTermsId: searchTerm.id
				};
			}
		);
		console.log("Formatted paper data:", formattedPaperData);
		// Lets save these search terms to prisma
		await prisma.savedPaper.createMany({
			data: formattedPaperData
		});

		const allPapers = await prisma.savedPaper.findMany({
			where: {
				searchTermsId: searchTerm.id
			}
		});
		console.log("Response:", allPapers);
		return NextResponse.json({ allPapers });
	} catch (error: any) {
		console.error("Error fetching research:");
		console.error("Error message:", error.message);
		return NextResponse.json(
			{ error: "Error fetching research" },
			{ status: 500 }
		);
	}
}
