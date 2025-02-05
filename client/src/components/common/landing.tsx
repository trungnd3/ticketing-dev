'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useContext } from 'react';
import { AppContext } from '@/contexts/app';
import Tickets from './tickets';

export default function Landing() {
  const { currentUser } = useContext(AppContext);

  return (
    <>
      {!currentUser && (
        <div className='text-center pt-16'>
          <h1>Tickets market</h1>
          <div className='pt-4'>
            <Button asChild variant='default'>
              <Link href='/auth'>Get started</Link>
            </Button>
          </div>
        </div>
      )}
      {!!currentUser && <Tickets />}
    </>
  );
}
