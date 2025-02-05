'use client';

import { useContext } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useRequest } from '@/hooks/use-request';
import { IOrder } from '@/interfaces/order';
import { AppContext } from '@/contexts/app';
import Link from 'next/link';

export default function Tickets() {
  const { tickets } = useContext(AppContext);
  const router = useRouter();

  const { doRequest } = useRequest<{ ticketId: string }, IOrder>({
    url: '/api/orders',
    method: 'post',
    onSuccess: (data) => {
      router.push(`/orders/${data.id}`);
    },
    onError(err) {
      console.log('Error:', err);
    },
  });

  return (
    <Table>
      <TableCaption>A list of all tickets.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead className='w-1/2'>Description</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Currency</TableHead>
          <TableHead>Reserved</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {!!tickets &&
          tickets.length > 0 &&
          tickets.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell className='font-medium'>{ticket.title}</TableCell>
              <TableCell>Lorem ipsum</TableCell>
              <TableCell>${ticket.price}</TableCell>
              <TableCell>USD</TableCell>
              <TableCell>{!ticket.orderId ? 'no' : 'yes'}</TableCell>
              <TableCell>
                {!ticket.orderId && (
                  <Button
                    variant='destructive'
                    onClick={() => doRequest({ ticketId: ticket.id })}
                  >
                    Purchase
                  </Button>
                )}
                {!!ticket.orderId && (
                  <Link href={`/orders/${ticket.orderId}`}>Pay</Link>
                )}
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
