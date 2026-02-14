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
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px;">
      
      <h2 style="color: #333;">Pizza Order Confirmation</h2>
      <p>Thank you for your order ${orderData.fullName}, Here are your order details:</p>

      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #333;">Order Details</h3>

        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0;"><strong>Order Reference:</strong></td>
            <td style="padding: 8px 0;">${orderData.paymentReference}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Name:</strong></td>
            <td style="padding: 8px 0;">${orderData.fullName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Email:</strong></td>
            <td style="padding: 8px 0;">${orderData.email}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Phone:</strong></td>
            <td style="padding: 8px 0;">${orderData.phone}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Pizza Type:</strong></td>
            <td style="padding: 8px 0;">${orderData.pizzaType}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Size:</strong></td>
            <td style="padding: 8px 0;">${orderData.pizzaSize}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Quantity:</strong></td>
            <td style="padding: 8px 0;">${orderData.quantity}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Unit Price:</strong></td>
            <td style="padding: 8px 0;">₦${orderData.unitPrice.toLocaleString()}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Total Price:</strong></td>
            <td style="padding: 8px 0;"><strong>₦${orderData.totalPrice.toLocaleString()}</strong></td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Delivery Address:</strong></td>
            <td style="padding: 8px 0;">${orderData.deliveryAddress}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Payment Status:</strong></td>
            <td style="padding: 8px 0; color: #28a745;">
              <strong>${orderData.paymentStatus.toUpperCase()}</strong>
            </td>
          </tr>
        </table>
      </div>

      <div style="background-color: #28a745; padding: 20px; border-radius: 8px; margin: 20px 0; color: white;">
        <h3 style="margin-top: 0; color: white;">Next Steps</h3>
        <p>Your order is being processed and will be delivered to:</p>
        <p><strong>${orderData.deliveryAddress}</strong></p>
        <p>You will receive another notification when your order is out for delivery.</p>
      </div>

      <div style="text-align: center; margin-top: 30px; color: #666;">
        <p style="font-size: 12px;">Thank you for choosing Pizza Hub! 🍕</p>
      </div>

    </div>
  `;
  }
}
