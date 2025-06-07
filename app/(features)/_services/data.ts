import { prisma } from '@/app/lib/prisma-client';
import {
  CustomersTableType,
} from '@/app/(features)/dashboard/_types/definitions';
import { formatCurrency } from './utils';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!);

export async function fetchRevenue() {
  try {
    const data = await prisma.revenue.findMany();
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  try {
    const data = await prisma.invoice.findMany({
      take: 5,
      orderBy: { date: "desc" },
      include: {
        customer: {
          select: {
            name: true,
            image_url: true,
            email: true,
          },
        },
      },
    });

    return data.map((invoice) => ({
      id: invoice.id,
      amount: formatCurrency(invoice.amount),
      name: invoice.customer.name,
      email: invoice.customer.email,
      image_url: invoice.customer.image_url,
    }));
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the latest invoices.");
  }
}

export async function fetchCardData() {
  try {
    const [invoiceCount, customerCount, invoiceStatus] = await Promise.all([
      prisma.invoice.count(),
      prisma.customer.count(),
      prisma.invoice.aggregate({
        _sum: {
          amount: true,
        },
        _count: true,
        _avg: {
          amount: true,
        },
        _max: {
          amount: true,
        },
        _min: {
          amount: true,
        },
      }),
    ]);

    const totalPaid = await prisma.invoice.aggregate({
      _sum: {
        amount: true,
      },
      where: { status: "paid" },
    });

    const totalPending = await prisma.invoice.aggregate({
      _sum: {
        amount: true,
      },
      where: { status: "pending" },
    });

    return {
      numberOfCustomers: customerCount,
      numberOfInvoices: invoiceCount,
      totalPaidInvoices: formatCurrency(totalPaid._sum.amount || 0),
      totalPendingInvoices: formatCurrency(totalPending._sum.amount || 0),
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch card data.");
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(query: string, currentPage: number) {
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await prisma.invoice.findMany({
      skip,
      take: ITEMS_PER_PAGE,
      orderBy: { date: "desc" },
      where: {
        OR: [
          { amount: { equals: parseInt(query) || undefined } },
          { status: { contains: query, mode: "insensitive" } },
          {  date: {
            equals: !isNaN(new Date(query).getTime())
              ? new Date(query).toISOString()
              : undefined
          }},
          { customer: {
              OR: [
                { name: { contains: query, mode: "insensitive" } },
                { email: { contains: query, mode: "insensitive" } },
              ],
            },
          },
        ],
      },
      include: {
        customer: true,
      },
    });

    return invoices.map((invoice) => ({
      ...invoice,
      name: invoice.customer.name,
      email: invoice.customer.email,
      image_url: invoice.customer.image_url,
    }));
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoices.");
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const count = await prisma.invoice.count({
      where: {
        OR: [
          { amount: { equals: parseInt(query) || undefined } },
          { status: { contains: query, mode: "insensitive" } },
          {  date: {
            equals: !isNaN(new Date(query).getTime())
              ? new Date(query).toISOString()
              : undefined
          }},
          { customer: {
              OR: [
                { name: { contains: query, mode: "insensitive" } },
                { email: { contains: query, mode: "insensitive" } },
              ],
            },
          },
        ],
      },
    });

    return Math.ceil(count / ITEMS_PER_PAGE);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of invoices.");
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      select: {
        id: true,
        customer_id: true,
        amount: true,
        status: true,
      },
    });

    if (!invoice) return null;

    return {
      ...invoice,
      amount: invoice.amount / 100,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoice.");
  }
}

export async function fetchCustomers() {
  try {
    return await prisma.customer.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch customers.");
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql<CustomersTableType[]>`
		SELECT
		  customer.id,
		  customer.name,
		  customer.email,
		  customer.image_url,
		  COUNT(invoice.id) AS total_invoices,
		  SUM(CASE WHEN invoice.status = 'pending' THEN invoice.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoice.status = 'paid' THEN invoice.amount ELSE 0 END) AS total_paid
		FROM customer
		LEFT JOIN invoice ON customer.id = invoice.customer_id
		WHERE
		  customer.name ILIKE ${`%${query}%`} OR
        customer.email ILIKE ${`%${query}%`}
		GROUP BY customer.id, customer.name, customer.email, customer.image_url
		ORDER BY customer.name ASC
	  `;

    const customers = data.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}
