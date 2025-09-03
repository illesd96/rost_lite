'use client';

import { CartProvider as UseCartProvider } from 'react-use-cart';
import { ReactNode } from 'react';

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  return (
    <UseCartProvider id="webshop-cart">
      {children}
    </UseCartProvider>
  );
}
