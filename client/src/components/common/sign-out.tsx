'use client';

import { useRequest } from '@/hooks/use-request';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SignOut() {
  const router = useRouter();

  const { doRequest } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    onSuccess: () => {
      router.push('/');
    },
    onError: (err) => {
      console.log(err);
    },
  });

  useEffect(() => {
    doRequest({});
  }, [doRequest]);

  return <h1>Signing you out...</h1>;
}
