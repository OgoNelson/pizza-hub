import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../schemas/order.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async getAllOrders(): Promise<Order[]> {
    return this.orderModel.find().sort({ createdAt: -1 }).exec();
  }

  async getOrderById(id: string): Promise<Order | null> {
    return this.orderModel.findById(id).exec();
  }

  async updateDeliveryStatus(id: string): Promise<Order | null> {
    return this.orderModel.findByIdAndUpdate(
      id,
      { deliveryStatus: 'delivered' },
      { new: true }
    ).exec();
  }

  async deleteOrder(id: string): Promise<Order | null> {
    return this.orderModel.findByIdAndDelete(id).exec();
  }

  async getOrderStats(): Promise<any> {
    const totalOrders = await this.orderModel.countDocuments().exec();
    const deliveredOrders = await this.orderModel.countDocuments({ deliveryStatus: 'delivered' }).exec();
    const pendingOrders = totalOrders - deliveredOrders;
    
    // Get revenue from delivered orders
    const orders = await this.orderModel.find({ deliveryStatus: 'delivered' }).exec();
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    
    return {
      totalOrders,
      deliveredOrders,
      pendingOrders,
      totalRevenue,
      deliveryRate: totalOrders > 0 ? (deliveredOrders / totalOrders) * 100 : 0,
    };
  }
}
