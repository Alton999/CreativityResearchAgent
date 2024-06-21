// Here we can use
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { HypothesisGeneration as HypothesisGenerationTypes } from "@/types";
import { Button } from "../ui/button";

type Props = {
	hypothesisGeneration: HypothesisGenerationTypes[];
};

const HypothesisGenerated = ({ hypothesisGeneration }: Props) => {
	console.log("Hypothesis generation", hypothesisGeneration);
	return (
		<Card>
			<CardHeader className="flex flex-row justify-between items-center">
				<CardTitle>Hypothesis generations</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{hypothesisGeneration.map((hypothesis, index) => (
						<div
							key={index}
							className="p-4 border border-gray-200 rounded-md shadow-sm"
						>
							{hypothesis.hypothesis}
						</div>
					))}
				</div>
				<Button className="mt-4 w-full">Generate initial hypothesis</Button>
			</CardContent>
		</Card>
	);
};

export default HypothesisGenerated;
