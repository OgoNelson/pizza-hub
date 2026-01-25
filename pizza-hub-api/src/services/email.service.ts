import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {}

  async sendOrderConfirmation(orderData: any) {
    const transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: 587,
      secure: false,
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });

    const mailOptions = {
      from: this.configService.get<string>('EMAIL_USER'),
      to: orderData.email,
      subject: `Your Pizza Order Confirmation – ${orderData.paymentReference}`,
      html: this.generateOrderConfirmationEmail(orderData),
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('Order confirmation email sent successfully');
    } catch (error) {
      console.error('Error sending order confirmation email:', error);
      throw new Error('Failed to send order confirmation email');
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