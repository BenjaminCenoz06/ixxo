/** Datos de ejemplo para el panel admin en modo demo. */

export interface DemoOrder {
  number: string;
  customer: string;
  email: string;
  date: string;
  status: string;
  items: number;
  total: number;
}

export const demoOrders: DemoOrder[] = [
  { number: "IXXO-482913", customer: "Martín López", email: "martin@example.com", date: "2026-07-08", status: "paid", items: 2, total: 91800 },
  { number: "IXXO-482755", customer: "Federico Ruiz", email: "fede@example.com", date: "2026-07-08", status: "pending", items: 1, total: 58900 },
  { number: "IXXO-482612", customer: "Nicolás Díaz", email: "nico@example.com", date: "2026-07-07", status: "shipped", items: 3, total: 214700 },
  { number: "IXXO-482488", customer: "Tomás García", email: "tomas@example.com", date: "2026-07-07", status: "paid", items: 1, total: 74900 },
  { number: "IXXO-482301", customer: "Joaquín Pérez", email: "joaco@example.com", date: "2026-07-06", status: "delivered", items: 2, total: 132800 },
  { number: "IXXO-482190", customer: "Lucas Molina", email: "lucas@example.com", date: "2026-07-06", status: "cancelled", items: 1, total: 119900 },
  { number: "IXXO-482044", customer: "Ramiro Sosa", email: "rama@example.com", date: "2026-07-05", status: "paid", items: 4, total: 289600 },
];

export interface DemoCustomer {
  name: string;
  email: string;
  orders: number;
  spent: number;
  since: string;
}

export const demoCustomers: DemoCustomer[] = [
  { name: "Martín López", email: "martin@example.com", orders: 6, spent: 512400, since: "2025-11-02" },
  { name: "Federico Ruiz", email: "fede@example.com", orders: 3, spent: 187600, since: "2026-01-15" },
  { name: "Nicolás Díaz", email: "nico@example.com", orders: 4, spent: 298300, since: "2026-02-20" },
  { name: "Tomás García", email: "tomas@example.com", orders: 2, spent: 149800, since: "2026-03-11" },
  { name: "Joaquín Pérez", email: "joaco@example.com", orders: 5, spent: 402100, since: "2025-12-28" },
];

export const demoNewsletter = [
  { email: "martin@example.com", date: "2026-07-08" },
  { email: "sofia.b@example.com", date: "2026-07-07" },
  { email: "andres.m@example.com", date: "2026-07-06" },
  { email: "valentin@example.com", date: "2026-07-05" },
  { email: "gonzalo.p@example.com", date: "2026-07-04" },
  { email: "diego.r@example.com", date: "2026-07-03" },
];
