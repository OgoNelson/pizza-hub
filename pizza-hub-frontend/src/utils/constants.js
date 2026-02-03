export const PIZZA_TYPES = [
  'Margherita',
  'Pepperoni',
  'Hawaiian',
  'Vegetarian',
  'BBQ Chicken',
];

export const PIZZA_SIZES = ['Small', 'Medium', 'Large'];

export const PIZZA_PRICES = {
  Margherita: {
    small: 2500,
    medium: 3500,
    large: 4500,
  },
  Pepperoni: {
    small: 3000,
    medium: 4000,
    large: 5500,
  },
  Hawaiian: {
    small: 2800,
    medium: 3800,
    large: 5000,
  },
  Vegetarian: {
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

export const formatCurrency = (amount) => {
  return `₦${amount.toLocaleString()}`;
};
