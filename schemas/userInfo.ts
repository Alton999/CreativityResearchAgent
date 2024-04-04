import { z } from "zod";

export const userInfoSchema = z.object({
  name: z.string().max(100),
  email: z.string().email(),
  organisation: z.string(),
  role: z.string(),
});

export const userLoginSchema = z.object({
  email: z.string().email(),
});
