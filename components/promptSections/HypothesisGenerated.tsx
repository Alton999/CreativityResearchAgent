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
import { Plus } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";
import HypothesisCard from "../HypothesisCard";
import ForcedAssociationModal from "../hypothesisActionModals/ForcedAssociationModal";

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
	const [showHypothesisModal, setShowHypothesisModal] =
		useState<boolean>(false);
	const [associationGenerationStatus, setAssociationGenerationStatus] =
		useState<string>("");
	return (
		<>
			<Card>
				<CardHeader className="flex flex-row justify-between items-center">
					<CardTitle>Hypothesis generations</CardTitle>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button>
								Create new hypothesis
								<Plus className="ml-2" color="white" size="24" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuLabel>
								Hypothesis generation actions
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>Fresh hypothesis</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setShowHypothesisModal(true)}>
								Forced hypothesis association
							</DropdownMenuItem>
							<DropdownMenuItem>
								Branch off existing hypothesis
							</DropdownMenuItem>
							<DropdownMenuItem>Domain expansion</DropdownMenuItem>
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
					</div>

					{/* <Button className="mt-4 w-full">Generate initial hypothesis</Button> */}
				</CardContent>
			</Card>
			{/* display modal component */}
			{showHypothesisModal && (
				<ForcedAssociationModal
					setShowHypothesisModal={setShowHypothesisModal}
					promptId={hypothesisGeneration[0].promptId}
					setAssociationGenerationStatus={setAssociationGenerationStatus}
				/>
			)}
		</>
	);
};

export default HypothesisGenerated;
