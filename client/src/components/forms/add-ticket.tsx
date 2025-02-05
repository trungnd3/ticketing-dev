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
// import { useContext } from 'react';
// import { AppContext } from '@/contexts/app';
import { ITicket } from '@/interfaces/ticket';
import { useContext } from 'react';
import { AppContext } from '@/contexts/app';

const formSchema = z.object({
  title: z.string().min(1, { message: 'Title cannot be empty.' }),
  price: z.string(),
});

export default function AddTicketForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      price: '',
    },
  });
  const { onTicketAdded } = useContext(AppContext);

  const { doRequest } = useRequest<z.infer<typeof formSchema>, ITicket>({
    url: '/api/tickets',
    method: 'post',
    onSuccess: (data) => {
      onTicketAdded(data);
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
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder='Title' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='price'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder='Price' {...field} type='text' />
              </FormControl>
              <FormDescription>
                The price must be a float number with two digits after the dot.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>Create</Button>
      </form>
    </Form>
  );
}
