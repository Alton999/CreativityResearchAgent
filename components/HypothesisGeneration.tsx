"use client";

import { useEffect, useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card";
import axios from "axios";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { prisma } from "@/lib/db";

type HypothesisGenerationProps = {
	hypothesis: string;
};

const HypothesisGeneration = ({ hypothesis }: HypothesisGenerationProps) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Initial hypothesis generation</CardTitle>
			</CardHeader>
			<CardContent>
				{/* {isLoading ? (
					<div className="space-y-2">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-5/6" />
						<Skeleton className="h-4 w-4/6" />
						<Skeleton className="h-4 w-5/6" />
						<Skeleton className="h-4 w-6/6" />
					</div>
				) : ( */}
				<div className="w-full">
					<pre style={{ whiteSpace: "pre-wrap" }}>{hypothesis}</pre>
				</div>
				{/* )} */}
			</CardContent>
		</Card>
	);
};

export default HypothesisGeneration;
