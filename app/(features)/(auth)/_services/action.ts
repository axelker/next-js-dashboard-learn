'use server';

import { redirect } from 'next/navigation';
import { FormSchema } from '@/app/(features)/(auth)/_models/auth-form-validation';
import { State } from '@/app/(features)/(auth)/_types/auth-form-state.type';
import { auth } from '@/lib/auth';

export async function sigIn(
    _prevState: State,
    formData: FormData): Promise<State> {
    // Form validation
    const validatedFields = FormSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to authenticate.',
            values: {
                email: formData.get('email')?.toString() ?? '',
                password: formData.get('password')?.toString() ?? '',
            }
        };
    }

    const { email, password } = validatedFields.data;
    try {
       await auth.api.signInEmail({
        body:{
            email:email,
            password:password
        }
       })
    } catch (error:unknown) {
        console.error(error);
        let message = 'Unknown error occurred during sign-up';
        if (error instanceof Error) {
            message = error.message;
        }
        return {
            message: `${message}`,
            values: {
                email: formData.get('email')?.toString() ?? '',
                password: formData.get('password')?.toString() ?? '',
            }
        };
    }
    redirect('/dashboard');
}

export async function sigUp(
    _prevState: State,
    formData: FormData): Promise<State> {
    // Form validation
    const validatedFields = FormSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to sign up.',
            values: {
                name: formData.get('email')?.toString() ?? '',
                email: formData.get('email')?.toString() ?? '',
                password: formData.get('password')?.toString() ?? '',
            }
        };
    }

    const { name,email, password } = validatedFields.data;
    try {
       await auth.api.signUpEmail({
        body:{
            name:name ?? '',
            email:email,
            password:password
        }
       })
    } catch (error:unknown) {
        console.error(error);
        let message = 'Unknown error occurred during sign-up';
        if (error instanceof Error) {
            message = error.message;
        }
        return {
            message: `${message}`,
            values: {
                name: formData.get('email')?.toString() ?? '',
                email: formData.get('email')?.toString() ?? '',
                password: formData.get('password')?.toString() ?? '',
            }
        };
    }
    redirect('/dashboard');
}