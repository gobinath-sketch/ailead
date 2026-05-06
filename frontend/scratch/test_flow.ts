import puppeteer from 'puppeteer';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runTest() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log("1. Navigating to Register...");
  await page.goto('http://localhost:3000/register');
  
  console.log("2. Selecting Student...");
  await page.click('button:nth-child(1)'); // Student button
  await new Promise(r => setTimeout(r, 1000));
  
  console.log("3. Filling Form...");
  await page.type('input[placeholder="First Name"]', 'EndToEnd');
  await page.type('input[placeholder="Last Name"]', 'Tester');
  await page.type('input[placeholder="name@work.com"]', 'e2e@example.com');
  await page.type('input[placeholder="10-digit mobile"]', '1234567890');
  await page.type('input[placeholder="Institution name"]', 'E2E University');
  await page.type('input[placeholder="e.g. B.Tech CS"]', 'Testing');
  
  // Select year
  await page.select('select', 'Final Year');
  
  console.log("4. Submitting...");
  await page.click('button:last-child');
  
  console.log("5. Waiting for OTP screen...");
  await new Promise(r => setTimeout(r, 5000));
  
  console.log("6. Fetching OTP from DB...");
  const otpRecord = await prisma.otpVerification.findFirst({
    where: { email: 'e2e@example.com' },
    orderBy: { createdAt: 'desc' }
  });
  
  if (!otpRecord) throw new Error("OTP not found in DB");
  console.log(`Found OTP: ${otpRecord.otp}`);
  
  console.log("7. Entering OTP...");
  await page.type('input[placeholder="0000"]', otpRecord.otp);
  await page.click('button:last-child');
  
  console.log("8. Waiting for Dashboard redirect...");
  await new Promise(r => setTimeout(r, 5000));
  
  const url = page.url();
  console.log(`Current URL: ${url}`);
  
  if (url.includes('/dashboard')) {
    console.log("SUCCESS: Redirected to dashboard.");
    
    const isBlurred = await page.evaluate(() => {
        const dashboard = document.querySelector('div.blur-md');
        return !!dashboard;
    });
    console.log(`Dashboard is blurred: ${isBlurred}`);
    
    const hasPopup = await page.evaluate(() => {
        return document.body.innerText.includes('Unlock Dashboard');
    });
    console.log(`Unlock Popup visible: ${hasPopup}`);
  } else {
    console.log("FAILURE: Did not redirect to dashboard.");
  }
  
  await browser.close();
  await prisma.$disconnect();
}

runTest().catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
