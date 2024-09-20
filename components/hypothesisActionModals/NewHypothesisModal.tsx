import React, { useState } from "react";
import ModalLayout from "../ModalLayout";
import { Button } from "../ui/button";
import axios from "axios";
import { HypothesisGeneration as HypothesisGenerationTypes } from "@/types";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

type Props = {
	setSelectedHypothesisGenerationModal: React.Dispatch<
		React.SetStateAction<string>
	>;
	setNewHypothesisStatus: React.Dispatch<React.SetStateAction<string>>;
	setHypothesisGeneration: React.Dispatch<
		React.SetStateAction<HypothesisGenerationTypes[]>
	>;
	promptId: string;
};

const NewHypothesisModal = ({
	setSelectedHypothesisGenerationModal,
	setNewHypothesisStatus,
	setHypothesisGeneration,
	promptId
}: Props) => {
	const { toast } = useToast();

	const [instructions, setInstructions] = useState<string>("");
	const generateHypothesis = async () => {
		setSelectedHypothesisGenerationModal("");
		setNewHypothesisStatus("loading");
		const response = await axios.post(
			"/api/hypothesisActions/generateNewHypothesis",
			{
				instructions,
				promptId
			}
		);
		toast({
			title: "Hypothesis generated successfully with associations",
			variant: "success",
			description: "Check out the new hypothesis at the bottom of the page."
		});
		console.log("Response from new hypothesis", response);
		setHypothesisGeneration(response.data.allHypothesis);
		setNewHypothesisStatus("done");
	};
	return (
		<ModalLayout
			title="Generate new hypothesis"
			closeModal={() => setSelectedHypothesisGenerationModal("")}
		>
			<p>
				Note: If you do not include any instructions the system will
				automatically decide a topic that is worth exploring.
			</p>
			<label htmlFor="name instruction">
				Custom instructions for new hypothesis
			</label>
			<Textarea
				required
				name="new hypothesis instruction"
				id="newHypothesisInstruction"
				rows={8}
				// className="border border-primary rounded-lg bg-slate-100 p-1.5"
				onChange={(e) => setInstructions(e.target.value)}
			/>
			<Button
				onClick={() => {
					// console.log("Button pressed");
					generateHypothesis();
				}}
			>
				Generate hypothesis
			</Button>
		</ModalLayout>
	);
};

export default NewHypothesisModal;
