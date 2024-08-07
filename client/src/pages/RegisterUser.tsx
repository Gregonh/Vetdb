import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
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
      .min(6, {
        message: 'Password must be at least 6 characters',
      })
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
/**
 * TODO: advise that the password and confirm password are not equal before submit
 * put the refine at the end means that the validation is not send
 * until the others default validation passed.
 */

type UserValidation = z.infer<typeof userValidationSchema>;

export function RegisterUser() {
  const form = useForm<UserValidation>({
    resolver: zodResolver(userValidationSchema),
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = form;

  const createUser = async (user: UserValidation) => {
    // eslint-disable-next-line no-useless-catch
    try {
      console.log({ user });
      const client = axios.create({
        baseURL: 'http://localhost:4001/users',
        timeout: 40000,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        },
      });
      const baseURL = client.defaults.baseURL as string;
      const data = {
        name: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
      };
      await client.post(baseURL, data).then((res) => console.log(res));
    } catch (error) {
      throw error;
    }
  };

  const onSubmit = async (data: UserValidation) => {
    try {
      const user = userValidationSchema.parse(data);
      await createUser(user);
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        console.error(err.issues);
      }
      if (err instanceof Error) {
        console.error(err.message);
      }
    }
  };

  return (
    <>
      {/* //margin-block-start: min(4rem, 8vh); */}
      <div className="u-container v-full-height mb-vspace-s-xl text-cfont-0 md:flex md:items-center">
        <div className="md:grow">
          <h1 className="font-display text-cfont-3 px-cspace-s-l pt-cspace-s-l">
            Registro de usuario
          </h1>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="p-cspace-s-l">
              <div className="md:gap-x-cspace-s-xl md:flex">
                <div className="md:grow md:basis-0">
                  <FormField
                    control={control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          className="font-bodybold block text-sm text-gray-700"
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
                            defaultValue=""
                          />
                        </FormControl>
                        <FormDescription className="font-bodythin">
                          This is your public display name
                        </FormDescription>
                        <FormMessage>
                          {errors.firstName && errors.firstName?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mt-cspace-xs md:mt-0 md:grow md:basis-0">
                  <FormField
                    control={control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          className="font-bodybold block text-sm text-gray-700"
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
                            defaultValue=""
                          />
                        </FormControl>
                        <FormDescription className="font-bodythin">
                          Introduce your last name
                        </FormDescription>
                        <FormMessage>
                          {errors.lastName && errors.lastName?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="mt-cspace-xs">
                <FormField
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className="font-bodybold block text-sm text-gray-700"
                        htmlFor="email"
                      >
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className={`w-full border px-3 py-2 text-sm leading-tight text-gray-700 ${
                            errors.email && 'border-red-500'
                          } focus:shadow-outline appearance-none rounded focus:outline-none`}
                          id="email"
                          type="email"
                          autoComplete="email"
                          defaultValue=""
                        />
                      </FormControl>
                      <FormDescription className="font-bodythin">
                        &apoWes;ll never share your email with anyone else
                      </FormDescription>
                      <FormMessage>
                        {errors.email && errors.email?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              </div>
              <div className="md:gap-x-cspace-s-xl mt-cspace-xs md:flex md:min-h-44">
                <div className="md:grow md:basis-0">
                  <FormField
                    control={control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="md:flex md:h-[100%] md:flex-col">
                        <FormLabel
                          className="font-bodybold block text-sm text-gray-700 md:overflow-y-auto"
                          htmlFor="password"
                        >
                          Password
                        </FormLabel>
                        <div className="md:grow md:basis-0">
                          <FormControl className="mt-2">
                            <Input
                              {...field}
                              type="password"
                              className={`w-full border px-3 py-2 text-sm leading-tight text-gray-700 ${
                                errors.password && 'border-red-500'
                              } focus:shadow-outline appearance-none rounded focus:outline-none`}
                              id="password"
                              autoComplete="new-password"
                              defaultValue=""
                            />
                          </FormControl>
                        </div>
                        <FormDescription className="font-bodythin md:basis-10 md:overflow-y-auto">
                          Choose a strong password
                        </FormDescription>
                        <FormMessage className="md:basis-10 md:overflow-y-auto">
                          {errors.password && errors.password?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mt-cspace-xs md:mt-0 md:grow md:basis-0">
                  <FormField
                    control={control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className="md:flex md:h-[100%] md:flex-col">
                        <FormLabel
                          className="font-bodybold block text-sm text-gray-700 md:overflow-y-auto"
                          htmlFor="c_password"
                        >
                          Confirm password
                        </FormLabel>
                        <div className="md:grow md:basis-0">
                          <FormControl className="mt-2">
                            <Input
                              {...field}
                              type="password"
                              className={`w-full border px-3 py-2 text-sm leading-tight text-gray-700 ${
                                errors.confirmPassword && 'border-red-500'
                              } focus:shadow-outline appearance-none rounded focus:outline-none`}
                              id="c_password"
                              autoComplete="new-password"
                              defaultValue=""
                            />
                          </FormControl>
                        </div>
                        <FormDescription className="font-bodythin md:basis-10 md:overflow-y-auto">
                          Choose the same password
                        </FormDescription>
                        <FormMessage className="small-text md:basis-10 md:overflow-y-auto">
                          {errors.confirmPassword &&
                            errors.confirmPassword?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="mt-cspace-m">
                <FormField
                  control={control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-start space-x-2">
                        <FormControl id="terms">
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="grid gap-3 leading-none">
                          <FormLabel
                            className={`font-bodybold text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                              errors.terms ? 'text-red-500' : 'text-gray-700'
                            }`}
                            htmlFor="terms"
                          >
                            Accept Terms & Conditions
                          </FormLabel>
                          {!errors.terms ? (
                            <FormDescription className="font-bodythin">
                              You agree to our Terms of Service and Privacy
                              Policy
                            </FormDescription>
                          ) : (
                            <FormMessage className="small-text italic">
                              {errors.terms && errors.terms?.message}
                            </FormMessage>
                          )}
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-cspace-m text-center">
                <Button
                  className="focus:shadow-outline font-bodybold w-full rounded-full bg-blue-500 px-4 py-2 text-[rgb(28,28,28)] hover:bg-blue-700 hover:text-white focus:outline-none"
                  type="submit"
                >
                  Register Account
                </Button>
              </div>
            </form>
          </Form>

          <hr className="mt-cspace-m border-t" />
          <div className="mt-cspace-m text-center">
            <Link
              className="font-secondary inline-block align-baseline text-sm text-[rgb(39,86,163)] hover:text-blue-800"
              to="/login"
            >
              Already have an account? Login!
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
