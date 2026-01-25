import { Controller, Post, Get, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { PreviewOrderDto } from '../dto/preview-order.dto';
import { CreateOrderDto } from '../dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('preview')
  async previewOrder(@Body() previewOrderDto: PreviewOrderDto) {
    return this.orderService.previewOrder(previewOrderDto);
  }

  @Post('create')
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto);
  }

  @Get(':reference')
  async findByReference(@Param('reference') reference: string) {
    return this.orderService.findByReference(reference);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.orderService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/deliver')
  async updateDeliveryStatus(@Param('id') id: string) {
    return this.orderService.updateDeliveryStatus(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteOrder(@Param('id') id: string) {
    return this.orderService.deleteOrder(id);
  }
}
