import { Injectable } from '@nestjs/common';

export interface PizzaPrice {
  small: number;
  medium: number;
  large: number;
}

export interface PizzaMenu {
  [key: string]: PizzaPrice;
}

@Injectable()
export class PizzaPricingService {
  private readonly pizzaPrices: PizzaMenu = {
    'Margherita': {
      small: 2500,
      medium: 3500,
      large: 4500,
    },
    'Pepperoni': {
      small: 3000,
      medium: 4000,
      large: 5500,
    },
    'Hawaiian': {
      small: 2800,
      medium: 3800,
      large: 5000,
    },
    'Vegetarian': {
      small: 2600,
      medium: 3600,
      large: 4800,
    },
    'BBQ Chicken': {
      small: 3200,
      medium: 4200,
      large: 5800,
    },
  };

  calculateOrderTotal(pizzaType: string, size: string, quantity: number) {
    const unitPrice = this.pizzaPrices[pizzaType][size.toLowerCase()];
    const totalPrice = unitPrice * quantity;

    return {
      unitPrice,
      totalPrice,
      formattedTotal: `₦${totalPrice.toLocaleString()}`,
    };
  }

  getPizzaTypes(): string[] {
    return Object.keys(this.pizzaPrices);
  }

  getPizzaSizes(): string[] {
    return ['Small', 'Medium', 'Large'];
  }

  getPriceForPizza(pizzaType: string, size: string): number {
    return this.pizzaPrices[pizzaType][size.toLowerCase()];
  }
}