import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { PaymentsController } from '../src/payments/payments.controller';
import { PaymentsService } from '../src/payments/payments.service';
import { RegistrationsController } from '../src/registrations/registrations.controller';
import { RegistrationsService } from '../src/registrations/registrations.service';

describe('API endpoints (e2e)', () => {
  let app: INestApplication;

  const paymentsService = {
    registrationFee: jest
      .fn()
      .mockReturnValue({ amountPaise: 49900, amountInr: 499 }),
    createOrder: jest.fn().mockResolvedValue({
      keyId: 'rzp_test_mock',
      amount: 49900,
      currency: 'INR',
      orderId: 'order_mock',
      paymentId: 'pay_internal_mock',
      description: 'Global Knowledge Technologies - Event Registration',
    }),
    verifyPayment: jest
      .fn()
      .mockResolvedValue({ success: true, paymentId: 'pay_internal_mock' }),
    getPayment: jest
      .fn()
      .mockResolvedValue({ id: 'pay_internal_mock', status: 'PAID' }),
  };

  const registrationsService = {
    create: jest
      .fn()
      .mockResolvedValue({ id: 'reg_01', paymentId: 'pay_internal_mock' }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController, RegistrationsController],
      providers: [
        { provide: PaymentsService, useValue: paymentsService },
        { provide: RegistrationsService, useValue: registrationsService },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /payments/fee', async () => {
    await request(app.getHttpServer()).get('/payments/fee').expect(200);
  });

  it('POST /payments/create-order success', async () => {
    await request(app.getHttpServer())
      .post('/payments/create-order')
      .send({
        fullName: 'Test User',
        email: 'user@example.com',
        phone: '9876543210',
      })
      .expect(201);
  });

  it('POST /payments/verify success', async () => {
    await request(app.getHttpServer())
      .post('/payments/verify')
      .send({
        razorpayOrderId: 'order_mock',
        razorpayPaymentId: 'pay_mock',
        razorpaySignature: 'sig_mock',
        fullName: 'Test User',
        email: 'user@example.com',
        phone: '9876543210',
      })
      .expect(201);
  });

  it('POST /payments/create-order validation error', async () => {
    await request(app.getHttpServer())
      .post('/payments/create-order')
      .send({ fullName: '', email: 'bad', phone: '12' })
      .expect(400);
  });

  it('POST /registrations success', async () => {
    await request(app.getHttpServer())
      .post('/registrations')
      .send({
        paymentId: 'pay_internal_mock',
        fullName: 'Test User',
        email: 'user@example.com',
        phone: '9876543210',
        organization: 'Org',
        role: 'Learner',
      })
      .expect(201);
  });

  it('POST /registrations validation error', async () => {
    await request(app.getHttpServer())
      .post('/registrations')
      .send({
        paymentId: '',
        fullName: '',
        email: 'bad',
        phone: '123',
      })
      .expect(400);
  });
});
