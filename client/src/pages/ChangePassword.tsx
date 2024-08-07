import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';

import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
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
  const [userEmail, setUserEmail] = useState('');
  /**
   * get the user email for the hidden input,
   * to improve accessibility
   */
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const id = getIdParam();
    axios
      .get<EmailResponse>(`http://localhost:4001/users/email/${id}`)
      .then((res) => {
        if (res) {
          console.log({ res });
          setUserEmail(res.data?.email);
        }
      })
      .catch((error: unknown) => {
        if (axios.isAxiosError(error)) {
          console.error(error.message);
        }
        if (error instanceof Error) {
          console.error(error.message);
        }
      });
  }, []);
  const params = useParams();
  const navigate = useNavigate();
  const form = useForm<PasswordValidation>({
    resolver: zodResolver(changePasswordValidationSchema),
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = form;

  const getIdParam = () => {
    if (!params['id']) {
      throw new Error('id param is undefined');
    }
    return params['id'];
  };

  const updatePassword = async (newPassword: PasswordValidation) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const id = getIdParam();
      const client = axios.create({
        baseURL: `http://localhost:4001/users/${id}`,
        timeout: 40000,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        },
      });
      const baseURL = client.defaults.baseURL as string;
      const data = {
        password: newPassword.password,
      };
      await client.put(baseURL, data).then((res) => console.log(res));
    } catch (error) {
      throw new AxiosError('axios error in put');
    }
  };

  const onSubmit = async (formData: PasswordValidation) => {
    try {
      const newPassword = changePasswordValidationSchema.parse(formData);
      await updatePassword(newPassword);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
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

  if (!params['id'] || params['id'] == null) {
    navigate('/login');
  }

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
                  value={userEmail ? userEmail : ''}
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
                          {errors.confirmPassword &&
                            errors.confirmPassword?.message}
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
          <Button type="submit" form="passwordForm">
            Save password
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}

export { ChangePassword };
