'use client';

import {
  AtSymbolIcon,
  KeyIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '@/components/ui/button';
import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { sigUp } from '@/app/(features)/(auth)/_services/action';
import { State } from '@/app/(features)/(auth)/_types/auth-form-state.type';
import { lusitana } from '@/app/fonts/fonts';
import { FormInput } from "@/components/ui/form-input";

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
          <FormInput
            label="Name"
            id="name"
            name="name"
            type="text"
            placeholder="Your name"
            defaultValue={state?.values?.name}
            disabled={isPending}
            icon={<UserIcon className="h-[18px] w-[18px]" />}
            error={state.errors?.name}
          />

          <FormInput
            label="Email"
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            defaultValue={state?.values?.email}
            disabled={isPending}
            icon={<AtSymbolIcon className="h-[18px] w-[18px]" />}
            error={state.errors?.email}
          />

          <FormInput
            label="Password"
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            defaultValue={state?.values?.password}
            disabled={isPending}
            icon={<KeyIcon className="h-[18px] w-[18px]" />}
            error={state.errors?.password}
          />
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
