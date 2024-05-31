import { z } from "zod";
const searchTermSchema = z.object({
	id: z.string(),
	question: z.string(),
	field: z.string(),
	createdAt: z.string(),
	promptId: z.string(),
	searchTerm: z.string(),
	explanation: z.string()
});

export const feedbackSchema = z.object({
	feedback: z
		.string()
		.min(40, "Please give me detailed feedback on how I can improve."),
	searchTerm: searchTermSchema
});
