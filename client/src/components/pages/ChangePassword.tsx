import { zodResolver } from '@hookform/resolvers/zod';
import axios, { isAxiosError } from 'axios';
import { useState, useEffect, useCallback } from 'react';
import { useErrorBoundary } from 'react-error-boundary';
import { useForm } from 'react-hook-form';
import { redirect, useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';

import { dealWithErrors } from '../errors/dealWithError';
import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
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

/**
 * TODO: error boundary
 * TODO: match password time problem
 * TODO: combine with email service
 * TODO: catch error better, like in getIdParam function
 * TODO: improve styles
 * TODO: check if loader is needed for useEffect
 * TODO: hashing password on the client before send, hashing in server
 * TODO: rate limiting prevent abuse of the endpoint
 * TODO: resolve what do with an incorrect param id, redirect or create error
 */

const changePasswordValidationSchema = z
  .object({
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
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: "Password don't match",
  });

type PasswordValidation = z.infer<typeof changePasswordValidationSchema>;
interface EmailResponse {
  email: string;
}

function ChangePassword() {
  const { showBoundary } = useErrorBoundary();
  const [userEmail, setUserEmail] = useState('');
  const params = useParams();
  /**
   * get the user email for the hidden input,
   * to improve accessibility
   */
  const getIdParam = useCallback(() => {
    if (!params['id']) {
      throw new Error('id param is undefined');
    }
    return params['id'];
  }, [params]);

  useEffect(() => {
    const id = getIdParam();
    console.warn({ id });
    axios
      .get<EmailResponse>('http://localhost:4001/user/confirmEmail')
      .then((res) => {
        if (res) {
          setUserEmail(res.data?.email);
        }
      })
      .catch((error: unknown) => {
        if (isAxiosError(error)) {
          console.error(error.message);
        }
        if (error instanceof Error) {
          console.error(error.message);
        }
      });
  }, [getIdParam]);

  const navigate = useNavigate();
  const form = useForm<PasswordValidation>({
    resolver: zodResolver(changePasswordValidationSchema),
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = form;

  if (!params['id']) {
    navigate('/login');
  }

  const updatePassword = async (newPassword: PasswordValidation) => {
    try {
      const id = getIdParam();
      const client = axios.create({
        baseURL: `http://localhost:4001/user`,
        timeout: 40000,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        },
      });
      const baseURL = client.defaults.baseURL as string;
      const data = {
        id,
        newPassword: newPassword.password,
      };
      await client.put(baseURL, data);
    } catch (error) {
      dealWithErrors(error, showBoundary);
    }
  };

  const onSubmit = async (formData: PasswordValidation) => {
    try {
      const newPassword = changePasswordValidationSchema.parse(formData);
      await updatePassword(newPassword);
      //or navigate('/login'); ??
      redirect('/login');
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        console.error(err.message);
      }
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
      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>
            Change your password here. After saving, you&apos;ll be logged out.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Form {...form}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="p-cspace-s-l"
              id="passwordForm"
            >
              <div className="mt-cspace-xs">
                {/* the hidden input must be the first */}
                <Input
                  type="text"
                  name="email"
                  readOnly={true}
                  value={userEmail ?? ''}
                  autoComplete="username email"
                  className="hidden"
                />
                <div className="">
                  <FormField
                    control={control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel
                          className="font-bodybold block text-sm text-gray-700"
                          htmlFor="newPassword"
                        >
                          Password
                        </FormLabel>
                        <FormControl className="mt-2">
                          <Input
                            {...field}
                            type="password"
                            className={`w-full border px-3 py-2 text-sm leading-tight text-gray-700 ${
                              errors.password && 'border-red-500'
                            } focus:shadow-outline appearance-none rounded focus:outline-none`}
                            id="newPassword"
                            autoComplete="new-password"
                            defaultValue=""
                          />
                        </FormControl>
                        <FormDescription className="font-bodythin">
                          Choose a strong password
                        </FormDescription>
                        <FormMessage>
                          {errors.password && errors.password?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mt-cspace-xs">
                  <FormField
                    control={control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel
                          className="font-bodybold block text-sm text-gray-700"
                          htmlFor="confirmPassword"
                        >
                          Confirm password
                        </FormLabel>
                        <div>
                          <FormControl className="mt-2">
                            <Input
                              {...field}
                              type="password"
                              className={`w-full border px-3 py-2 text-sm leading-tight text-gray-700 ${
                                errors.confirmPassword && 'border-red-500'
                              } focus:shadow-outline appearance-none rounded focus:outline-none`}
                              id="confirmPassword"
                              autoComplete="new-password"
                              defaultValue=""
                            />
                          </FormControl>
                        </div>
                        <FormDescription className="font-bodythin">
                          Choose the same password
                        </FormDescription>
                        <FormMessage className="small-text">
                          {errors.confirmPassword && errors.confirmPassword?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <Button type="submit" form="passwordForm" disabled={!userEmail}>
            Save password
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}

export { ChangePassword };
