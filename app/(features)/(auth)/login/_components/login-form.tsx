'use client'
import { lusitana } from '@/app/fonts/fonts';
import {
  AtSymbolIcon,
  KeyIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '@/components/ui/button';
import { sigIn } from '@/app/(features)/(auth)/_services/action';
import { useActionState, useEffect } from 'react';
import { State } from '@/app/(features)/(auth)/_types/auth-form-state.type';
import { toast } from "sonner"
import { Loader2 } from 'lucide-react';
import Link from "next/link";
import { authClient } from '@/lib/auth-client';

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
  }, [state]);
  
  return (
    <>

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
      {/* --- Separator OR --- */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-3 text-gray-500">or</span>
          </div>
        </div>

        {/* --- Social Logins --- */}
        <button
          type="button"
          onClick={async () => {
            await authClient.signIn.social({
              provider: "github",
              callbackURL: "/dashboard",
            });
          }}
          className="w-full flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          {/* GitHub SVG */}
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 0C5.37 0 0 5.373 0 12a12 12 0 008.207 11.387c.6.11.793-.26.793-.577v-2.024c-3.338.727-4.042-1.61-4.042-1.61-.547-1.387-1.337-1.757-1.337-1.757-1.092-.747.084-.732.084-.732 1.208.086 1.843 1.24 1.843 1.24 1.07 1.835 2.807 1.305 3.492.998.108-.776.418-1.305.762-1.605-2.665-.306-5.466-1.332-5.466-5.931 0-1.31.469-2.382 1.236-3.221-.124-.303-.535-1.527.117-3.176 0 0 1.008-.322 3.3 1.23A11.5 11.5 0 0112 5.8c1.02.005 2.045.137 3.003.403 2.291-1.552 3.297-1.23 3.297-1.23.654 1.649.243 2.873.119 3.176.77.839 1.235 1.911 1.235 3.221 0 4.61-2.805 5.624-5.478 5.921.43.372.814 1.102.814 2.222v3.293c0 .32.192.694.8.576A12.005 12.005 0 0024 12c0-6.627-5.373-12-12-12z"
            />
          </svg>
          Sign in with GitHub
        </button>

        <button
          type="button"
          onClick={async () => {
            await authClient.signIn.social({
              provider: "google",
              callbackURL: "/dashboard",
            });
          }}
          className="mt-2 w-full flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          {/* Google SVG */}
          <svg className="h-5 w-5" viewBox="0 0 533.5 544.3">
            <path
              fill="#4285F4"
              d="M533.5 278.4c0-17.4-1.4-34.1-4.1-50.4H272v95.4h147.6c-6.4 34.7-25.5 64-54.3 83.4v68.9h87.8c51.5-47.5 80.4-117.5 80.4-197.3z"
            />
            <path
              fill="#34A853"
              d="M272 544.3c73.6 0 135.3-24.4 180.4-66.5l-87.8-68.9c-24.4 16.3-55.6 25.9-92.6 25.9-71 0-131-48-152.5-112.3H29.1v70.6c45.4 89.9 138.7 151.2 242.9 151.2z"
            />
            <path
              fill="#FBBC05"
              d="M119.5 322.5c-10.2-30-10.2-62.5 0-92.5V159.4H29.1c-39 77.8-39 169.9 0 247.8l90.4-70.7z"
            />
            <path
              fill="#EA4335"
              d="M272 107.3c39.9 0 75.8 13.7 104.1 40.5l78-78C413.1 26.8 350.7 0 272 0 167.9 0 74.6 61.3 29.1 151.2l90.4 70.6C141 155.3 201 107.3 272 107.3z"
            />
          </svg>
          Sign in with Google
        </button>

        {/* --- Signup Link --- */}
        <div className="mt-4 text-center text-sm">
          Create an account?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </form>
    </>
  );
}
