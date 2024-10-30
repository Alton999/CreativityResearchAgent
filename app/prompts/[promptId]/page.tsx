// "use client";

// Page used for redirection to the correct page
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card";
import ResearchOutput from "@/components/ResearchOutput";
import NavigationSidebar from "@/components/NavigationSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
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
			searchTerms: {
				include: {
					savedPapers: true
				}
			},
			hypothesisGeneration: true
		}
	});
	if (!prompt) {
		return <div>No prompts found...</div>;
	}

	return (
		<>
			<main className="flex min-h-screen pt-8">
				<div className="flex-1 p-4 transition-all duration-300 ease-in-out ml-0 lg:mr-72">
					<ScrollArea className="max-w-[1080px] mx-auto max-h-[90vh] overflow-auto">
						<Card className="mb-8">
							<CardHeader id="research-question">
								<CardTitle className="leading-7">Research question</CardTitle>
								<CardDescription className="text-lg">
									{prompt ? prompt.researchQuestion : "Loading prompt..."}
								</CardDescription>
							</CardHeader>
						</Card>
						<ResearchOutput initialPrompt={prompt as unknown as PromptType} />
					</ScrollArea>
				</div>
				<NavigationSidebar />
			</main>
		</>
	);
};

export default PromptResults;
