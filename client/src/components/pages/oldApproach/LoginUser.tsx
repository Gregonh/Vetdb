import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useErrorBoundary } from 'react-error-boundary';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';

import { dealWithErrors } from '../../errors/dealWithError';
import { Button } from '../../ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../ui/form';
import { Input } from '../../ui/input';

/**
 * TODO: improve styles
 * TODO: refactor
 */

const loginValidationSchema = z.object({
  email: z.string().min(9, { message: 'must be at least 9 characters' }).email({
    message: 'Must be a valid email',
  }),
  password: z
    .string()
    .min(6, {
      message: 'Password must be at least 6 characters',
    })
    .max(20, { message: 'Password must be no more than 20 characters' }),
});

type LoginValidation = z.infer<typeof loginValidationSchema>;

export function LoginUser() {
  const { showBoundary } = useErrorBoundary();
  const form = useForm<LoginValidation>({
    resolver: zodResolver(loginValidationSchema),
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = form;

  const loginUser = async (user: LoginValidation) => {
    try {
      const client = axios.create({
        baseURL: 'http://localhost:4001/user',
        timeout: 40000,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        },
      });
      const baseURL = client.defaults.baseURL as string;
      const data = {
        name: user.email,
        password: user.password,
      };
      await client.post(baseURL, data);
    } catch (error) {
      dealWithErrors(error, showBoundary);
    }
  };

  const onSubmit = async (data: LoginValidation) => {
    try {
      const user = loginValidationSchema.parse(data);
      await loginUser(user);
    } catch (error: unknown) {
      dealWithErrors(error, showBoundary);
    }
  };

  return (
    <>
      <div className="u-container v-full-height mb-vspace-s-xl text-cfont-0 md:flex md:items-center">
        <div className="md:grow">
          <h1 className="text-cfont-3 px-cspace-s-l pt-cspace-s-l">Login de usuario</h1>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="p-cspace-s-l">
              <div>
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
                      <FormMessage>{errors.email && errors.email?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>
              <div className="mt-cspace-xs">
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
                      <FormMessage className="md:basis-10 md:overflow-y-auto">
                        {errors.password && errors.password?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              </div>
              <div className="mt-cspace-m text-center">
                <Button
                  className="focus:shadow-outline w-full rounded-full bg-blue-500 px-4 py-2 font-bold text-[rgb(28,28,28)] hover:bg-blue-700 hover:text-white focus:outline-none"
                  type="submit"
                >
                  Login
                </Button>
              </div>
            </form>
          </Form>

          <hr className="mt-cspace-m border-t" />
          <div className="mt-cspace-m text-center">
            <a
              className="small-text inline-block align-baseline text-sm text-[rgb(39,86,163)] hover:text-blue-800"
              href="/changePassword/9"
            >
              Forgot Password?
            </a>
          </div>
          <div className="text-center">
            <Link
              className="small-text inline-block align-baseline text-sm text-[rgb(39,86,163)] hover:text-blue-800"
              to="/register"
            >
              Don&apos;t have an account? Register!
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
