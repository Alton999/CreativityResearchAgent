import React, { useEffect, useState } from "react";
import ModalLayout from "./ModalLayout";
import { Button } from "./ui/button";
import axios from "axios";
import { Circle, Loader2 } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { SearchTerm as SearchTermType } from "@/types";

type Props = {
	allSearchTerms: SearchTermType[];
	setShowSearchTermSelectionModal: React.Dispatch<
		React.SetStateAction<boolean>
	>;
	setSearchResultsSummaryLoading: React.Dispatch<React.SetStateAction<boolean>>;
	setSearchResultsSummary: React.Dispatch<React.SetStateAction<string>>;
	searchResultsSummaryLoading: boolean;
};

const GenerateSearchSummaryModal = ({
	allSearchTerms,
	setShowSearchTermSelectionModal,
	setSearchResultsSummary,
	setSearchResultsSummaryLoading,
	searchResultsSummaryLoading
}: Props) => {
	const { toast } = useToast();

	const [selectedSearchTerms, setSelectedSearchTerms] = useState<
		SearchTermType[]
	>([]);
	const [
		generateSearchSummaryButtonActive,
		setGenerateSearchSummaryButtonActive
	] = useState<boolean>(false);

	const toggleSearchTermSelection = (searchTerm: SearchTermType) => {
		setSelectedSearchTerms((prevSelected) => {
			if (prevSelected.some((term) => term.id === searchTerm.id)) {
				return prevSelected.filter((term) => term.id !== searchTerm.id);
			} else if (prevSelected.length < 3) {
				return [...prevSelected, searchTerm];
			}
			return prevSelected;
		});
	};
	const generateSearchSummary = async () => {
		setShowSearchTermSelectionModal(false);
		setSearchResultsSummaryLoading(true);
		const response = await axios.post("/api/generate/searchEngine", {
			searchTermInstance: selectedSearchTerms
		});
		setSearchResultsSummaryLoading(false);
		toast({
			title: "Successfully generated search summary",
			variant: "success",
			description: "Check out the search summary."
		});
		console.log("Response from generate search results: ", response);
		setSearchResultsSummary(response.data.searchResultsSummary);

		// setHypothesisInstance(response.data.updatedHypothesisGeneration);
	};

	// Track button enable state
	useEffect(() => {
		if (selectedSearchTerms.length === 3) {
			setGenerateSearchSummaryButtonActive(true);
		}
	}, [selectedSearchTerms]);

	return (
		<ModalLayout
			title="Select 3 search terms"
			closeModal={() => setShowSearchTermSelectionModal(false)}
		>
			<p>
				To continue with the research you will need to choose 3 search terms to
				summarise into a research document.
			</p>
			<div>
				<h3 className="font-bold mb-2">Select 3 search terms to continue</h3>

				<ScrollArea className="max-h-[400px] flex flex-col gap-4 pr-3.5">
					{allSearchTerms.map((searchTerm, index) => (
						<div
							key={searchTerm.id}
							className={`border border-slate-400 p-3 rounded-lg cursor-pointer flex justify-between mb-4 ${
								selectedSearchTerms.includes(searchTerm) ? "bg-slate-200" : ""
							}`}
							onClick={() => toggleSearchTermSelection(searchTerm)}
						>
							<div>
								<h3 className="font-bold mb-2">
									Search term: {searchTerm.searchTerm}
								</h3>
							</div>
							<Circle
								size={24}
								color={
									selectedSearchTerms.includes(searchTerm) ? "#34495e" : "gray"
								}
								fill={
									selectedSearchTerms.includes(searchTerm) ? "#34495e" : "none"
								}
							/>
						</div>
					))}
				</ScrollArea>
			</div>
			<Button
				onClick={() => generateSearchSummary()}
				disabled={
					!generateSearchSummaryButtonActive || searchResultsSummaryLoading
				}
			>
				Generate search summary
			</Button>
		</ModalLayout>
	);
};

export default GenerateSearchSummaryModal;
