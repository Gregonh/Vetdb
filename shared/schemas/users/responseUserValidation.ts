import { z } from 'zod';

// to validate the inner data body of a response

export const InnerBodyPostUserSchema = z.object({
  id: z.number().int().positive().finite(),
});

export type InnerBodyPostUser = z.infer<typeof InnerBodyPostUserSchema>;
