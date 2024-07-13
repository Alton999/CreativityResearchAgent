import React, { useState } from "react";
import ModalLayout from "./ModalLayout";
import { Button } from "../ui/button";
import axios from "axios";
import { HypothesisGeneration as HypothesisGenerationTypes } from "@/types";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

type Props = {
	setActionToggleOpen: React.Dispatch<React.SetStateAction<string>>;
	setIsExperimentLoading: React.Dispatch<React.SetStateAction<boolean>>;
	hypothesisId: string;
	setHypothesisInstance: React.Dispatch<
		React.SetStateAction<HypothesisGenerationTypes>
	>;
	isExperimentLoading: boolean;
};

const GenerateExperimentModal = ({
	setActionToggleOpen,
	hypothesisId,
	setIsExperimentLoading,
	setHypothesisInstance
}: Props) => {
	const { toast } = useToast();

	const [instructions, setInstructions] = useState<string>("");
	const generateExperiment = async () => {
		setActionToggleOpen("");
		setIsExperimentLoading(true);
		const response = await axios.post(
			"/api/hypothesisActions/generateExperiment",
			{
				hypothesisId,
				instructions
			}
		);
		setIsExperimentLoading(false);
		toast({
			title: "Experiment generated successfully",
			variant: "success",
			description:
				"Check out the generated experiment attached to the hypothesis."
		});
		setHypothesisInstance(response.data.updatedHypothesisGeneration);
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
