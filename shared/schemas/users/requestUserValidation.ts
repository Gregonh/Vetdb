import { z } from 'zod';

//used in both back and front schemas
const defaultValidation = {
  firstName: z
    .string()
    .min(2, { message: 'Name is required' })
    .max(15, { message: 'Name must be no more than 15 characters' })
    .refine((val) => !/<.*?>/g.test(val), {
      message: 'HTML tags are not allowed',
    }),
  lastName: z
    .string()
    .min(2, { message: 'Lastname is required' })
    .max(15, { message: 'Last name must be no more than 15 characters' })
    .refine((val) => !/<.*?>/g.test(val), {
      message: 'HTML tags are not allowed',
    }),
  email: z.string().min(9, { message: 'must be at least 9 characters' }).email({
    message: 'Must be a valid email',
  }),
  password: z
    .string()
    .min(6, {
      message: 'Password must be at least 6 characters',
    })
    .max(20, { message: 'Password must be no more than 20 characters' })
    .refine((val) => !/<.*?>/g.test(val), {
      message: 'HTML tags are not allowed',
    }),
};

const formValidationSchema = z.object({
  ...defaultValidation,
  //literal because we want exactly that value
  terms: z.literal(true, {
    //to customize the error message
    errorMap: () => ({
      message: 'You must accept our Terms and Privacy Policy',
    }),
  }),
});

const passwordCheckSchema = z
  .object({
    password: z
      .string()
      .min(6, {
        message: 'Password must be at least 6 characters',
      })
      .max(20, { message: 'Password must be no more than 20 characters' })
      .refine((val) => !/<.*?>/g.test(val), {
        message: 'HTML tags are not allowed',
      }),
    confirmPassword: z
      .string()
      .min(6, { message: 'Confirm Password is required' })
      .max(20, { message: 'Password must be no more than 20 characters' })
      .refine((val) => !/<.*?>/g.test(val), {
        message: 'HTML tags are not allowed',
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: "Password don't match",
  });

//the back schema
export const RequestBodyPostUserSchema = z.object({ ...defaultValidation });
//the back type
export type RequestBodyPostUser = z.infer<typeof RequestBodyPostUserSchema>;

//the front schema, combine it with alwaysRefine and react hook form.
//intersection to separate the different refine by schema
export const FormPostUserSchema = z.intersection(
  //intersection doesn't override field when there is name collision so omit default schema password:
  formValidationSchema.omit({ password: true }),
  passwordCheckSchema,
);

//the front type
export type FormPostUser = z.infer<typeof FormPostUserSchema>;
