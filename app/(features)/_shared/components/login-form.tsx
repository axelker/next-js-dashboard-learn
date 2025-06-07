'use client'
import { lusitana } from '@/app/(features)/_shared/fonts';
import {
  AtSymbolIcon,
  KeyIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from './button';
import { sigIn } from '@/app/(features)/(auth)/_services/action';
import { useActionState, useEffect } from 'react';
import { State } from '@/app/(features)/(auth)/_types/auth-form-state.type';
import { toast, Toaster } from "sonner"
import { Loader2 } from 'lucide-react';

export default function LoginForm() {

   const initialState: State = {
    message: null,
    errors: {},
    values: {},
  };
  const [state, formAction,isPending] = useActionState<State, FormData>(sigIn, initialState);
  

  useEffect(() => {
    if (state?.message) {
      toast.error( state.message);
      state.message = undefined;
    }
  }, [state?.message]);
  
  return (
    <>
    <Toaster position="top-right" ></Toaster>
    <form action={formAction} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Please log in to continue.
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                defaultValue={state?.values?.email}
                aria-describedby="email-error"
                disabled={isPending}
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {/** Error display */}
           <div id="customer-error" aria-live="polite" aria-atomic="true">
                {state.errors?.email &&
                state.errors.email.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                    </p>
                ))}
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                defaultValue={state?.values?.password}
                aria-describedby="password-error"
                disabled={isPending}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
             {/** Error display */}
           <div id="customer-error" aria-live="polite" aria-atomic="true">
                {state.errors?.password &&
                state.errors.password.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                    </p>
                ))}
            </div>
          </div>
        </div>
        <Button disabled={isPending} className="mt-4 w-full flex items-center justify-center gap-2">
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-white" />
              Logging in...
            </>
          ) : (
            <>
              Log in
              <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
            </>
          )}
        </Button>
      </div>
    </form>
    </>
  );
}
