import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { BadGatewayException } from '@nestjs/common';
import { PaymentsService } from './payments.service';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let fetchMock: jest.SpiedFunction<typeof fetch>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) => {
              if (key === 'PAYSTACK_SECRET_KEY') return 'sk_test_123';
              if (key === 'PAYSTACK_CALLBACK_URL')
                return 'http://localhost:3000/api/payments/callback';
              return undefined;
            },
          },
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    fetchMock = jest.spyOn(global, 'fetch');
  });

  afterEach(() => {
    fetchMock.mockRestore();
  });

  it('initializes a paystack payment', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          status: true,
          message: 'Authorization URL created',
          data: {
            authorization_url: 'https://checkout.paystack.com/abc',
            access_code: 'abc123',
            reference: 'CHARICALL-REF-001',
          },
        }),
    } as Response);

    const result = await service.initializePaystackPayment({
      email: 'donor@example.com',
      amount: 2500,
      currency: 'NGN',
      causeId: 'cause-1',
    });

    expect(result.provider).toBe('paystack');
    expect(result.authorizationUrl).toBe('https://checkout.paystack.com/abc');
    expect(result.reference).toBe('CHARICALL-REF-001');
    expect(result.amount).toBe(2500);
  });

  it('throws when paystack initialize request fails', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      json: () =>
        Promise.resolve({
          status: false,
          message: 'Invalid key',
          data: {},
        }),
    } as Response);

    await expect(
      service.initializePaystackPayment({
        email: 'donor@example.com',
        amount: 100,
      }),
    ).rejects.toBeInstanceOf(BadGatewayException);
  });

  it('verifies a paystack payment', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          status: true,
          message: 'Verification successful',
          data: {
            reference: 'CHARICALL-REF-002',
            amount: 500000,
            currency: 'NGN',
            status: 'success',
            paid_at: '2026-03-24T00:00:00.000Z',
            metadata: { causeId: 'cause-1' },
          },
        }),
    } as Response);

    const result = await service.verifyPaystackPayment('CHARICALL-REF-002');

    expect(result.provider).toBe('paystack');
    expect(result.amount).toBe(5000);
    expect(result.status).toBe('success');
  });
});
