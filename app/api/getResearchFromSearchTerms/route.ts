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

export async function POST(req: Request, res: Response) {
	try {
		const { searchTerm, index } = await req.json();
		let allPapers = await prisma.savedPaper.findMany({
			where: {
				searchTermsId: searchTerm.id
			}
		});
		if (allPapers.length > 0) {
			// console.log("Paper found", allPapers);
			// remove duplicates from database if search terms has more than 3 saved papers
			if (allPapers.length > 3) {
				console.log("More than 3 papers found. Running deduplication...");
				// Start a transaction to ensure all operations are atomic
				allPapers = await prisma.$transaction(async (prisma) => {
					// Group papers by title
					const papersByTitle = allPapers.reduce((acc, paper) => {
						if (!acc[paper.title]) {
							acc[paper.title] = [];
						}
						acc[paper.title].push(paper);
						return acc;
					}, {} as Record<string, typeof allPapers>);

					// For each group of papers with the same title, keep the most recent one
					const papersToKeep = Object.values(papersByTitle).map(
						(group) => group[0]
					);

					// Delete all papers that is not duplicates
					await prisma.savedPaper.deleteMany({
						where: {
							searchTermsId: searchTerm.id,
							id: { notIn: papersToKeep.map((paper) => paper.id) }
						}
					});

					console.log("Papers to keep:", papersToKeep);

					return papersToKeep;
				});
			}
			console.log("All papers", allPapers);
			return NextResponse.json({ allPapers });
		}
		// Fetch papers
		try {
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
			console.log("Result from Exa:", result);
			// Can I clean up the author field with REGEX checks?
			const formattedPaperData: any[] = result.results.map((paper: any) => {
				let authors;
				let yearPublished;
				if (paper.author === "Username" || !paper.author) {
					authors = ["No author available"];
				} else {
					authors = paper.author
						.split(/[,;]/) // Split by comma or semicolon
						.map((author: string) => author.trim());
					console.log("Authors before cleaning:", authors);
					authors = cleanAuthors(authors);
					if (cleanAuthors.length === 0) {
						authors = ["No author available"];
					}
					console.log("Authors after cleaning:", authors);
				}
				if (paper.publishedDate) {
					yearPublished = extractPublishedYear(paper.publishedDate);
				} else {
					yearPublished = 0;
				}
				return {
					paperId: paper.id,
					title: paper.title,
					authors: authors,
					summary: paper.summary,
					text: paper.text,
					publishedYear: yearPublished,
					url: paper.url,
					searchTermsId: searchTerm.id // Assuming searchTerm.id is available in the scope
				};
			});
			// const response = await axios.get(
			// 	`http://api.semanticscholar.org/graph/v1/paper/search`,
			// 	{
			// 		params: {
			// 			query: searchTerm.searchTerm,
			// 			limit: 3,
			// 			fields: "title,abstract,url,authors,year,referenceCount",
			// 			sort: "citationCount:desc"
			// 		},
			// 		headers: {
			// 			Authorization: `Bearer ${process.env.SEMANTIC_SCHOLAR_API_KEY}`
			// 		}
			// 	}
			// );
			// console.log("Response from Semantic Scholar:", response.data.data);
			// const formattedPaperData = response.data.data.map(
			// 	(paper: SavedPaperTypes) => {
			// 		return {
			// 			paperId: JSON.stringify(paper.paperId),
			// 			title: paper.title,
			// 			authors: paper.authors.map((author: any) => author.name),
			// 			abstract:
			// 				paper.abstract === null
			// 					? "No abstract available"
			// 					: paper.abstract,
			// 			year: paper.year,
			// 			url: paper.url,
			// 			searchTermsId: searchTerm.id,
			// 			referenceCount: paper.referenceCount
			// 		};
			// 	}
			// );
			// console.log("Formatted paper data:", formattedPaperData);
			await prisma.savedPaper.createMany({
				data: formattedPaperData
			});

			return NextResponse.json({ allPapers: formattedPaperData });
		} catch (err) {
			console.error("Error fetching research from Exa api", err);
			return NextResponse.json(
				{ error: "Error fetching research from Exa api", err },
				{ status: 500 }
			);
		}
	} catch (error: any) {
		console.error("Error fetching research:");
		console.error("Error message:", error.message);
		return NextResponse.json(
			{ error: "Error fetching research" },
			{ status: 500 }
		);
	}
}
