export const SIZES = ["Small", "Medium", "Large"];

export const QUANTITIES = [1,2,3,4,5,6,7,8,9,10];

export const PIZZAS = [
  {
    id: "p1",
    name: "Pepperoni Feast",
    prices: { Small: 6.99, Medium: 8.99, Large: 10.99 },
  },
  {
    id: "p2",
    name: "Veggie Delight",
    prices: { Small: 6.49, Medium: 8.49, Large: 10.49 },
  },
  {
    id: "p3",
    name: "BBQ Chicken",
    prices: { Small: 7.49, Medium: 9.49, Large: 11.49 },
  },
  {
    id: "p4",
    name: "Margherita",
    prices: { Small: 5.99, Medium: 7.99, Large: 9.99 },
  },
  {
    id: "p5",
    name: "Hawaiian",
    prices: { Small: 6.5, Medium: 8.5, Large: 10.5 },
  },
];

export const DEFAULT_ORDERS = [
  {
    id: 1,
    name: "Pepperoni Feast",
    size: "Large",
    qty: 1,
    total: 9.99,
    date: "2025-08-20",
  },
  {
    id: 2,
    name: "Veggie Delight",
    size: "Medium",
    qty: 2,
    total: 11.48,
    date: "2025-08-14",
  },
  {
    id: 3,
    name: "BBQ Chicken",
    size: "Small",
    qty: 1,
    total: 7.49,
    date: "2025-07-30",
  },
  {
    id: 4,
    name: "Margherita",
    size: "Large",
    qty: 3,
    total: 31.5,
    date: "2025-06-18",
  },
  {
    id: 5,
    name: "Hawaiian",
    size: "Medium",
    qty: 1,
    total: 10.4,
    date: "2025-05-05",
  },
];