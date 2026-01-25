import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true, enum: ['Margherita', 'Pepperoni', 'Hawaiian', 'Vegetarian', 'BBQ Chicken'] })
  pizzaType: string;

  @Prop({ required: true, enum: ['Small', 'Medium', 'Large'] })
  pizzaSize: string;

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop({ required: true })
  unitPrice: number;

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ required: true })
  deliveryAddress: string;

  @Prop({ required: true })
  amountPaid: number;

  @Prop({ required: true, unique: true })
  paymentReference: string;

  @Prop({ required: true, enum: ['success', 'failed', 'pending'], default: 'pending' })
  paymentStatus: string;

  @Prop({ required: true, enum: ['undelivered', 'delivered'], default: 'undelivered' })
  deliveryStatus: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);