import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useErrorBoundary } from 'react-error-boundary';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';

import { dealWithErrors } from '../errors/dealWithError';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';

/**
 * TODO: error boundary
 * TODO: catch error better
 * TODO: improve styles
 * TODO: refactor
 */

const emailValidationSchema = z
  .object({
    email: z.string().min(9, { message: 'must be at least 9 characters' }).email({
      message: 'Must be a valid email',
    }),
    confirmEmail: z.string().min(9, { message: 'must be at least 9 characters' }).email({
      message: 'Must be a valid email',
    }),
  })
  .refine((data) => data.email === data.confirmEmail, {
    path: ['confirmEmail'],
    message: "Email don't match",
  });

type EmailValidation = z.infer<typeof emailValidationSchema>;

export function ConfirmEmail() {
  const { showBoundary } = useErrorBoundary();
  const { id } = useParams();
  const navigate = useNavigate();
  const form = useForm<EmailValidation>({
    resolver: zodResolver(emailValidationSchema),
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = form;

  if (!id || id == null) {
    navigate('/login');
  }

  const confirmEmailExist = async (user: EmailValidation) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const client = axios.create({
        baseURL: 'http://localhost:4001/user/confirmEmail',
        timeout: 40000,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        },
      });
      const baseURL = client.defaults.baseURL as string;
      const data = {
        id: id as string,
        email: user.email.toLowerCase(),
      };
      await client.post(baseURL, data);
    } catch (error) {
      dealWithErrors(error, showBoundary);
    }
  };

  const onSubmit = async (data: EmailValidation) => {
    try {
      const userEmail = emailValidationSchema.parse(data);
      if (!id) {
        navigate('/login');
      }
      await confirmEmailExist(userEmail);
      //TODO: learn how to dealt with axios response
      navigate(`/changePassword/${id}`);
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        console.error(err.issues);
      }
      if (err instanceof Error) {
        console.error(err.message);
      }

      navigate('/login');
    }
  };

  return (
    <>
      <div className="u-container v-full-height mb-vspace-s-xl text-cfont-0 md:flex md:items-center">
        <div className="md:grow">
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
                  name="confirmEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className="font-bodybold block text-sm text-gray-700"
                        htmlFor="c_email"
                      >
                        Confirm Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className={`w-full border px-3 py-2 text-sm leading-tight text-gray-700 ${
                            errors.confirmEmail && 'border-red-500'
                          } focus:shadow-outline appearance-none rounded focus:outline-none`}
                          id="c_email"
                          type="email"
                          autoComplete="email"
                          defaultValue=""
                        />
                      </FormControl>
                      <FormMessage>
                        {errors.confirmEmail && errors.confirmEmail?.message}
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
                  Send Email
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
