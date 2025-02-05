'use client';

import { useContext } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRequest } from '@/hooks/use-request';
import { useRouter } from 'next/navigation';
import { AppContext } from '@/contexts/app';
import { IUser } from '@/interfaces/user';

const formSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: 'Email cannot be empty.' })
      .email('This is not a valid email.'),
    password: z
      .string()
      .min(4, { message: 'Password too short.' })
      .max(20, { message: 'Password too long.' }),
    confirmPassword: z
      .string()
      .min(4, { message: 'Password too short.' })
      .max(20, { message: 'Password too long.' }),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords did not match',
        path: ['confirmPassword'],
      });
    }
  });

export default function SignupForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
  const { setUser } = useContext(AppContext);

  const { doRequest } = useRequest<{ email: string; password: string }, IUser>({
    url: '/api/users/signup',
    method: 'post',
    onSuccess: (data) => {
      setUser({ email: data.email });
      router.push('/');
    },
    onError(err) {
      console.log('Error:', err);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    doRequest({ email: values.email, password: values.password });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder='Email' {...field} />
              </FormControl>
              <FormDescription>
                Your email must in in correct format.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder='Password' {...field} type='password' />
              </FormControl>
              <FormDescription>
                Your password has minimum of 4 and maximum of 20 characters.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='confirmPassword'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder='Confirm Password'
                  {...field}
                  type='password'
                />
              </FormControl>
              <FormDescription>
                You must confirm your password to be created.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>Sign Up</Button>
      </form>
    </Form>
  );
}
