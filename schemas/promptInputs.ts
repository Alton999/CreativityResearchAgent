import { z } from "zod";

export const promptInputsSchema = z.object({
  question: z.string().min(50, "Please enter a question"),
  field: z.string().min(1, "Field is required").max(100),
});
