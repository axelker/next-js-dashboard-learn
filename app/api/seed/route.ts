import { prisma } from '@/app/lib/prisma-client';
import bcrypt from 'bcrypt';
import { customers, invoices, revenue, users } from '@/app/(features)/_services/placeholder-data';


async function seedUsers() {
  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        emailVerified:true,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt:new Date()
      },
    });
  }
}

async function seedCustomers() {
  for (const customer of customers) {
    await prisma.customer.upsert({
      where: { id: customer.id },
      update: {},
      create: customer,
    });
  }
}

async function seedInvoices() {
  for (const invoice of invoices) {
       await prisma.invoice.create({
      data: {
        customer: {
          connect: { id: invoice.customer_id }
        },
        amount: invoice.amount,
        status: invoice.status,
        date: new Date(invoice.date),
      },
    });
  }
}

async function seedRevenue() {
  for (const rev of revenue) {
    await prisma.revenue.upsert({
      where: { month: rev.month },
      update: {},
      create: rev,
    });
  }
}

export async function GET() {
  try {
    await Promise.all([
      seedUsers(),
      seedCustomers(),
      seedInvoices(),
      seedRevenue()
    ])
    return Response.json({ message: '✅ Database seeded successfully' });
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Seeding failed' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
