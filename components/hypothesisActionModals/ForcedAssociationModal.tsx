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

const ForcedAssociationModal = ({
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

	const [reframeResearchQuestionSelected, setReframeResearchQuestionSelected] =
		useState<boolean>(false);
	const toggleHypothesisSelection = (id: string) => {
		setSelectedHypothesis((prevSelected) => {
			if (prevSelected.includes(id)) {
				return prevSelected.filter((hypothesisId) => hypothesisId !== id);
			} else if (prevSelected.length < 3) {
				return [...prevSelected, id];
			}
			return prevSelected;
		});
	};
	const generateAssociation = async () => {
		setSelectedHypothesisGenerationModal("");
		setNewHypothesisStatus("loading");
		const response = await axios.post(
			"/api/hypothesisActions/generateAssociations",
			{
				selectedHypothesis,
				reframeResearchQuestionSelected
			}
		);
		toast({
			title: "Hypothesis generated successfully with associations",
			variant: "success",
			description: "Check out the new hypothesis at the bottom of the page."
		});
		console.log("Response from hypothesis association", response);
		onAddHypothesis(response.data.allHypothesis);
		setNewHypothesisStatus("done");

		// setHypothesisInstance(response.data.updatedHypothesisGeneration);
	};

	// Track button enable state
	useEffect(() => {
		if (selectedHypothesis.length > 2) {
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
			console.log("All hypothesis:", response.data);
			setHypothesisLoading(false);
		};
		fetchAllHypothesis();
	}, [promptId]);
	return (
		<ModalLayout
			title="Forced association"
			closeModal={() => setSelectedHypothesisGenerationModal("")}
		>
			<p>
				In this action you as the lead scientist is able to find connections,
				similarities and associate multiple generated hypothesis. This action
				has the potential to expand the boundaries of creativity within each
				hypothesis to create something truly unique.
			</p>
			<div>
				<h3 className="font-bold mb-2">
					Select up to 3 hypothesis to associate
				</h3>
				{hypothesisLoading ? (
					<Loader2 className="animate-spin" size={24} />
				) : (
					<ScrollArea className="max-h-[400px] flex flex-col gap-4 pr-3.5">
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
			<div className="border border-slate-400 p-4 rounded-lg flex justify-between">
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
			</div>
			{/* <label htmlFor="name instruction">Custom instructions: (Optional)</label> */}

			<Button
				onClick={() => generateAssociation()}
				disabled={!generateAssociationButtonActive}
			>
				Start Association
			</Button>
		</ModalLayout>
	);
};

export default ForcedAssociationModal;
