import React, { useState } from "react";
import ModalLayout from "../ModalLayout";
import { Button } from "../ui/button";
import axios from "axios";
import { HypothesisGeneration as HypothesisGenerationTypes } from "@/types";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import useResearchStore from "@/store/useResearchStore";

type Props = {
	setActionToggleOpen: React.Dispatch<React.SetStateAction<string>>;
	setExperimentGenerationStatus: React.Dispatch<React.SetStateAction<string>>;
	hypothesisId: string;
};

const GenerateExperimentModal = ({
	setActionToggleOpen,
	hypothesisId,
	setExperimentGenerationStatus
}: Props) => {
	const { updateHypothesis } = useResearchStore();
	const { toast } = useToast();

	const [instructions, setInstructions] = useState<string>("");
	const generateExperiment = async () => {
		setActionToggleOpen("");
		setExperimentGenerationStatus("loading");
		const response = await axios.post(
			"/api/hypothesisActions/generateExperiment",
			{
				hypothesisId,
				instructions
			}
		);
		setExperimentGenerationStatus("done");
		toast({
			title: "Experiment generated successfully",
			variant: "success",
			description:
				"Check out the generated experiment attached to the hypothesis."
		});
		updateHypothesis(hypothesisId, response.data.updatedHypothesisGeneration);
	};
	return (
		<ModalLayout
			title="Generate feedback"
			closeModal={() => setActionToggleOpen("")}
		>
			<label htmlFor="name instruction">Custom instructions: (Optional)</label>
			<Textarea
				name="experiment instruction"
				id="experimentInstruction"
				rows={8}
				// className="border border-primary rounded-lg bg-slate-100 p-1.5"
				onChange={(e) => setInstructions(e.target.value)}
			/>
			<Button
				onClick={() => {
					// console.log("Button pressed");
					generateExperiment();
				}}
			>
				Generate Experiment
			</Button>
		</ModalLayout>
	);
};

export default GenerateExperimentModal;
