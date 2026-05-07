const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'Gobinath.M@gktech.ai';
  
  // 1. Create a placeholder payment
  const payment = await prisma.payment.create({
    data: {
      amount: 0,
      status: 'PAID',
      fullName: 'Gobinath M',
      email: adminEmail,
      phone: '0000000000',
      description: 'System Admin Account',
    }
  });

  // 2. Create the Admin Registration
  const admin = await prisma.registration.upsert({
    where: { email: adminEmail },
    update: {
      role: 'ADMIN',
      password: 'gobi@2004', // In a real app, this should be hashed
    },
    create: {
      email: adminEmail,
      fullName: 'Gobinath M',
      phone: '0000000000',
      password: 'gobi@2004',
      role: 'ADMIN',
      paymentId: payment.id,
      userType: 'professional',
    }
  });

  console.log('Admin user seeded:', admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
