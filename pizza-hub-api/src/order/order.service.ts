import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../schemas/order.schema';
import { CreateOrderDto } from '../dto/create-order.dto';
import { PreviewOrderDto } from '../dto/preview-order.dto';
import { PizzaPricingService } from '../services/pizza-pricing.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private readonly pizzaPricingService: PizzaPricingService,
  ) {}

  async previewOrder(previewOrderDto: PreviewOrderDto) {
    const { pizzaType, pizzaSize, quantity } = previewOrderDto;
    const pricing = this.pizzaPricingService.calculateOrderTotal(pizzaType, pizzaSize, quantity);
    
    return {
      ...previewOrderDto,
      ...pricing,
    };
  }

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const { pizzaType, pizzaSize, quantity } = createOrderDto;
    const pricing = this.pizzaPricingService.calculateOrderTotal(pizzaType, pizzaSize, quantity);
    
    const order = new this.orderModel({
      ...createOrderDto,
      ...pricing,
      paymentStatus: 'success',
    });

    return order.save();
  }

  async findByReference(reference: string): Promise<Order | null> {
    return this.orderModel.findOne({ paymentReference: reference }).exec();
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.find().sort({ createdAt: -1 }).exec();
  }

  async updateDeliveryStatus(orderId: string): Promise<Order | null> {
    return this.orderModel.findByIdAndUpdate(
      orderId,
      { deliveryStatus: 'delivered' },
      { new: true },
    ).exec();
  }

  async deleteOrder(orderId: string): Promise<Order | null> {
    return this.orderModel.findByIdAndDelete(orderId).exec();
  }
}
