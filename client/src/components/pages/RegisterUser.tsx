import { zodResolver } from '@hookform/resolvers/zod';
import { useErrorBoundary } from 'react-error-boundary';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { useMutationRequest } from '../../data-sources/useMutationRequest';
import { type GetRequest } from '../../data-sources/useRequest';
import { dealWithErrors } from '../errors/dealWithError';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';

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
    email: z.string().min(9, { message: 'must be at least 9 characters' }).email({
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
type CreateUserResponse = {
  message: string;
};
type RequestBody = {
  name: string;
  lastName: string;
  email: string;
  password: string;
};

const requestConfiguration: NonNullable<GetRequest<RequestBody>> = {
  url: 'http://localhost:4001/user',
};

export function RegisterUser() {
  const { showBoundary } = useErrorBoundary();
  const form = useForm<UserValidation>({
    resolver: zodResolver(userValidationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
  const { trigger, data } = useMutationRequest<CreateUserResponse, RequestBody>(
    requestConfiguration,
  );
  const navigate = useNavigate();

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = form;

  const createUser = async (user: UserValidation) => {
    try {
      const bodyData = {
        name: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
      };

      const response = await trigger({
        request: requestConfiguration,
        methodType: 'POST',
        requestBody: bodyData,
      });
      return response;
    } catch (error) {
      dealWithErrors(error, showBoundary);
    }
  };

  const onSubmit = async (data: UserValidation) => {
    try {
      const user = userValidationSchema.parse(data);
      const response = await createUser(user);
      if (response) {
        navigate('/login');
      }
    } catch (error: unknown) {
      dealWithErrors(error, showBoundary);
    }
  };

  return (
    <>
      <div className="root-container container-full-height text-vfont-0 md:flex md:items-center">
        <div className="md:grow">
          <h1 className="v-font-headers px-vspace-s-l pt-vspace-s-l">
            {!data ? `Registro de usuario` : data.message}
          </h1>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="p-vspace-s-l">
              <div className="md:gap-x-vspace-s-l md:flex">
                <div className="md:grow md:basis-0">
                  <FormField
                    control={control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          className="v-font-body1 font-family-subtitle block text-sm text-gray-700"
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
                            autoComplete="username"
                          />
                        </FormControl>
                        <FormDescription className="font-family-caption v-font-body2">
                          This is your public display name
                        </FormDescription>
                        <FormMessage className="v-font-body1">
                          {errors.firstName && errors.firstName?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mt-vspace-xs md:mt-0 md:grow md:basis-0">
                  <FormField
                    control={control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          className="font-family-subtitle v-font-body1 block text-sm text-gray-700"
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
                            autoComplete="additional-name"
                          />
                        </FormControl>
                        <FormDescription className="font-family-caption v-font-body2">
                          Introduce your last name
                        </FormDescription>
                        <FormMessage className="v-font-body1">
                          {errors.lastName && errors.lastName?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="mt-vspace-xs">
                <FormField
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className="font-family-subtitle v-font-body1 block text-sm text-gray-700"
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
                        />
                      </FormControl>
                      <FormDescription className="font-family-caption v-font-body2">
                        We&apos;ll never share your email with anyone else
                      </FormDescription>
                      <FormMessage className="v-font-body1">
                        {errors.email && errors.email?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              </div>
              <div className="md:gap-x-vspace-s-l mt-vspace-xs md:flex md:min-h-44">
                <div className="md:grow md:basis-0">
                  <FormField
                    control={control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="md:flex md:h-[100%] md:flex-col">
                        <FormLabel
                          className="font-family-subtitle v-font-body1 block text-sm text-gray-700 md:overflow-y-auto"
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
                            />
                          </FormControl>
                        </div>
                        <FormDescription className="font-family-caption v-font-body2 md:basis-10 md:overflow-y-auto">
                          Choose a strong password
                        </FormDescription>
                        <FormMessage className="v-font-body1 md:basis-10 md:overflow-y-auto">
                          {errors.password && errors.password?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mt-vspace-xs md:mt-0 md:grow md:basis-0">
                  <FormField
                    control={control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className="md:flex md:h-[100%] md:flex-col">
                        <FormLabel
                          className="font-family-subtitle v-font-body1 block text-sm text-gray-700 md:overflow-y-auto"
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
                            />
                          </FormControl>
                        </div>
                        <FormDescription className="font-family-caption v-font-body2 md:basis-10 md:overflow-y-auto">
                          Choose the same password
                        </FormDescription>
                        <FormMessage className="small-text v-font-body1 md:basis-10 md:overflow-y-auto">
                          {errors.confirmPassword && errors.confirmPassword?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="mt-vspace-m">
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
                            className={`font-family-subtitle v-font-body1 text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                              errors.terms ? 'text-red-500' : 'text-gray-700'
                            }`}
                            htmlFor="terms"
                          >
                            Accept Terms & Conditions
                          </FormLabel>
                          {!errors.terms ? (
                            <FormDescription className="font-family-caption v-font-body2">
                              You agree to our Terms of Service and Privacy Policy
                            </FormDescription>
                          ) : (
                            <FormMessage className="v-font-body1 small-text italic">
                              {errors.terms && errors.terms?.message}
                            </FormMessage>
                          )}
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-vspace-m text-center">
                <Button
                  size="custom"
                  className="v-font-secondary px-vspace-m py-vspace-2xs focus:shadow-outline bg-blue-500 text-[rgb(28,28,28)] hover:bg-blue-700 hover:text-white focus:outline-none"
                  type="submit"
                >
                  Register Account
                </Button>
              </div>
            </form>
          </Form>

          <hr className="mt-vspace-m border-t" />
          <div className="mt-vspace-m text-center">
            <Link
              className="v-font-secondary inline-block align-baseline text-sm text-[rgb(39,86,163)] hover:text-blue-800"
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
