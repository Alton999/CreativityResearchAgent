// Here we can use
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import { HypothesisGeneration as HypothesisGenerationTypes } from "@/types";
import { Button } from "../ui/button";
import { Loader2, Plus } from "lucide-react";
import { motion } from "framer-motion";
import HypothesisCard from "../HypothesisCard";
import ForcedAssociationModal from "../hypothesisActionModals/ForcedAssociationModal";
import NewHypothesisModal from "../hypothesisActionModals/NewHypothesisModal";
import BranchOffExistingHypothesisModal from "../hypothesisActionModals/BranchOffExistingHypothesisModal";
import useResearchStore from "@/store/useResearchStore";

const HypothesisGenerated = () => {
	const { prompt, addHypothesis } = useResearchStore();
	const [
		selectedHypothesisGenerationModal,
		setSelectedHypothesisGenerationModal
	] = useState<string>("");

	const [newHypothesisStatus, setNewHypothesisStatus] = useState<string>("");

	const handleAddHypothesis = (hypothesis: HypothesisGenerationTypes) => {
		addHypothesis(hypothesis);
		// reset loading state
		setNewHypothesisStatus("");
	};
	if (!prompt) return <div>Prompt not found.</div>;
	return (
		<>
			<Card>
				<CardHeader className="flex flex-row justify-between items-center">
					<CardTitle>Hypothesis generations</CardTitle>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button>
								Generate new hypothesis
								<Plus className="ml-3" color="white" size="24" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuLabel>
								Hypothesis generation actions
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={() =>
									setSelectedHypothesisGenerationModal("new hypothesis")
								}
							>
								Fresh hypothesis
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() =>
									setSelectedHypothesisGenerationModal("forced association")
								}
							>
								Forced hypothesis association
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() =>
									setSelectedHypothesisGenerationModal("branch hypothesis")
								}
							>
								Branch off existing hypothesis
							</DropdownMenuItem>
							<DropdownMenuItem disabled>
								Domain expansion [Coming soon]
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{prompt.hypothesisGeneration.map((hypothesis, index) => (
							<HypothesisCard
								key={index}
								index={index}
								hypothesisId={hypothesis.id}
							/>
						))}
						{
							// Show the loading hypothesis if loading state
							newHypothesisStatus === "loading" && (
								<motion.div
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.5 }}
									className="w-full border border-amber-500 bg-amber-100 p-4 rounded-lg shadow-md flex justify-between"
								>
									<h1 className="text-lg font-bold text-amber-800">
										New hypothesis loading...
									</h1>
									<Loader2 className="animate-spin" color="orange" size={24} />
								</motion.div>
							)
						}
					</div>
					{/* <Button className="mt-4 w-full">Generate initial hypothesis</Button> */}
				</CardContent>
			</Card>
			{/* display modal component */}
			{selectedHypothesisGenerationModal === "forced association" && (
				<ForcedAssociationModal
					setSelectedHypothesisGenerationModal={
						setSelectedHypothesisGenerationModal
					}
					promptId={prompt.id}
					setNewHypothesisStatus={setNewHypothesisStatus}
					onAddHypothesis={handleAddHypothesis}
				/>
			)}
			{selectedHypothesisGenerationModal === "new hypothesis" && (
				<NewHypothesisModal
					setSelectedHypothesisGenerationModal={
						setSelectedHypothesisGenerationModal
					}
					promptId={prompt.id}
					setNewHypothesisStatus={setNewHypothesisStatus}
					onAddHypothesis={handleAddHypothesis}
				/>
			)}
			{selectedHypothesisGenerationModal === "branch hypothesis" && (
				<BranchOffExistingHypothesisModal
					setSelectedHypothesisGenerationModal={
						setSelectedHypothesisGenerationModal
					}
					promptId={prompt.id}
					setNewHypothesisStatus={setNewHypothesisStatus}
					onAddHypothesis={handleAddHypothesis}
				/>
			)}
		</>
	);
};

export default HypothesisGenerated;
