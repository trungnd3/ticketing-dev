'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useContext } from 'react';
import { AppContext } from '@/contexts/app';

export default function Header() {
  const { currentUser } = useContext(AppContext);

  return (
    <header className='flex justify-center bg-slate-300'>
      <nav className='flex justify-between items-center w-3/5 h-16'>
        <Button asChild>
          <Link
            className='bg-blue-500 text-white p-2 rounded-md hover:bg-blue-400'
            href='/'
          >
            GitTix
          </Link>
        </Button>
        {currentUser !== null && (
          <div className='flex gap-4'>
            <Button asChild variant='default'>
              <Link href='/tickets/new'>Sell Ticket</Link>
            </Button>
            <Button asChild variant='secondary'>
              <Link href='/orders'>My Orders</Link>
            </Button>
            <Button asChild variant='ghost'>
              <Link href='/auth/sign-out'>Sign Out</Link>
            </Button>
          </div>
        )}
        {currentUser === null && (
          <Button asChild variant='secondary'>
            <Link href='/auth'>Sign In/Up</Link>
          </Button>
        )}
      </nav>
    </header>
  );
}
