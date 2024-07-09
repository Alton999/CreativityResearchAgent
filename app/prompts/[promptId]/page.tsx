// "use client";

// Page used for redirection to the correct page
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card";
import ResearchOutput from "@/components/ResearchOutput";
import axios from "axios";
import SearchTerm from "@/components/SearchTerm";
import FetchLoading from "@/components/FetchLoading";
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { prisma } from "@/lib/db";
import { PromptType } from "@/types";

type Props = {
	params: {
		promptId: string;
	};
};

const PromptResults = async ({ params: { promptId } }: Props) => {
	const prompt = await prisma.prompt.findUnique({
		where: {
			id: promptId
		},
		include: {
			searchTerms: true,
			hypothesisGeneration: true
			// Reinitiator: true
		}
	});

	if (!prompt) {
		return <div>No prompts found...</div>;
	}
	return (
		<section className="mt-24 flex flex-col items-center justify-center">
			<ScrollArea className="max-w-[1080px] mx-auto max-h-[90vh] overflow-auto">
				<Card className="mb-8">
					<CardHeader>
						<CardTitle className="leading-7">Research question</CardTitle>
						<CardDescription className="text-lg">
							{prompt ? prompt.researchQuestion : "Loading prompt..."}
						</CardDescription>
					</CardHeader>
				</Card>
				<ResearchOutput prompt={prompt as unknown as PromptType} />
			</ScrollArea>
		</section>
	);
};

export default PromptResults;
