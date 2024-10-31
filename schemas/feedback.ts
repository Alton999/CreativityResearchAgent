import { z } from "zod";
const searchTermSchema = z.object({
	id: z.string(),
	question: z.string(),
	createdAt: z.string(),
	promptId: z.string(),
	searchTerm: z.string(),
	explanation: z.string()
});

export const feedbackSchema = z.object({
	feedback: z
		.string()
		.min(1, "Please give me detailed feedback on how I can improve."),
	searchTerm: searchTermSchema
});
