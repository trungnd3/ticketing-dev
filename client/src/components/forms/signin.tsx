'use client';

import { useRouter } from 'next/navigation';
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

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email cannot be empty.' })
    .email('This is not a valid email.'),
  password: z
    .string()
    .min(4, { message: 'Password too short.' })
    .max(20, { message: 'Password too long.' }),
});

export default function SigninForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { doRequest } = useRequest<z.infer<typeof formSchema>>({
    url: '/api/users/signin',
    method: 'post',
    onSuccess: () => {
      router.push('/');
    },
    onError(err) {
      console.log('Error:', err);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    doRequest(values);
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
        <Button type='submit'>Sign In</Button>
      </form>
    </Form>
  );
}
