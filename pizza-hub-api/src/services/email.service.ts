import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {}

  async sendOrderConfirmation(orderData: any) {

    const emailPort = parseInt(this.configService.get<string>('EMAIL_PORT') || '465');
    const useSecure = emailPort === 465;

    const transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: emailPort,
      secure: useSecure, // true for 465, false for 587
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
      tls: {
        // Do not fail on invalid certs
        rejectUnauthorized: false,
      },
      // Add connection settings
      pool: true,
      maxConnections: 1,
      maxMessages: 5,
      // Increase timeout
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    const mailOptions = {
      from: `"Pizza Hub" <${this.configService.get<string>('EMAIL_USER')}>`,
      to: orderData.email,
      subject: `Your Pizza Order Confirmation – ${orderData.paymentReference}`,
      html: this.generateOrderConfirmationEmail(orderData),
    };

    try {
      // Try to send email directly
      const info = await transporter.sendMail(mailOptions);
      return info;
    } catch (error) {
      console.error('Error sending order confirmation email:', error.message);
      console.error('Full error details:', {
        code: error.code,
        command: error.command,
        response: error.response,
      });

      // Don't throw - just log the error so order creation continues
      console.warn('Email failed but order was created successfully');
      return null;
    }
  }

  private generateOrderConfirmationEmail(orderData: any): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Pizza Order Confirmation</h2>
        <p>Thank you for your order! Here are your order details:</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Order Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Order Reference:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${orderData.paymentReference}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Name:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${orderData.fullName}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Email:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${orderData.email}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Phone:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${orderData.phone}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Pizza Type:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${orderData.pizzaType}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Size:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${orderData.pizzaSize}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Quantity:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${orderData.quantity}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Unit Price:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">₦${orderData.unitPrice.toLocaleString()}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Total Price:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>₦${orderData.totalPrice.toLocaleString()}</strong></td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Delivery Address:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${orderData.deliveryAddress}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Payment Status:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd; color: #28a745;"><strong>${orderData.paymentStatus.toUpperCase()}</strong></td>
            </tr>
          </table>
        </div>
        
        <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; color: white;">
          <h3 style="color: white; margin-top: 0;">Next Steps</h3>
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