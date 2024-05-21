"use client";

import {
	Form,
	FormField,
	FormItem,
	FormControl,
	FormMessage
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Divide, LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { feedbackSchema } from "@/schemas/feedback";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

type Input = z.infer<typeof feedbackSchema>;

type SearchTermProps = {
	searchTerm: {
		id: string;
		question: string;
		field: string;
		createdAt: string;
		promptId: string;
		searchTerm: string;
		explanation: string;
		newSearchTerm: boolean;
		parentId: string;
	};
	addNewSearchTerm: (newSearchTerm: SearchTermProps["searchTerm"]) => void;
	selectedSearchTerms: SearchTermProps["searchTerm"][];
	handleSearchTermSelection: (
		searchTerm: SearchTermProps["searchTerm"]
	) => void;
};
const SearchTerm = ({
	searchTerm,
	addNewSearchTerm,
	selectedSearchTerms,
	handleSearchTermSelection
}: SearchTermProps) => {
	const [status, setStatus] = useState<string | null>(null);
	const [isOpen, setIsOpen] = useState(false);
	const [isSelected, setIsSelected] = useState(false);
	const className = `border text-card-foreground p-8 cursor-pointer rounded-xl ${
		isSelected ? "shadow-xl" : ""
	}`;
	const backgroundVariants = {
		selected: {
			border: "1px solid rgb(229, 231, 235)",
			boxShadow:
				"0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
		},
		unselected: { boxShadow: "none" }
	};
	useEffect(() => {
		const selected = selectedSearchTerms.some(
			(term) => term.id === searchTerm.id
		);
		setIsSelected(selected);
	}, [selectedSearchTerms, searchTerm]);

	const form = useForm<Input>({
		resolver: zodResolver(feedbackSchema),
		defaultValues: {
			feedback: "",
			searchTerm: searchTerm
		}
	});
	const { mutate: submitFeedback } = useMutation({
		mutationFn: async ({ feedback }: Input) => {
			const response = await axios.post("/api/aiFeedback/searchTerms", {
				searchTerm: searchTerm,
				feedback
			});
			return response.data;
		}
	});
	function feedback(input: Input) {
		setStatus("pending");
		submitFeedback(
			{
				feedback: input.feedback,
				searchTerm: searchTerm
			},
			{
				onSuccess: ({ searchTermInstance }) => {
					console.log("Search term instance:", searchTermInstance);
					addNewSearchTerm(searchTermInstance);
					setIsOpen(false);
					form.reset();
					setStatus("Resolved");
				},
				onError: (error: any) => {
					console.error(error);
				}
			}
		);
	}
	return (
		<div>
			<motion.div
				animate={isSelected ? "selected" : "unselected"}
				variants={backgroundVariants}
				transition={{ duration: 0.3 }}
				className={className}
				onClick={() => handleSearchTermSelection(searchTerm)}
			>
				<div className="space-y-4">
					<div className="w-full flex justify-between gap-8">
						<h4 className="text-lg font-bold flex flex-1">
							{searchTerm.searchTerm}
						</h4>
						{searchTerm.newSearchTerm ? (
							<div className="w-[150px] bg-slate-300/20  rounded-lg h-10 flex items-center justify-center">
								<p>Regenerated term</p>
							</div>
						) : (
							<div className="w-[150px] bg-slate-300/20 rounded-lg h-10 flex items-center justify-center">
								<p>Original term</p>
							</div>
						)}
					</div>
					<p>Reasoning: {searchTerm.explanation}</p>
				</div>
				<div className="w-full grid place-items-end my-2">
					<Button onClick={() => setIsOpen(!isOpen)}>
						{isOpen ? "Close" : "Feedback"}
					</Button>
				</div>
			</motion.div>
			<motion.div
				initial={false}
				animate={{ height: isOpen ? "auto" : 0 }}
				className="w-full overflow-hidden"
			>
				<div className="w-full py-6 flex gap-4 border px-4 b-t-0">
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(feedback)}
							className="flex flex-1 gap-8"
						>
							<FormField
								control={form.control}
								name="feedback"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormControl>
											<Input placeholder="Enter your feedback..." {...field} />
										</FormControl>

										<FormMessage>
											{form.formState.errors.feedback?.message}
										</FormMessage>
									</FormItem>
								)}
							/>
							<Button type="submit" disabled={status === "pending"}>
								{status === "pending" ? (
									<LoaderCircle className="animate-spin" />
								) : (
									"Submit feedback"
								)}
							</Button>
						</form>
					</Form>
				</div>
			</motion.div>
		</div>
	);
};

export default SearchTerm;
