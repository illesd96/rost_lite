import { z } from 'zod';

export const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const productSchema = z.object({
  sku: z.string().min(1, 'SKU is required'),
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  images: z.string().optional(),
  basePriceHuf: z.number().min(1, 'Price must be greater than 0'),
  onSale: z.boolean().default(false),
  salePriceHuf: z.number().nullable().optional(),
  discountThreshold: z.number().min(1).default(1),
  discountPercentage: z.number().min(0).max(100).default(0),
});

export const cartItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
});

export const checkoutSchema = z.object({
  items: z.array(cartItemSchema).min(1, 'Cart cannot be empty'),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type CartItemInput = z.infer<typeof cartItemSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
