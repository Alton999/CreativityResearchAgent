"use client";
import React, { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import useResearchStore from "@/store/useResearchStore";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

const NavigationSection = ({
	id,
	label,
	children,
	isLatest
}: {
	id: string;
	label: string;
	children?: React.ReactNode;
	isLatest?: boolean;
}) => {
	const scrollToSection = (sectionId: string) => {
		const element = document.getElementById(sectionId);
		if (element) {
			element.scrollIntoView({ behavior: "smooth" });
		}
	};

	return (
		<motion.div
			key={id} // Added key here
			initial={{ opacity: 0, scale: 0.8, y: 20 }}
			animate={{ opacity: 1, scale: 1, y: 0 }}
			exit={{ opacity: 0, scale: 0.8, y: 20 }}
			transition={{
				type: "spring",
				stiffness: 500,
				damping: 30,
				mass: 1
			}}
			className="space-y-1"
		>
			<button
				onClick={() => scrollToSection(id)}
				className={`w-full text-left px-2 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md transition-colors flex items-center justify-between
        ${isLatest ? "bg-accent/50" : ""}`}
			>
				<span>{label}</span>
				{isLatest && <Sparkles className="w-12 h-12 ml-2 text-blue-500" />}
			</button>
			{children && (
				<motion.div
					key={`${id}-children`} // Added key here
					initial={{ opacity: 0, height: 0 }}
					animate={{ opacity: 1, height: "auto" }}
					exit={{ opacity: 0, height: 0 }}
					transition={{ duration: 0.2 }}
					className="ml-4 space-y-1 overflow-hidden"
				>
					{children}
				</motion.div>
			)}
		</motion.div>
	);
};

const SubItem = ({
	id,
	text,
	onClick,
	isLatest
}: {
	id: string;
	text: string;
	onClick: () => void;
	isLatest?: boolean;
}) => (
	<motion.button
		key={id} // Added key here
		initial={{ opacity: 0, x: -20 }}
		animate={{ opacity: 1, x: 0 }}
		exit={{ opacity: 0, x: -20 }}
		transition={{ duration: 0.2 }}
		onClick={onClick}
		className={`capitalize w-full text-left px-2 py-1 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors flex items-center justify-between
    ${isLatest ? "border border-blue-500" : ""}`}
	>
		<span className="block whitespace-normal break-words">{text}</span>
		{isLatest && <Sparkles className="w-12 h-12 ml-2 text-blue-500" />}{" "}
		{/* Fixed Sparkles size */}
	</motion.button>
);

const NavigationSidebar = () => {
	const { prompt, latestGeneration } = useResearchStore();
	const truncateText = (text: string, maxLength: number = 100) => {
		if (!text) return "";
		if (text.length <= maxLength) return text;
		return text.slice(0, maxLength).trim() + "...";
	};

	if (!prompt) {
		return (
			<div className="fixed left-0 top-0 h-screen w-72 border-r bg-background p-4">
				<div className="text-sm text-muted-foreground">
					Loading research content...
				</div>
			</div>
		);
	}

	return (
		<div className="fixed left-0 top-0 h-screen w-72 border-r bg-background p-4">
			<ScrollArea className="h-full">
				<nav className="space-y-2">
					{/* Research Question - Always present */}
					<NavigationSection
						key="research-question" // Added key here
						id="research-question"
						label="Research Question"
					/>

					{/* Search Terms */}
					{prompt.searchTerms?.length > 0 && (
						<NavigationSection
							key="search-terms" // Added key here
							id="search-terms"
							label="Search Terms"
						>
							<AnimatePresence mode="sync">
								{prompt.searchTerms.map((term) => (
									<SubItem
										key={term.id}
										id={term.id}
										text={truncateText(term.searchTerm)}
										onClick={() =>
											document
												.getElementById(term.id)
												?.scrollIntoView({ behavior: "smooth" })
										}
										isLatest={latestGeneration?.id === term.id}
									/>
								))}
							</AnimatePresence>
						</NavigationSection>
					)}

					{/* Search Results Summary */}
					{prompt.searchResultsSummary && (
						<NavigationSection
							key="search-results" // Added key here
							id="search-results"
							label="Search Results Summary"
						/>
					)}

					{/* Hypothesis Generation */}
					{prompt.hypothesisGeneration?.length > 0 && (
						<NavigationSection
							key="hypothesis" // Added key here
							id="hypothesis"
							label="Hypothesis Generation"
						>
							<AnimatePresence mode="sync">
								{prompt.hypothesisGeneration.map((hypothesis) => (
									<SubItem
										key={hypothesis.id}
										id={hypothesis.id}
										text={truncateText(hypothesis.hypothesis || "")}
										onClick={() =>
											document
												.getElementById(hypothesis.id)
												?.scrollIntoView({ behavior: "smooth" })
										}
										isLatest={latestGeneration?.id === hypothesis.id}
									/>
								))}
							</AnimatePresence>
						</NavigationSection>
					)}
				</nav>
			</ScrollArea>
		</div>
	);
};

export default NavigationSidebar;
