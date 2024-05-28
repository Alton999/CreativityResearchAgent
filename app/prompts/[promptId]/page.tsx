import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card";
import FetchLoading from "@/components/FetchLoading";
import { ScrollArea } from "@/components/ui/scroll-area";
import ResultsCard from "@/components/ResultsCard";
import { prisma } from "@/lib/db";
import { PromptType } from "@/lib/types"; // Assuming types.ts is located in src/types.ts

type Props = {
	params: {
		promptId: string;
	};
};

const PromptResults = async ({ params: { promptId } }: Props) => {
	const prompt = (await prisma.prompt.findUnique({
		where: {
			id: promptId
		},
		include: {
			searchTerms: {
				include: {
					SearchResults: true
				}
			},
			hypothesisGeneration: true,
			hypothesisEvaluation: true,
			Reinitiator: true
		}
	})) as PromptType | null;

	if (!prompt) {
		return <div>Loading...</div>;
	}

	return (
		<section className="mt-24 flex flex-col items-center justify-center">
			<ScrollArea className="">
				<ResultsCard prompt={prompt} />
			</ScrollArea>
		</section>
	);
};

export default PromptResults;
