import { Controller, Post, Get, Body, HttpStatus, HttpCode, Param } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { PreviewOrderDto } from '../dto/preview-order.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('init')
  async initializePayment(@Body() orderData: PreviewOrderDto) {
    try {
      const result = await this.paymentService.initializePayment(orderData);
      return {
        statusCode: HttpStatus.OK,
        message: 'Payment initialized successfully',
        data: result,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Payment initialization failed',
        error: error.message,
      };
    }
  }

  @Get('verify/:reference')
  async verifyPayment(@Param('reference') reference: string) {
    try {
      const result = await this.paymentService.verifyPayment(reference);
      return {
        statusCode: HttpStatus.OK,
        message: 'Payment verification completed',
        data: result,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Payment verification failed',
        error: error.message,
      };
    }
  }

  @Post('create-order')
  async createOrderAfterPayment(@Body() orderData: CreateOrderDto) {
    try {
      const order = await this.paymentService.createOrderAfterPayment(orderData);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Order created successfully',
        data: order,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Order creation failed',
        error: error.message,
      };
    }
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(@Body() webhookData: any) {
    try {
      // Verify webhook signature (implement this for security)
      const reference = webhookData.data.reference;
      const status = webhookData.event; // 'charge.success' or 'charge.failed'
      
      if (status === 'charge.success') {
        // Create order after successful payment
        // You would typically retrieve order data from your session/cache
        // For now, we'll assume order data is passed or stored temporarily
        console.log(`Payment successful for reference: ${reference}`);
      }
      
      return { received: true };
    } catch (error) {
      console.error('Webhook processing failed:', error);
      return { received: false };
    }
  }
}
