import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PaystackService } from '../services/paystack.service';
import { OrderModule } from '../order/order.module';
import { EmailService } from '../services/email.service';

@Module({
  imports: [OrderModule],
  controllers: [PaymentController],
  providers: [PaymentService, PaystackService, EmailService],
})
export class PaymentModule {}
