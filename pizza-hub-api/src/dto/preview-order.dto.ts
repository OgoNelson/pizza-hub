import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class PreviewOrderDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsEnum(['Margherita', 'Pepperoni', 'Hawaiian', 'Vegetarian', 'BBQ Chicken'])
  pizzaType: string;

  @IsNotEmpty()
  @IsEnum(['Small', 'Medium', 'Large'])
  pizzaSize: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNotEmpty()
  @IsString()
  deliveryAddress: string;
}