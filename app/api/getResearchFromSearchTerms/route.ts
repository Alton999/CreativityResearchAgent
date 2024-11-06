import axios from "axios";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { SavedPaper as SavedPaperTypes } from "@/types";
import Exa from "exa-js";

const cleanAuthors = (authors: string[]): string[] => {
	// Regex pattern to match names (more lenient)
	const namePattern = /^[A-Z][a-z]+(?:[-\s'][A-Za-z]+)*$/;

	// Function to check if a string is likely an email
	const isEmail = (str: string): boolean =>
		/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);

	// Function to check if a string is likely a location
	const isLocation = (str: string): boolean =>
		/^(?:The\s)?[A-Z][a-z]+(?:[\s-][A-Z][a-z]+)*$/.test(str) &&
		!namePattern.test(str);

	// Join consecutive name parts
	const joinedAuthors: string[] = [];
	let currentName = "";

	for (const part of authors) {
		if (namePattern.test(part) || /^(?:and|[A-Z])$/.test(part)) {
			currentName += (currentName ? " " : "") + part;
		} else {
			if (currentName) {
				joinedAuthors.push(currentName.trim());
				currentName = "";
			}
			joinedAuthors.push(part);
		}
	}
	if (currentName) {
		joinedAuthors.push(currentName.trim());
	}

	// Filter the array to keep only items that look like names
	const cleanedAuthors = joinedAuthors.filter(
		(item) =>
			(namePattern.test(item) || /^[A-Z][a-z]+\s[A-Z][a-z]+/.test(item)) &&
			!isEmail(item) &&
			!isLocation(item)
	);

	// Remove duplicates and 'and'
	return Array.from(new Set(cleanedAuthors)).filter(
		(name) => name.toLowerCase() !== "and"
	);
};

const extractPublishedYear = (isoDateString: string) => {
	console.log("Extracting year from date string:", isoDateString);
	const yearMatch = isoDateString.match(/^(\d{4})/);

	if (yearMatch) {
		// Convert the matched year string to a number
		return Number(yearMatch[1]);
	} else {
		// Return null or throw an error if the year can't be extracted
		return 0;
	}
};

export async function POST(req: Request) {
	try {
		const { searchTerm, index } = await req.json();
		let allPapers = await prisma.savedPaper.findMany({
			where: {
				searchTermsId: searchTerm.id
			},
			take: 3
		});

		if (allPapers.length > 0) {
			console.log("Returning existing papers:", allPapers.length);
			return NextResponse.json({ allPapers: allPapers });
		}
		// Fetch papers

		console.log("Fetching research from Exa api");
		// Initialise Exa
		const exa = new Exa(process.env.EXA_API_KEY);
		// Create a delay based on the index from the response
		// This is to prevent rate limiting from Semantic Scholar
		const result = await exa.searchAndContents(searchTerm.searchTerm, {
			type: "neural",
			useAutoprompt: true,
			numResults: 3,
			text: true,
			category: "research paper",
			summary: {
				query:
					"Summarize the content of the text, DO NOT include things about the author, or the source its from"
			}
		});

		// Can I clean up the author field with REGEX checks?
		const formattedPaperData = result.results.map((paper: any) => ({
			paperId: paper.id,
			title: paper.title,
			authors: cleanAuthors(
				paper.author ? paper.author.split(/[,;]/) : ["No author available"]
			),
			summary: paper.summary,
			text: paper.text,
			publishedYear: paper.publishedDate
				? extractPublishedYear(paper.publishedDate)
				: 0,
			url: paper.url,
			searchTermsId: searchTerm.id
		}));

		// Use transaction to ensure atomic operation
		const savedPapers = await prisma.$transaction(async (tx) => {
			// Delete any existing papers for this search term (cleanup)
			await tx.savedPaper.deleteMany({
				where: { searchTermsId: searchTerm.id }
			});

			// Create new papers
			const papers = await tx.savedPaper.createMany({
				data: formattedPaperData
			});

			return formattedPaperData;
		});

		return NextResponse.json({ allPapers: savedPapers });
	} catch (error: any) {
		console.error("Error fetching research:");
		console.error("Error message:", error.message);
		return NextResponse.json(
			{ error: "Error fetching research" },
			{ status: 500 }
		);
	}
}
