import { z } from 'zod';

export const signUpSchema = z.object({
  email: z.string().email('Érvénytelen email cím'),
  password: z.string()
    .min(8, 'A jelszónak legalább 8 karakter hosszúnak kell lennie')
    .regex(/[A-Z]/, 'A jelszónak tartalmaznia kell legalább egy nagybetűt')
    .regex(/[a-z]/, 'A jelszónak tartalmaznia kell legalább egy kisbetűt')
    .regex(/[0-9]/, 'A jelszónak tartalmaznia kell legalább egy számot'),
});

export const signInSchema = z.object({
  email: z.string().email('Érvénytelen email cím'),
  password: z.string().min(1, 'A jelszó megadása kötelező'),
});

export const productSchema = z.object({
  sku: z.string().min(1, 'SKU is required'),
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  imageUrl: z.string().nullable().optional(),
  images: z.string().nullable().optional(),
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

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'A jelenlegi jelszó megadása kötelező'),
  newPassword: z.string()
    .min(8, 'A jelszónak legalább 8 karakter hosszúnak kell lennie')
    .regex(/[A-Z]/, 'A jelszónak tartalmaznia kell legalább egy nagybetűt')
    .regex(/[a-z]/, 'A jelszónak tartalmaznia kell legalább egy kisbetűt')
    .regex(/[0-9]/, 'A jelszónak tartalmaznia kell legalább egy számot'),
  confirmPassword: z.string().min(1, 'A jelszó megerősítése kötelező'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'A jelszavak nem egyeznek',
  path: ['confirmPassword'],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: 'Az új jelszó nem egyezhet a jelenlegivel',
  path: ['newPassword'],
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type CartItemInput = z.infer<typeof cartItemSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
