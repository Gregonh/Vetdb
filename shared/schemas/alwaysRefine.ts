import z from 'zod';

/**
 * Ensure that Zod's refine logic is executed on every field change
 * in a React Hook Form (onChange validation).
 * Avoid the default zod behavior to only refine after all
 * validation are passed.
 * @param zodType a schema
 * @returns the same param schema which always refine
 */
export function zodAlwaysRefine<T extends z.ZodTypeAny>(zodType: T) {
  return z.any().superRefine(async (value, ctx) => {
    const res = await zodType.safeParseAsync(value);

    if (res.success === false)
      for (const issue of res.error.issues) {
        ctx.addIssue(issue);
      }
  }) as unknown as T;
}
