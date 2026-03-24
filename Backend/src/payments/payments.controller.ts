import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { InitializePaystackPaymentDto } from './dto/initialize-paystack-payment.dto';
import { PaymentsService } from './payments.service';

@Controller('payments/paystack')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('initialize')
  initialize(@Body() dto: InitializePaystackPaymentDto) {
    return this.paymentsService.initializePaystackPayment(dto);
  }

  @Get('verify/:reference')
  verify(@Param('reference') reference: string) {
    return this.paymentsService.verifyPaystackPayment(reference);
  }
}
