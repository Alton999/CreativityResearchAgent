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
	onAddHypothesis: (hypothesis: HypothesisGenerationTypes) => void;
	promptId: string;
};

const NewHypothesisModal = ({
	setSelectedHypothesisGenerationModal,
	setNewHypothesisStatus,
	promptId,
	onAddHypothesis
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
		onAddHypothesis(response.data.newHypothesisInstance);
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
			<div className="space-y-2 py-2">
				<label htmlFor="name instruction" className="font-bold">
					New hypothesis instruction
				</label>
				<Textarea
					required
					name="new hypothesis instruction"
					id="newHypothesisInstruction"
					rows={8}
					placeholder="Lets focus this hypothesis along the lines of..."
					// className="border border-primary rounded-lg bg-slate-100 p-1.5"
					onChange={(e) => setInstructions(e.target.value)}
				/>
			</div>
			<Button
				onClick={() => {
					// console.log("Button pressed");
					generateHypothesis();
				}}
				className="w-full"
			>
				Generate hypothesis
			</Button>
		</ModalLayout>
	);
};

export default NewHypothesisModal;
