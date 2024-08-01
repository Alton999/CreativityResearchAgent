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

type Props = {
	hypothesisGeneration: HypothesisGenerationTypes[];
	setHypothesisGeneration: React.Dispatch<
		React.SetStateAction<HypothesisGenerationTypes[]>
	>;
};

const HypothesisGenerated = ({
	hypothesisGeneration,
	setHypothesisGeneration
}: Props) => {
	const [
		selectedHypothesisGenerationModal,
		setSelectedHypothesisGenerationModal
	] = useState<string>("");

	const [newHypothesisStatus, setNewHypothesisStatus] = useState<string>("");

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
							<DropdownMenuItem>
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
						{hypothesisGeneration.map((hypothesis, index) => (
							<HypothesisCard
								key={index}
								index={index}
								hypothesis={hypothesis}
								setHypothesisGeneration={setHypothesisGeneration}
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
					promptId={hypothesisGeneration[0].promptId}
					setNewHypothesisStatus={setNewHypothesisStatus}
					setHypothesisGeneration={setHypothesisGeneration}
				/>
			)}
			{selectedHypothesisGenerationModal === "new hypothesis" && (
				<NewHypothesisModal
					setSelectedHypothesisGenerationModal={
						setSelectedHypothesisGenerationModal
					}
					promptId={hypothesisGeneration[0].promptId}
					setNewHypothesisStatus={setNewHypothesisStatus}
					setHypothesisGeneration={setHypothesisGeneration}
				/>
			)}
		</>
	);
};

export default HypothesisGenerated;
