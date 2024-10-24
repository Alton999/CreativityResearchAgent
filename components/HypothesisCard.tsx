import React, { useState, useEffect } from "react";
import axios from "axios";
import GenerateExperimentModal from "./hypothesisActionModals/GenerateExperimentModal";
import { Trash2, ChevronDown, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { HypothesisGeneration as HypothesisGenerationTypes } from "@/types";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import useResearchStore from "@/store/useResearchStore";

type HypothesisCardProps = {
	index: number;
	hypothesisInstance: HypothesisGenerationTypes;
};

const HypothesisCard = ({ hypothesisInstance, index }: HypothesisCardProps) => {
	const { prompt, removeHypothesis } = useResearchStore();
	const [actionToggleOpen, setActionToggleOpen] = useState<string>("");
	const [selectedAction, setSelectedAction] = useState<string>("");
	const [experimentAccordionOpen, setExperimentAccordionOpen] =
		useState<boolean>(false);
	const [experimentGenerationStatus, setExperimentGenerationStatus] =
		useState<string>("");

	useEffect(() => {
		if (hypothesisInstance.proposedExperiments !== "") {
			setExperimentGenerationStatus("generated");
		} else {
			setExperimentGenerationStatus("");
		}
	}, [hypothesisInstance]);

	const deleteHypothesis = async (hypothesisId: string) => {
		if (prompt) {
			const response = await axios.post("/api/deleteHypothesis", {
				hypothesisId,
				promptId: prompt.id
			});
			removeHypothesis(hypothesisId);
		}
	};

	const actionToggle = (hypothesisId: string, actionType: string) => {
		if (hypothesisId === actionToggleOpen && actionType === selectedAction) {
			setActionToggleOpen("");
		} else {
			setActionToggleOpen(hypothesisId);
			setSelectedAction(actionType);
		}
	};

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
						hypothesisId={hypothesisId}
					/>
				);
			default:
				return <div>No action selected</div>;
		}
	};

	if (!hypothesisInstance) return <div>Hypothesis not found.</div>;

	return (
		<div
			id={hypothesisInstance.id}
			className="p-4 border border-gray-200 rounded-md shadow-sm"
		>
			<div className="w-full flex justify-between items-center">
				<h2 className="font-bold text-lg">Hypothesis: {index + 1}</h2>
				<div className="py-2">
					<Button
						variant={"outline"}
						className="py-4 flex gap-2 items-center px-2 rounded-lg text-red-500"
						onClick={() => deleteHypothesis(hypothesisInstance.id)}
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
				</div>
			</div>

			{actionToggleOpen === hypothesisInstance.id &&
				renderActionComponent(selectedAction, hypothesisInstance.id)}
		</div>
	);
};

export default HypothesisCard;
