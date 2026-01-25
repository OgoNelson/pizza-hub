import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PaystackService {
  private readonly baseUrl = 'https://api.paystack.co';

  private get headers() {
    return {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    };
  }

  async initializeTransaction(
    email: string,
    amount: number,
    reference: string,
  ) {
    const response = await axios.post(
      `${this.baseUrl}/transaction/initialize`,
      {
        email,
        amount: amount * 100, // kobo
        reference,
        callback_url: `${process.env.FRONTEND_URL}/payment/verify`,
      },
      { headers: this.headers },
    );

    return response.data;
  }

  async verifyTransaction(reference: string) {
    const response = await axios.get(
      `${this.baseUrl}/transaction/verify/${reference}`,
      { headers: this.headers },
    );

    return response.data;
  }
}