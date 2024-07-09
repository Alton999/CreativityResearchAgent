// Here we can use
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { HypothesisGeneration as HypothesisGenerationTypes } from "@/types";
import { Button } from "../ui/button";
import { Trash2, ChevronDown, X } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";
import HypothesisCard from "../HypothesisCard";

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
	return (
		<Card>
			<CardHeader className="flex flex-row justify-between items-center">
				<CardTitle>Hypothesis generations</CardTitle>
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
	);
};

export default HypothesisGenerated;
