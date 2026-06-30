import {
  cartItemSchema,
  insertCartSchema,
  insertOrderItemSchema,
  insertOrderSchema,
  shippingAddressSchema,
} from "@/lib/validators";
import { z } from "zod";

export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type OrderItem = z.infer<typeof insertOrderItemSchema>;
export type Order = z.infer<typeof insertOrderSchema> & {
  // these are not added through form thats why here given
  id: string;
  createdAt: Date;
  isPaid: boolean;
  paidAt: Date | null;
  isShipped: boolean;
  shippedAt: Date | null;
  isDelivered: boolean;
  deliveredAt: Date | null;
  trackingNumber: string | null;
  carrier: string | null;
  orderitems: OrderItem[];
  user: { name: string; email: string; id: string };
  paymentResult?: any;
};
