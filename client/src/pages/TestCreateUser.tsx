import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../components/ui/form';
import { Input } from '../components/ui/input';

const userValidationSchema = z
  .object({
    firstName: z
      .string()
      .min(2, { message: 'Name is required' })
      .max(15, { message: 'Name must be no more than 15 characters' }),
    lastName: z
      .string()
      .min(2, { message: 'Lastname is required' })
      .max(15, { message: 'Last name must be no more than 15 characters' }),
    email: z
      .string()
      .min(9, { message: 'must be at least 9 characters' })
      .email({
        message: 'Must be a valid email',
      }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' })
      .max(20, { message: 'Password must be no more than 20 characters' }),
    confirmPassword: z
      .string()
      .min(6, { message: 'Confirm Password is required' })
      .max(20, { message: 'Password must be no more than 20 characters' }),
    //literal because we want exactly that value
    terms: z.literal(true, {
      //to customize the error message
      errorMap: () => ({
        message: 'You must accept our Terms and Privacy Policy',
      }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: "Password don't match",
  });

type UserValidation = z.infer<typeof userValidationSchema>;

export function UserVet() {
  const form = useForm<UserValidation>({
    resolver: zodResolver(userValidationSchema),
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = form;

  const onSubmit = (data: UserValidation) => {
    try {
      const user = userValidationSchema.parse(data); // Validate form data
      console.log('Valid user:', user);
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        console.log(err.issues);
      }

      if (err instanceof Error) {
        console.error(err.message);
      }
    }
  };

  return (
    //margin-block-start: min(4rem, 8vh);
    <div className="p-vspace-xs sm:p-custom8 md:p-custom12 m-auto mb-[max(8vh,2rem)] max-w-xs sm:max-w-sm md:max-w-md xl:max-w-2xl">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="p-8">
          <div className="mb-4 md:flex md:justify-between">
            <div className="mb-4 md:mb-0 md:mr-2">
              <FormField
                control={control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className="mb-2 block text-sm font-bold text-gray-700"
                      htmlFor="firstName"
                    >
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder=""
                        {...field}
                        type="text"
                        className={`w-full border px-3 py-2 text-sm leading-tight text-gray-700 ${
                          errors.firstName && 'border-red-500'
                        } focus:shadow-outline appearance-none rounded focus:outline-none`}
                        id="firstName"
                      />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage>
                      {errors.firstName && errors.firstName?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <div className="md:ml-2">
              <FormField
                control={control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className="mb-2 block text-sm font-bold text-gray-700"
                      htmlFor="lastName"
                    >
                      Lastname
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder=""
                        {...field}
                        className={`w-full border px-3 py-2 text-sm leading-tight text-gray-700 ${
                          errors.lastName && 'border-red-500'
                        } focus:shadow-outline appearance-none rounded focus:outline-none`}
                        id="lastName"
                        type="text"
                      />
                    </FormControl>
                    <FormDescription>Introduce your last name.</FormDescription>
                    <FormMessage>
                      {errors.lastName && errors.lastName?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="mb-4">
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className="mb-2 block text-sm font-bold text-gray-700"
                    htmlFor="email"
                  >
                    Email
                  </FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      className={`w-full border px-3 py-2 text-sm leading-tight text-gray-700 ${
                        errors.email && 'border-red-500'
                      } focus:shadow-outline appearance-none rounded focus:outline-none`}
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                    />
                  </FormControl>
                  <FormDescription>
                    We&apos;ll never share your email with anyone else.
                  </FormDescription>
                  <FormMessage>
                    {errors.email && errors.email?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
          </div>
          <div className="mb-4 md:flex md:justify-between">
            <div className="mb-4 md:mb-0 md:mr-2">
              <FormField
                control={control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className="mb-2 block text-sm font-bold text-gray-700"
                      htmlFor="password"
                    >
                      Password
                    </FormLabel>
                    <FormControl>
                      <input
                        {...field}
                        type="password"
                        placeholder="Enter your password"
                        className={`w-full border px-3 py-2 text-sm leading-tight text-gray-700 ${
                          errors.password && 'border-red-500'
                        } focus:shadow-outline appearance-none rounded focus:outline-none`}
                        id="password"
                      />
                    </FormControl>
                    <FormDescription>Choose a strong password.</FormDescription>
                    <FormMessage>
                      {errors.password && errors.password?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <div className="md:ml-2">
              <FormField
                control={control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className="mb-2 block text-sm font-bold text-gray-700"
                      htmlFor="c_password"
                    >
                      Confirm password
                    </FormLabel>
                    <FormControl>
                      <input
                        {...field}
                        type="password"
                        placeholder="Enter your password again"
                        className={`w-full border px-3 py-2 text-sm leading-tight text-gray-700 ${
                          errors.confirmPassword && 'border-red-500'
                        } focus:shadow-outline appearance-none rounded focus:outline-none`}
                        id="c_password"
                      />
                    </FormControl>
                    <FormDescription>Choose the same password.</FormDescription>
                    <FormMessage>
                      {errors.confirmPassword &&
                        errors.confirmPassword?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="mb-6">
            <FormField
              control={control}
              name="terms"
              render={({ field }) => (
                <FormItem>
                  <div className="mb-4 flex items-start space-x-2">
                    <FormControl>
                      <Checkbox
                        id="terms"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="grid gap-3 leading-none">
                      <FormLabel
                        className={`text-sm font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                          errors.terms ? 'text-red-500' : 'text-gray-700'
                        }`}
                        htmlFor="terms"
                      >
                        Accept Terms & Conditions
                      </FormLabel>
                      {!errors.terms ? (
                        <FormDescription>
                          You agree to our Terms of Service and Privacy Policy.
                        </FormDescription>
                      ) : (
                        <FormMessage className="italic">
                          {errors.terms && errors.terms?.message}
                        </FormMessage>
                      )}
                    </div>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <div className="mb-6 text-center">
            <Button
              className="focus:shadow-outline w-full rounded-full bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
              type="submit"
            >
              Register Account
            </Button>
          </div>
        </form>
      </Form>

      <hr className="mb-6 border-t" />
      <div className="text-center">
        <a
          className="inline-block align-baseline text-sm text-blue-500 hover:text-blue-800"
          href="#test"
        >
          Forgot Password?
        </a>
      </div>
      <div className="text-center">
        <a
          className="inline-block align-baseline text-sm text-blue-500 hover:text-blue-800"
          href="./index.html"
        >
          Already have an account? Login!
        </a>
      </div>
    </div>
  );
}
