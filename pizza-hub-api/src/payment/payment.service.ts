import { Injectable } from '@nestjs/common';
import { PaystackService } from '../services/paystack.service';
import { OrderService } from '../order/order.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { PreviewOrderDto } from '../dto/preview-order.dto';
import { EmailService } from '../services/email.service';

@Injectable()
export class PaymentService {
  constructor(
    private readonly paystackService: PaystackService,
    private readonly orderService: OrderService,
    private readonly emailService: EmailService,
  ) {}

  async initializePayment(orderData: PreviewOrderDto) {
    const pricing = await this.orderService.previewOrder(orderData);
    const reference = this.generateReference();

    const payment = await this.paystackService.initializeTransaction(
      orderData.email,
      pricing.totalPrice,
      reference,
    );

    return {
      ...payment,
      orderData: {
        ...orderData,
        ...pricing,
        paymentReference: reference,
      },
    };
  }

  async verifyPayment(reference: string) {
    const verification = await this.paystackService.verifyTransaction(reference);
    
    if (verification.data.status === 'success') {
      // Here you would typically retrieve order data from session/cache
      // For now, we'll assume order data is passed or stored temporarily
      return {
        status: 'success',
        data: verification.data,
      };
    }

    return {
      status: 'failed',
      data: verification.data,
    };
  }

  async createOrderAfterPayment(orderData: CreateOrderDto) {
    try {
      const order = await this.orderService.createOrder(orderData);

      // Send order confirmation email with the complete order object
      try {
        await this.emailService.sendOrderConfirmation(order);
      } catch (emailError) {
        console.error('Failed to send order confirmation email:', emailError.message);
        // Continue anyway - order is created successfully
      }

      return order;
    } catch (error) {
      throw new Error(`Failed to create order: ${error.message}`);
    }
  }

  private generateReference(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `PIZZA_${timestamp}_${random}`;
  }
}
