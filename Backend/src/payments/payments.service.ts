import {
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { InitializePaystackPaymentDto } from './dto/initialize-paystack-payment.dto';

type PaystackEnvelope<T> = {
  status: boolean;
  message: string;
  data: T;
};

type InitializePaystackData = {
  authorization_url: string;
  access_code: string;
  reference: string;
};

type VerifyPaystackData = {
  reference: string;
  amount: number;
  currency: string;
  status: string;
  paid_at: string | null;
  metadata?: Record<string, unknown>;
};

@Injectable()
export class PaymentsService {
  private readonly paystackBaseUrl = 'https://api.paystack.co';

  constructor(private readonly configService: ConfigService) {}

  async initializePaystackPayment(dto: InitializePaystackPaymentDto) {
    const secretKey = this.configService.get<string>('PAYSTACK_SECRET_KEY');
    if (!secretKey) {
      throw new InternalServerErrorException(
        'PAYSTACK_SECRET_KEY is not configured',
      );
    }

    const callbackUrl = this.configService.get<string>('PAYSTACK_CALLBACK_URL');
    const reference = this.buildReference();
    const currency = dto.currency ?? 'NGN';
    const metadata = {
      donationId: dto.donationId ?? null,
      causeId: dto.causeId ?? null,
      donorId: dto.donorId ?? null,
      message: dto.message ?? null,
    };

    const payload = {
      email: dto.email,
      amount: this.convertToKobo(dto.amount),
      currency,
      reference,
      metadata,
      ...(callbackUrl ? { callback_url: callbackUrl } : {}),
    };

    const response = await fetch(
      `${this.paystackBaseUrl}/transaction/initialize`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      },
    );

    const body =
      (await response.json()) as PaystackEnvelope<InitializePaystackData>;

    if (!response.ok || !body.status) {
      throw new BadGatewayException(
        `Paystack initialize failed: ${body.message ?? 'Unknown error'}`,
      );
    }

    return {
      provider: 'paystack',
      authorizationUrl: body.data.authorization_url,
      accessCode: body.data.access_code,
      reference: body.data.reference,
      amount: dto.amount,
      currency,
    };
  }

  async verifyPaystackPayment(reference: string) {
    const secretKey = this.configService.get<string>('PAYSTACK_SECRET_KEY');
    if (!secretKey) {
      throw new InternalServerErrorException(
        'PAYSTACK_SECRET_KEY is not configured',
      );
    }

    const response = await fetch(
      `${this.paystackBaseUrl}/transaction/verify/${reference}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      },
    );

    const body =
      (await response.json()) as PaystackEnvelope<VerifyPaystackData>;

    if (!response.ok || !body.status) {
      throw new BadGatewayException(
        `Paystack verify failed: ${body.message ?? 'Unknown error'}`,
      );
    }

    return {
      provider: 'paystack',
      reference: body.data.reference,
      amount: body.data.amount / 100,
      currency: body.data.currency,
      status: body.data.status,
      paidAt: body.data.paid_at,
      metadata: body.data.metadata ?? {},
    };
  }

  private convertToKobo(amount: number): number {
    return Math.round(amount * 100);
  }

  private buildReference(): string {
    return `CHARICALL-${Date.now()}-${randomUUID()}`;
  }
}
