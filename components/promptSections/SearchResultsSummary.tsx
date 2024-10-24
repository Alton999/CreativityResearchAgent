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
import useResearchStore from "@/store/useResearchStore";

type Props = {
	hypothesisButtonActive: boolean;
	// searchResultsSummaryLoading: boolean;
};

const SearchResultsSummary = ({
	hypothesisButtonActive
}: // searchResultsSummaryLoading
Props) => {
	const { prompt, updatePrompt, addHypothesis } = useResearchStore();

	const [editable, setEditable] = useState<boolean>(false);
	const [searchSummaryEditLoading, setSearchSummaryEditLoading] =
		useState<boolean>(false);

	const [hypothesisGenerationLoading, setHypothesisGenerationLoading] =
		useState<boolean>(false);

	const handleSave = async () => {
		setSearchSummaryEditLoading(true);
		if (!prompt) return;
		const response = await axios.post("/api/userEdits/searchSummaryEdit", {
			promptId: prompt.id,
			editedText: prompt.searchResultsSummary
		});
		setSearchSummaryEditLoading(false);
		setEditable(false);
		console.log("Search edit success", response);
	};

	const generateInitialHypothesis = async () => {
		setHypothesisGenerationLoading(true);
		try {
			const response = await axios.post("/api/generate/hypothesisGenerator", {
				promptId: prompt?.id
			});
			console.log("Response from hypothesis generation", response);
			const hypothesisGenerationArray: HypothesisGenerationTypes[] =
				response.data.hypothesisGenerationArray;
			hypothesisGenerationArray.forEach((hypothesis) => {
				addHypothesis(hypothesis);
			});
		} catch (error) {
			console.error("Error generating hypothesis:", error);
		} finally {
			setHypothesisGenerationLoading(false);
		}
	};
	const handleSearchSummaryChange = (value: string) => {
		if (prompt) {
			updatePrompt({ ...prompt, searchResultsSummary: value });
		}
	};
	if (!prompt) {
		return <div>Prompt not found.</div>;
	}
	return (
		<section id="search-results">
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
							value={prompt.searchResultsSummary}
							onChange={(e) => handleSearchSummaryChange(e.target.value)}
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
								h1: ({ children }) => (
									<h1 className="font-bold text-2xl mb-2">{children}</h1>
								),
								h2: ({ children }) => (
									<h2 className="font-bold text-xl mb-2">{children}</h2>
								),
								h3: ({ children }) => (
									<h3 className="font-semibold text-lg mb-2">{children}</h3>
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
							{prompt.searchResultsSummary}
						</ReactMarkdown>
					)}
					<Button
						disabled={!hypothesisButtonActive || hypothesisGenerationLoading}
						onClick={() => generateInitialHypothesis()}
						className="mt-4 w-full"
					>
						{hypothesisGenerationLoading ? (
							<Loader2 className="animate-spin" />
						) : (
							"Generate initial hypothesis"
						)}
					</Button>
				</CardContent>
			</Card>
		</section>
	);
};

export default SearchResultsSummary;
