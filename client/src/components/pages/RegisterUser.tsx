import { zodResolver } from '@hookform/resolvers/zod';
import { useErrorBoundary } from 'react-error-boundary';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { SuccessResponseBody } from '../../data-sources/IResponses';
import { useMutationRequest } from '../../data-sources/useMutationRequest';
import { type MutationRequest } from '../../data-sources/useMutationRequest';
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

type UserValidation = z.infer<typeof userValidationSchema>;

type RequestBody = {
  name: string;
  lastName: string;
  email: string;
  password: string;
};

type ResponseBodyPost = SuccessResponseBody<{ id: number }>;

const requestConfiguration: NonNullable<MutationRequest<RequestBody>> = {
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
  const { trigger, data } = useMutationRequest<ResponseBodyPost, RequestBody>(
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
          <h1 className="v-font-headers px-header-default-padding">
            {!data ? `Registro de usuario` : data.message}
          </h1>
          <Form {...form}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-default-top-margin p-container-default-padding bg-form-background rounded-md"
            >
              <div className="md:gap-x-vspace-s-l md:flex">
                <div className="md:grow md:basis-0">
                  <FormField
                    control={control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          className="v-font-body1 font-family-subtitle text-form-labelplaceholder block text-sm"
                          htmlFor="firstName"
                        >
                          Username
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder=""
                            {...field}
                            type="text"
                            className={`bg-form-input w-full border px-3 py-2 text-sm leading-tight ${
                              errors.firstName && 'border-red-500'
                            } focus:shadow-outline appearance-none rounded focus:outline-none`}
                            id="firstName"
                            autoComplete="username"
                          />
                        </FormControl>
                        <FormDescription className="font-family-caption v-font-body2 text-form-labelplaceholder">
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
                          className="font-family-subtitle v-font-body1 text-form-labelplaceholder block text-sm"
                          htmlFor="lastName"
                        >
                          Lastname
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder=""
                            {...field}
                            className={`bg-form-input w-full border px-3 py-2 text-sm leading-tight text-gray-700 ${
                              errors.lastName && 'border-red-500'
                            } focus:shadow-outline appearance-none rounded focus:outline-none`}
                            id="lastName"
                            type="text"
                            autoComplete="additional-name"
                          />
                        </FormControl>
                        <FormDescription className="font-family-caption v-font-body2 text-form-labelplaceholder">
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
                        className="font-family-subtitle v-font-body1 text-form-labelplaceholder block text-sm"
                        htmlFor="email"
                      >
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className={`bg-form-input w-full border px-3 py-2 text-sm leading-tight text-gray-700 ${
                            errors.email && 'border-red-500'
                          } focus:shadow-outline appearance-none rounded focus:outline-none`}
                          id="email"
                          type="email"
                          autoComplete="email"
                        />
                      </FormControl>
                      <FormDescription className="font-family-caption v-font-body2 text-form-labelplaceholder">
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
                          className="font-family-subtitle v-font-body1 text-form-labelplaceholder block text-sm md:overflow-y-auto"
                          htmlFor="password"
                        >
                          Password
                        </FormLabel>
                        <div className="md:grow md:basis-0">
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              className={`bg-form-input w-full border px-3 py-2 text-sm leading-tight text-gray-700 ${
                                errors.password && 'border-red-500'
                              } focus:shadow-outline appearance-none rounded focus:outline-none`}
                              id="password"
                              autoComplete="new-password"
                            />
                          </FormControl>
                        </div>
                        <FormDescription className="font-family-caption v-font-body2 text-form-labelplaceholder md:basis-10 md:overflow-y-auto">
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
                          className="font-family-subtitle v-font-body1 text-form-labelplaceholder block text-sm md:overflow-y-auto"
                          htmlFor="c_password"
                        >
                          Confirm password
                        </FormLabel>
                        <div className="md:grow md:basis-0">
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              className={`bg-form-input w-full border px-3 py-2 text-sm leading-tight text-gray-700 ${
                                errors.confirmPassword && 'border-red-500'
                              } focus:shadow-outline appearance-none rounded focus:outline-none`}
                              id="c_password"
                              autoComplete="new-password"
                            />
                          </FormControl>
                        </div>
                        <FormDescription className="font-family-caption v-font-body2 text-form-labelplaceholder md:basis-10 md:overflow-y-auto">
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
                              errors.terms ? 'text-red-500' : 'text-form-labelplaceholder'
                            }`}
                            htmlFor="terms"
                          >
                            Accept Terms & Conditions
                          </FormLabel>
                          {!errors.terms ? (
                            <FormDescription className="font-family-caption v-font-body2 text-form-labelplaceholder">
                              You agree to our Terms of Service and Privacy Policy
                            </FormDescription>
                          ) : (
                            <FormMessage className="v-font-body1 italic">
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
                  color=""
                  className="v-font-secondary px-vspace-m py-vspace-2xs focus:shadow-outline bg-button-button text-button-buttontext hover:bg-button-hoverbutton hover:text-button-hoverbuttontext focus:outline-none"
                  type="submit"
                >
                  Register Account
                </Button>
              </div>
            </form>
          </Form>

          <hr className="mt-vspace-m" />
          <div className="mt-vspace-m text-center">
            <Link
              className="v-font-secondary hover:text-elements-hover text-elements-link inline-block align-baseline"
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
