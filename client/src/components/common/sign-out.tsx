'use client';

import { AppContext } from '@/contexts/app';
import { useRequest } from '@/hooks/use-request';
import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';

export default function SignOut() {
  const router = useRouter();
  const { setUser } = useContext(AppContext);

  const { doRequest } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    onSuccess: () => {
      setUser(null);
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
