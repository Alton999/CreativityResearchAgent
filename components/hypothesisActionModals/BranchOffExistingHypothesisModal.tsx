import React, { useEffect, useState } from "react";
import ModalLayout from "../ModalLayout";
import { Button } from "../ui/button";
import axios from "axios";
import { HypothesisGeneration as HypothesisGenerationTypes } from "@/types";
import { Circle, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "../ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

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
	const [instructions, setInstructions] = useState<string>("");
	const [generateAssociationButtonActive, setGenerateAssociationButtonActive] =
		useState<boolean>(false);

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
				In this action you will be able to branch off an existing hypothesis.
				The goal here is to find a hypothesis that you associate with and lead
				it in a direction you want.
			</p>
			<p>
				In addition, the system will pull a random paper in your system to
				associate with.
			</p>
			<div>
				<h3 className="font-bold mb-2">
					Select one hypothesis to branch off from
				</h3>
				{hypothesisLoading ? (
					<Loader2 className="animate-spin" size={24} />
				) : (
					<ScrollArea className="max-h-[350px] flex flex-col gap-4">
						<div className="pl-6 border-l border-slate-400">
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
										<h3 className="font-bold mb-2">
											{hypothesis.hypothesisTitle}
										</h3>
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
						</div>
					</ScrollArea>
				)}
			</div>
			<div className="space-y-2">
				<label htmlFor="name instruction" className="font-bold">
					Custom instructions: (Optional)
				</label>
				<textarea
					name="instruction"
					id="instruction"
					cols={20}
					rows={10}
					className="border border-slate-400 p-3 rounded-lg w-full"
					value={instructions}
					onChange={(e) => setInstructions(e.target.value)}
				/>
			</div>

			<Button
				className="w-full"
				onClick={() => generateAssociation()}
				disabled={!generateAssociationButtonActive}
			>
				Branch hypothesis
			</Button>
		</ModalLayout>
	);
};

export default BranchOffExistingHypothesisModal;
