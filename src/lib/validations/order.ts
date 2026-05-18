import { z } from "zod";

export const paymentMethodSchema = z.enum(["CASH_ON_DELIVERY", "VODAFONE_CASH", "INSTAPAY"]);

export const orderStatusSchema = z.enum([
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED"
]);

export const createOrderSchema = z.object({
  customerName: z.string().trim().min(2, "Please enter your full name.").max(120),
  customerPhone: z.string().trim().min(8, "Please enter a valid phone number.").max(30),
  customerEmail: z.string().trim().email("Please enter a valid email.").optional().or(z.literal("")),
  city: z.string().trim().min(2, "Please enter your city.").max(80),
  address: z.string().trim().min(8, "Please enter your full address.").max(500),
  notes: z.string().trim().max(800).optional().or(z.literal("")),
  paymentMethod: paymentMethodSchema,
  items: z
    .array(
      z.object({
        productId: z.string().trim().min(1),
        productSlug: z.string().trim().min(1),
        productName: z.string().trim().min(1),
        productImage: z.string().trim().optional(),
        size: z.string().trim().min(1).max(20),
        quantity: z.coerce.number().int().min(1).max(20)
      })
    )
    .min(1, "Your cart is empty.")
});

export const updateOrderStatusSchema = z.object({
  status: orderStatusSchema
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
