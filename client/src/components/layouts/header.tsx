'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  currentUser: {
    email: string;
  } | null;
}

export default function Header({ currentUser }: HeaderProps) {
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
          <Button asChild variant='outline'>
            <Link href='/auth/sign-out'>Sign Out</Link>
          </Button>
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
