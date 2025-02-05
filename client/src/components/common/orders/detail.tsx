'use client';

import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import StripeCheckout from 'react-stripe-checkout';
import { IOrder } from '@/interfaces/order';
import { AppContext } from '@/contexts/app';
import { useRequest } from '@/hooks/use-request';
import { IPayment } from '@/interfaces/payment';
import { useRouter } from 'next/navigation';

interface IOrderDetailProps {
  order: IOrder;
}

function elapsed(time: string) {
  return Math.round((new Date(time).getTime() - new Date().getTime()) / 1000);
}

export default function OrderDetail({ order }: IOrderDetailProps) {
  const [msLeft, setMsLeft] = useState(elapsed(order.expiresAt));
  const { currentUser } = useContext(AppContext);
  const router = useRouter();

  const { doRequest } = useRequest<
    { token: string; orderId: string },
    IPayment
  >({
    url: '/api/users/signin',
    method: 'post',
    onSuccess: () => {
      router.push('/orders');
    },
    onError(err) {
      console.log('Error:', err);
    },
  });

  useEffect(() => {
    const timeId = setInterval(() => {
      setMsLeft(elapsed(order.expiresAt));
    }, 1000);

    return () => {
      clearInterval(timeId);
    };
  }, [order.expiresAt]);

  if (msLeft < 0) {
    return (
      <div>
        <h1>Order for ticket {order.ticket.title}</h1>
        <p>This order is expired.</p>
        <Link href='/'>Back to home</Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Order for ticket {order.ticket.title}</h1>

      <p>You have {msLeft} seconds left to complete your payment</p>
      <StripeCheckout
        token={(token) => doRequest({ token: token.id, orderId: order.id })}
        stripeKey='pk_test_51Qnco1IIS2gq5G2L8nP97gzJ3OPhakPTf0V73D7rPOIpIbY6OptveVLkEhFbEPDWgDBWdtN4XKUAACmXz2mmyHTX002qgXEmhE'
        amount={order.ticket.price * 100}
        email={currentUser?.email}
      />
    </div>
  );
}
