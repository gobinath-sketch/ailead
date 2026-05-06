import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const otp = await prisma.otpVerification.findFirst({
    orderBy: { createdAt: 'desc' }
  });
  console.log(JSON.stringify(otp));
}

main().catch(console.error).finally(() => prisma.$disconnect());
