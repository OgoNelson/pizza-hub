import { Controller, Get, Param, Patch, Delete, HttpStatus, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('orders')
  async getAllOrders() {
    try {
      const orders = await this.adminService.getAllOrders();
      return {
        statusCode: HttpStatus.OK,
        message: 'Orders retrieved successfully',
        data: orders,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to retrieve orders',
        error: error.message,
      };
    }
  }

  @Get('orders/:id')
  async getOrderById(@Param('id') id: string) {
    try {
      const order = await this.adminService.getOrderById(id);
      return {
        statusCode: HttpStatus.OK,
        message: 'Order retrieved successfully',
        data: order,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to retrieve order',
        error: error.message,
      };
    }
  }

  @Patch('orders/:id/deliver')
  async updateDeliveryStatus(@Param('id') id: string) {
    try {
      const order = await this.adminService.updateDeliveryStatus(id);
      return {
        statusCode: HttpStatus.OK,
        message: 'Order delivery status updated successfully',
        data: order,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to update delivery status',
        error: error.message,
      };
    }
  }

  @Delete('orders/:id')
  async deleteOrder(@Param('id') id: string) {
    try {
      const order = await this.adminService.deleteOrder(id);
      return {
        statusCode: HttpStatus.OK,
        message: 'Order deleted successfully',
        data: order,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to delete order',
        error: error.message,
      };
    }
  }

  @Get('stats')
  async getOrderStats() {
    try {
      const stats = await this.adminService.getOrderStats();
      return {
        statusCode: HttpStatus.OK,
        message: 'Order statistics retrieved successfully',
        data: stats,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to retrieve order statistics',
        error: error.message,
      };
    }
  }
}
