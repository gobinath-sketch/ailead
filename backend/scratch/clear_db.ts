import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning up database...");
  
  // Delete in order of dependency
  const r = await prisma.registration.deleteMany({});
  console.log(`Deleted ${r.count} registrations.`);
  
  const p = await prisma.payment.deleteMany({});
  console.log(`Deleted ${p.count} payments.`);
  
  const c = await prisma.communityLead.deleteMany({});
  console.log(`Deleted ${c.count} community leads.`);
  
  const o = await prisma.otpVerification.deleteMany({});
  console.log(`Deleted ${o.count} OTP records.`);
  
  console.log("Database is now empty.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
