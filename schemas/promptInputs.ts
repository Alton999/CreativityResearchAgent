import { z } from "zod";

export const promptInputsSchema = z.object({
  question: z.string(),
  field: z.string().max(100),
});
