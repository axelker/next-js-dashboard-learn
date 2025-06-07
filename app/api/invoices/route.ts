import { prisma } from '@/lib/prisma-client';

async function listInvoices() {
 const data = await prisma.invoice.findMany({
    where: {
      amount: 666,
    },
    select: {
      amount: true,
      customer: {
        select: {
          name: true,
        },
      },
    },
  });

	return data;
}

export async function GET() {
  try {
  	return Response.json(await listInvoices());
  } catch (error) {
  	return Response.json({ error }, { status: 500 });
  }
}
