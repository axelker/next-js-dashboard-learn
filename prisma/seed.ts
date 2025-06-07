import { customers, invoices, revenue } from './seed-data';
import { prisma } from '@/lib/prisma-client';

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

async function main() {
  await seedCustomers();
  await seedInvoices();
  await seedRevenue();
}

main()
  .then(() => {
    console.log('✅ Database seeded successfully');
  })
  .catch((e) => {
    console.error('Error while seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
