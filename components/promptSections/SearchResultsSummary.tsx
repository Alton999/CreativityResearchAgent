// Here we can use
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { HypothesisGeneration as HypothesisGenerationTypes } from "@/types";
import { Button } from "../ui/button";
import { Pencil, ArrowDownToLine, Loader2 } from "lucide-react";
import axios from "axios";

type Props = {
	searchResultsSummary: string;
	setHypothesisGeneration: React.Dispatch<
		React.SetStateAction<HypothesisGenerationTypes[]>
	>;
	setSearchResultsSummary: React.Dispatch<React.SetStateAction<string>>;
	promptId: string;
	// searchResultsSummaryLoading: boolean;
};

const SearchResultsSummary = ({
	searchResultsSummary,
	setHypothesisGeneration,
	setSearchResultsSummary,
	promptId
}: // searchResultsSummaryLoading
Props) => {
	const [editable, setEditable] = useState<boolean>(false);
	const [searchSummaryEditLoading, setSearchSummaryEditLoading] =
		useState<boolean>(false);

	const handleSave = async () => {
		setSearchSummaryEditLoading(true);
		const response = await axios.post("/api/userEdits/searchSummaryEdit", {
			promptId: promptId,
			editedText: searchResultsSummary
		});
		setSearchSummaryEditLoading(false);
		setEditable(false);
		console.log("Search edit success", response);
	};

	const generateInitialHypothesis = async () => {
		console.log("Generating initial hypothesis");
		const response = await axios.post("/api/generate/hypothesisGenerator", {
			promptId
		});
		console.log("Response from hypothesis generation", response);
		setHypothesisGeneration(response.data.hypothesisGenerationArray);
		console.log("From response in search results summary", response);
	};
	return (
		<Card>
			<CardHeader className="flex flex-row justify-between items-center">
				<CardTitle>Search results summary document</CardTitle>
				{!editable ? (
					<Button variant={"outline"} onClick={() => setEditable(!editable)}>
						<div className="flex gap-2 items-center">
							<span className="">Edit</span>
							<Pencil size={"16"} />
						</div>
					</Button>
				) : (
					<Button
						disabled={searchSummaryEditLoading}
						onClick={() => handleSave()}
					>
						<div className="flex gap-2 items-center">
							<span className="">Save</span>
							{searchSummaryEditLoading ? (
								<Loader2 className="animate-spin" size={16} />
							) : (
								<ArrowDownToLine size={"16"} />
							)}
						</div>
					</Button>
				)}
			</CardHeader>
			<CardContent>
				{editable ? (
					<textarea
						value={searchResultsSummary}
						onChange={(e) => setSearchResultsSummary(e.target.value)}
						className="w-full h-[800px] p-4 border border-gray-300 rounded-lg"
					/>
				) : (
					<ReactMarkdown
						components={{
							p: ({ children }) => <p className="mb-2">{children}</p>,
							ol: ({ children }) => (
								<ol className="list-disc ml-4 space-y-2 mb-4">{children}</ol>
							),
							ul: ({ children }) => (
								<ul className="list-disc ml-6 space-y-2 mb-4">{children}</ul>
							),
							h3: ({ children }) => (
								<h3 className="font-bold text-lg mb-2">{children}</h3>
							),
							code({ children }) {
								return (
									<SyntaxHighlighter
										style={coldarkDark}
										customStyle={{
											margin: 0,
											padding: "1rem",
											width: "100%"
											// background: "transparent"
										}}
										lineNumberStyle={{
											userSelect: "none"
										}}
										codeTagProps={{
											className:
												"font-mono text-sm break-anywhere md:break-normal"
										}}
										wrapLines
										wrapLongLines
									>
										{Array.isArray(children) ? children : [children]}
									</SyntaxHighlighter>
								);
							}
						}}
					>
						{searchResultsSummary}
					</ReactMarkdown>
				)}
				<Button
					onClick={() => generateInitialHypothesis()}
					className="mt-4 w-full"
				>
					Generate initial hypothesis
				</Button>
			</CardContent>
		</Card>
	);
};

export default SearchResultsSummary;
