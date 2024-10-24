import React, { useEffect, useState } from "react";
import ModalLayout from "../ModalLayout";
import { Button } from "../ui/button";
import axios from "axios";
import { HypothesisGeneration as HypothesisGenerationTypes } from "@/types";
import { Circle, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "../ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "../ui/textarea";

type Props = {
	setSelectedHypothesisGenerationModal: React.Dispatch<
		React.SetStateAction<string>
	>;
	setNewHypothesisStatus: React.Dispatch<React.SetStateAction<string>>;
	onAddHypothesis: (hypothesis: HypothesisGenerationTypes) => void;
	promptId: string;
};

const BranchOffExistingHypothesisModal = ({
	setSelectedHypothesisGenerationModal,
	setNewHypothesisStatus,
	onAddHypothesis,
	promptId
}: Props) => {
	const { toast } = useToast();

	const [hypothesisLoading, setHypothesisLoading] = useState<boolean>(false);
	const [allHypothesis, setAllHypothesis] = useState<
		HypothesisGenerationTypes[]
	>([]);
	const [selectedHypothesis, setSelectedHypothesis] = useState<string[]>([]);
	const [generateAssociationButtonActive, setGenerateAssociationButtonActive] =
		useState<boolean>(false);
	const [instructions, setInstructions] = useState<string>("");
	const toggleHypothesisSelection = (id: string) => {
		setSelectedHypothesis((prevSelected) => {
			// If the clicked item is already selected, deselect it
			if (prevSelected.includes(id)) {
				return [];
			}
			// Otherwise, select only the clicked item
			return [id];
		});
	};
	const generateAssociation = async () => {
		setSelectedHypothesisGenerationModal("");
		setNewHypothesisStatus("loading");
		const response = await axios.post(
			"/api/hypothesisActions/generateBranchedHypothesis",
			{
				selectedHypothesis,
				instructions
			}
		);
		toast({
			title: "Hypothesis generated successfully with associations",
			variant: "success",
			description: "Check out the new hypothesis at the bottom of the page."
		});
		console.log("Response from hypothesis association", response);
		onAddHypothesis(response.data.newHypothesisInstance);
		setNewHypothesisStatus("done");

		// setHypothesisInstance(response.data.updatedHypothesisGeneration);
	};

	// Track button enable state
	useEffect(() => {
		if (selectedHypothesis.length === 1) {
			setGenerateAssociationButtonActive(true);
		}
	}, [selectedHypothesis]);

	useEffect(() => {
		const fetchAllHypothesis = async () => {
			setHypothesisLoading(true);
			const response = await axios.post("/api/getAllHypothesis", {
				promptId
			});
			setAllHypothesis(response.data);
			// console.log("All hypothesis:", response.data);
			setHypothesisLoading(false);
		};
		fetchAllHypothesis();
	}, [promptId]);
	return (
		<ModalLayout
			title="Branch of existing hypothesis"
			closeModal={() => setSelectedHypothesisGenerationModal("")}
		>
			<p>
				Branch of an existing hypothesis you find interesting to explore
				further.
			</p>
			<div>
				<h3 className="font-bold mb-2">
					Select one hypothesis to branch off from
				</h3>
				{hypothesisLoading ? (
					<Loader2 className="animate-spin" size={24} />
				) : (
					<ScrollArea className="max-h-[350px] flex flex-col gap-4 pr-3.5">
						{allHypothesis.map((hypothesis, index) => (
							<div
								key={hypothesis.id}
								className={`border border-slate-400 p-3 rounded-lg cursor-pointer flex justify-between mb-4 ${
									selectedHypothesis.includes(hypothesis.id)
										? "bg-slate-200"
										: ""
								}`}
								onClick={() => toggleHypothesisSelection(hypothesis.id)}
							>
								<div>
									<h3 className="font-bold mb-2">Hypothesis: {index + 1}</h3>
									<p className="text-slate-500 text-sm">
										{hypothesis.hypothesis.length > 120
											? `${hypothesis.hypothesis.substring(0, 120)}...`
											: hypothesis.hypothesis}
									</p>
								</div>
								<Circle
									size={32}
									color={
										selectedHypothesis.includes(hypothesis.id)
											? "#34495e"
											: "gray"
									}
									fill={
										selectedHypothesis.includes(hypothesis.id)
											? "#34495e"
											: "none"
									}
								/>
							</div>
						))}
					</ScrollArea>
				)}
			</div>
			<div className="space-y-3">
				<label htmlFor="branch instructions" className="font-bold">
					Instructions to guide hypothesis:
				</label>
				<Textarea
					name="branch instructions"
					id="branchInstructions"
					rows={8}
					// className="border border-primary rounded-lg bg-slate-100 p-1.5"
					onChange={(e) => setInstructions(e.target.value)}
				/>
			</div>
			{/* <div className="border border-slate-400 p-4 rounded-lg flex justify-between">
				<div>
					<h3 className="font-bold mb-2">Reframe research question</h3>
					<p className="text-slate-500 text-sm">
						By selecting this option you are able to reframe your initial
						research question based on the new associations made between the
						hypothesis.
					</p>
				</div>
				<Switch
					checked={reframeResearchQuestionSelected}
					onCheckedChange={() => {
						setReframeResearchQuestionSelected(
							!reframeResearchQuestionSelected
						);
					}}
				/>
			</div> */}
			{/* <label htmlFor="name instruction">Custom instructions: (Optional)</label> */}

			<Button
				onClick={() => generateAssociation()}
				disabled={!generateAssociationButtonActive}
			>
				Branch hypothesis
			</Button>
		</ModalLayout>
	);
};

export default BranchOffExistingHypothesisModal;
