'use client';

import {
  AtSymbolIcon,
  KeyIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from './button';
import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { sigUp } from '@/app/(features)/(auth)/_services/action';
import { State } from '@/app/(features)/(auth)/_types/auth-form-state.type';
import { lusitana } from '@/app/(features)/_shared/fonts';

export default function SignupForm() {
  const initialState: State = {
    message: null,
    errors: {},
    values: {},
  };
  const [state, formAction, isPending] = useActionState<State, FormData>(sigUp, initialState);

  useEffect(() => {
    if (state?.message) {
      toast.error(state.message);
      state.message = undefined;
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Create your account
        </h1>
        <div className="w-full space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-gray-900 mb-1" htmlFor="name">
              Name
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="name"
                name="name"
                type="text"
                placeholder="Your name"
                defaultValue={state?.values?.name}
                disabled={isPending}
              />
              <UserIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
            {state.errors?.name?.map((error: string) => (
              <p className="text-sm text-red-500 mt-1" key={error}>{error}</p>
            ))}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-gray-900 mb-1" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                defaultValue={state?.values?.email}
                disabled={isPending}
              />
              <AtSymbolIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
            {state.errors?.email?.map((error: string) => (
              <p className="text-sm text-red-500 mt-1" key={error}>{error}</p>
            ))}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-gray-900 mb-1" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                defaultValue={state?.values?.password}
                disabled={isPending}
              />
              <KeyIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
            {state.errors?.password?.map((error: string) => (
              <p className="text-sm text-red-500 mt-1" key={error}>{error}</p>
            ))}
          </div>
        </div>

        <Button disabled={isPending} className="mt-6 w-full flex items-center justify-center gap-2">
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-white" />
              Creating account...
            </>
          ) : (
            <>
              Sign up
              <ArrowRightIcon className="ml-auto h-5 w-5 text-white" />
            </>
          )}
        </Button>

        <div className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Log in
          </a>
        </div>
      </div>
    </form>
  );
}
