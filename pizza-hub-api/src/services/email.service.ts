import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TransactionalEmailsApi } from '@getbrevo/brevo';

@Injectable()
export class EmailService {
  private brevoClient: TransactionalEmailsApi;

  constructor(private readonly configService: ConfigService) {
    this.brevoClient = new TransactionalEmailsApi();

    const apiKey = this.configService.get<string>('BREVO_API_KEY');
    if (!apiKey) {
      throw new Error('BREVO_API_KEY environment variable is not set');
    }

    // Set API Key properly
    this.brevoClient.setApiKey(0, apiKey);
  }

  async sendOrderConfirmation(orderData: any) {
    const senderEmail = this.configService.get<string>('BREVO_SENDER_EMAIL');
    if (!senderEmail) {
      throw new Error('BREVO_SENDER_EMAIL environment variable is not set');
    }

    try {
      const response = await this.brevoClient.sendTransacEmail({
        sender: {
          email: senderEmail,
          name: 'Pizza Hub',
        },
        to: [
          {
            email: orderData.email,
            name: orderData.fullName,
          },
        ],
        subject: `Your Pizza Order Confirmation – ${orderData.paymentReference}`,
        htmlContent: this.generateOrderConfirmationEmail(orderData),
      });

      console.log('Email sent successfully');
      return response;
    } catch (error) {
      console.error('Brevo email error:', error);
      return null;
    }
  }

  private generateOrderConfirmationEmail(orderData: any): string {
    return `
      <h2>Order Confirmation</h2>
      <p>Thank you ${orderData.fullName}!</p>
      <p>Reference: ${orderData.paymentReference}</p>
      <p>Total: ₦${orderData.totalPrice}</p>
    `;
  }
}
