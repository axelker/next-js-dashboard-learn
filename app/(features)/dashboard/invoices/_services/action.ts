// SERVEUR FORM ACTION PERSISTANCE
'use server';
//Lib for valdating form
import { z } from 'zod';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';


const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });


//Form schema used zod for validation and error message.
const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
      invalid_type_error: 'Please select a customer.',
    }),
    amount: z.coerce.number().gt(0, { message: 'Please enter an amount greater than $0.' }),
    status: z.enum(['pending', 'paid'], {
      invalid_type_error: 'Please select an invoice status.',
    }),
    date: z.string(),
});

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
  values?: {
    customerId?: string;
    amount?: string;
    status?: string;
  };
};


const CreateInvoice = FormSchema.omit({ id: true, date: true });
 

export async function createInvoice(_prevState: State,formData: FormData): Promise<State>  {
  // Form validation
    const validatedFields = CreateInvoice.safeParse({
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Create Invoice.',
        values: {
          customerId: formData.get('customerId')?.toString() ?? '',
          amount: formData.get('amount')?.toString() ?? '',
          status: formData.get('status')?.toString() ?? '',
        }
      };
    }

    //Create
    const { customerId, amount, status } = validatedFields.data;

    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];
    try {
      await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
      `;
    } catch (error) {
      return {
        message: 'Database Error: Failed to Create Invoice.',
      };
    }


    // clean next js cache for update list of invoices and redirect.
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');


}

const UpdateInvoice = FormSchema.omit({ id: true, date: true });
export async function updateInvoice(id: string,
  _prevState: State,
  formData: FormData): Promise<State> {
  const validatedFields = UpdateInvoice.safeParse({
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Create Invoice.',
      };
    }

  const { customerId, amount, status } = validatedFields.data;

  const amountInCents = amount * 100;
 
  try {
    await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;
  } catch (error) {
      return {
        message: 'Database Error: Failed to Update Invoice.',
      };
  }

 
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}


export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
  } catch (error) {
    console.log(error)
  }
  revalidatePath('/dashboard/invoices');
}