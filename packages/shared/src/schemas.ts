import { z } from "zod";

export const orgIdSchema = z.string().min(1);
export const e164PhoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/);

export const jwtUserSchema = z.object({
  id: z.string(),
  orgId: orgIdSchema,
  role: z.enum(["ADMIN", "MANAGER", "AGENT", "AUDITOR"]),
  email: z.string().email(),
  name: z.string().optional(),
});

export type JwtUser = z.infer<typeof jwtUserSchema>;