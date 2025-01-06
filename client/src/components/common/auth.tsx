'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import SigninForm from '@/components/forms/signin';
import SignupForm from '@/components/forms/signup';

export default function AuthForm() {
  const [isSignin, setIsSignin] = useState(true);

  function toggleFormTypeHandler() {
    setIsSignin((prev) => !prev);
  }

  return (
    <div className='relative w-1/2 bg-white'>
      <div className='flex items-center shadow-xl rounded-xl'>
        <div className='flex w-full'>
          <div className='flex items-center p-10 min-h-[450px] w-1/2'>
            <SigninForm />
          </div>
          <div className='flex items-center p-10 min-h-[450px] w-1/2'>
            <SignupForm />
          </div>
        </div>
        <div
          className={`absolute flex flex-col justify-center items-center gap-10 bg-red-500 w-1/2 h-full transition-all ${
            isSignin ? 'rounded-r-xl left-1/2' : 'rounded-l-xl left-0'
          }`}
        >
          <span className='text-white'>{`${
            isSignin
              ? "You haven't had account yet?"
              : 'Already had an account?'
          }`}</span>
          <Button variant='outline' onClick={toggleFormTypeHandler}>{`${
            isSignin ? 'Go to Sign Up' : 'Go to Sign In'
          }`}</Button>
        </div>
      </div>
    </div>
  );
}
