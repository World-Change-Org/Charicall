import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

describe('PaymentsController (integration)', () => {
  let app: INestApplication<App>;
  const paymentsService = {
    initializePaystackPayment: jest.fn(),
    verifyPaystackPayment: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [{ provide: PaymentsService, useValue: paymentsService }],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    paymentsService.initializePaystackPayment.mockReset();
    paymentsService.verifyPaystackPayment.mockReset();
    await app.close();
  });

  it('POST /payments/paystack/initialize validates payload and initializes', async () => {
    paymentsService.initializePaystackPayment.mockResolvedValue({
      provider: 'paystack',
      authorizationUrl: 'https://checkout.paystack.com/example',
      accessCode: 'code',
      reference: 'ref-1',
      amount: 1000,
      currency: 'NGN',
    });

    const response = await request(app.getHttpServer())
      .post('/payments/paystack/initialize')
      .send({
        email: 'donor@example.com',
        amount: 1000,
      })
      .expect(201);

    const body = response.body as { provider: string; reference: string };
    expect(body.provider).toBe('paystack');
    expect(body.reference).toBe('ref-1');

    expect(paymentsService.initializePaystackPayment).toHaveBeenCalledTimes(1);
  });

  it('POST /payments/paystack/initialize rejects invalid payload', async () => {
    await request(app.getHttpServer())
      .post('/payments/paystack/initialize')
      .send({
        email: 'not-an-email',
        amount: 0,
      })
      .expect(400);
  });

  it('GET /payments/paystack/verify/:reference verifies transaction', async () => {
    paymentsService.verifyPaystackPayment.mockResolvedValue({
      provider: 'paystack',
      reference: 'ref-2',
      amount: 2000,
      currency: 'NGN',
      status: 'success',
      paidAt: '2026-03-24T00:00:00.000Z',
      metadata: {},
    });

    const response = await request(app.getHttpServer())
      .get('/payments/paystack/verify/ref-2')
      .expect(200);

    const body = response.body as { reference: string; status: string };
    expect(body.reference).toBe('ref-2');
    expect(body.status).toBe('success');

    expect(paymentsService.verifyPaystackPayment).toHaveBeenCalledWith('ref-2');
  });
});
