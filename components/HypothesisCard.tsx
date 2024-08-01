import React, { useState, useEffect } from "react";

import axios from "axios";
import GenerateExperimentModal from "./hypothesisActionModals/GenerateExperimentModal";
import { Trash2, ChevronDown, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { HypothesisGeneration as HypothesisGenerationTypes } from "@/types";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

type HypothesisCardProps = {
	setHypothesisGeneration: React.Dispatch<
		React.SetStateAction<HypothesisGenerationTypes[]>
	>;
	hypothesis: HypothesisGenerationTypes;
	index: number;
};

const HypothesisCard = ({
	setHypothesisGeneration,
	hypothesis,
	index
}: HypothesisCardProps) => {
	// Initialise hypothesis state upon hydration
	const [hypothesisInstance, setHypothesisInstance] =
		useState<HypothesisGenerationTypes>(hypothesis);

	const [actionToggleOpen, setActionToggleOpen] = useState<string>("");
	const [selectedAction, setSelectedAction] = useState<string>("");
	const [experimentAccordionOpen, setExperimentAccordionOpen] =
		useState<boolean>(false);

	const deleteHypothesis = async (hypothesisId: string, promptId: string) => {
		const response = await axios.post("/api/deleteHypothesis", {
			hypothesisId,
			promptId
		});
		setHypothesisGeneration(response.data.hypothesisGenerationArray);
	};

	const actionToggle = (hypothesisId: string, actionType: string) => {
		if (hypothesisId === actionToggleOpen && actionType === selectedAction) {
			setActionToggleOpen("");
		} else {
			setActionToggleOpen(hypothesisId);
			setSelectedAction(actionType);
		}
	};

	// We can handle action methods here
	// Experiment generation
	const [experimentGenerationStatus, setExperimentGenerationStatus] =
		useState<string>("");

	useEffect(() => {
		if (hypothesis.proposedExperiments !== "") {
			setExperimentGenerationStatus("generated");
		}
	}, [hypothesis]);
	const renderActionComponent = (
		selectedAction: string,
		hypothesisId: string
	) => {
		switch (selectedAction) {
			case "experiment":
				return (
					<GenerateExperimentModal
						setActionToggleOpen={setActionToggleOpen}
						setExperimentGenerationStatus={setExperimentGenerationStatus}
						setHypothesisInstance={setHypothesisInstance}
						hypothesisId={hypothesisId}
					/>
				);
			default:
				return <div>No action selected</div>;
		}
	};

	return (
		<div className="p-4 border border-gray-200 rounded-md shadow-sm">
			<div className="w-full flex justify-between items-center">
				<h2 className="font-bold text-lg">Hypothesis: {index + 1}</h2>
				<div className="py-2">
					<Button
						variant={"outline"}
						className="py-4 flex gap-2 items-center px-2 rounded-lg text-red-500"
						onClick={() =>
							deleteHypothesis(
								hypothesisInstance.id,
								hypothesisInstance.promptId
							)
						}
					>
						<Trash2 size={16} color="red" />
					</Button>
				</div>
			</div>
			<p>{hypothesisInstance.hypothesis}</p>

			{/* Experiments show if exists or loading */}
			{(experimentGenerationStatus !== "" ||
				hypothesisInstance.proposedExperiments !== "") && (
				<div className="border rounded-lg p-4 my-4">
					<div
						className={`w-full flex justify-between ${
							experimentGenerationStatus !== "" &&
							experimentGenerationStatus !== "loading" &&
							"cursor-pointer"
						}`}
						onClick={() => {
							if (experimentGenerationStatus !== "loading")
								setExperimentAccordionOpen(!experimentAccordionOpen);
						}}
					>
						<h2 className="font-bold text-lg">Experiment design document</h2>
						{experimentGenerationStatus === "loading" ? (
							<div className="flex gap-2 border border-amber-500 bg-amber-100 py-2 px-4 rounded-full">
								<p className="font-bold text-amber-800">Designing experiment</p>
								<Loader2 color="orange" className="animate-spin" size={24} />
							</div>
						) : (
							<div
								className={`flex gap-2 border ${
									experimentGenerationStatus === "done"
										? "border-green-800 bg-green-100"
										: "border-slate-500 bg-slate-100"
								}  py-2 px-4 rounded-full`}
							>
								<p className="font-bold text-slate-800">
									{experimentAccordionOpen
										? "Hide experiment"
										: "Show experiment"}
								</p>
								{/* <Loader2 color="green" className="animate-spin" size={24} /> */}
								<ChevronDown size={24} className="cursor-pointer" />
							</div>
						)}
					</div>
					{experimentAccordionOpen && (
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
									<h1 className="font-bold text-2xl my-2">{children}</h1>
								),
								h2: ({ children }) => (
									<h2 className="font-semibold text-2xl my-2">{children}</h2>
								),
								h3: ({ children }) => (
									<h3 className="font-semibold text-xl my-2">{children}</h3>
								),
								h4: ({ children }) => (
									<h4 className="font-bold text-lg my-2">{children}</h4>
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
							{hypothesisInstance.proposedExperiments}
						</ReactMarkdown>
					)}
				</div>
			)}

			<div className="flex flex-col gap-4 mt-4">
				<h3 className="font-bold">Hypothesis regeneration actions:</h3>
				<div className="flex gap-4">
					<Button
						variant={"outline"}
						onClick={() => actionToggle(hypothesisInstance.id, "experiment")}
					>
						Generate experiments
					</Button>
					{/* <Button variant={"outline"}>Evaluate hypothesis</Button> */}
				</div>
			</div>

			{actionToggleOpen === hypothesisInstance.id &&
				renderActionComponent(selectedAction, hypothesisInstance.id)}
		</div>
	);
};

export default HypothesisCard;
