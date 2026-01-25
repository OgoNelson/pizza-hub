import { PreviewOrderDto } from './preview-order.dto';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOrderDto extends PreviewOrderDto {
  @IsNotEmpty()
  @IsString()
  paymentReference: string;

  @IsNotEmpty()
  @IsNumber()
  amountPaid: number;
}