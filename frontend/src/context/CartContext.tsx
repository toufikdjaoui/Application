import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { CartItem, cartStorage, orderService, CartResponse } from '../services/order';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  cartData: CartResponse | null;
  isLoading: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, color?: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, color?: string, size?: string) => void;
  clearCart: () => void;
  refreshCartData: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartData, setCartData] = useState<CartResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = cartStorage.getCart();
    setItems(savedCart);
    if (savedCart.length > 0) {
      refreshCartData();
    }
  }, []);

  const refreshCartData = async () => {
    if (items.length === 0) {
      setCartData(null);
      return;
    }

    setIsLoading(true);
    try {
      const data = await orderService.calculateCartTotal(items);
      setCartData(data);
    } catch (error) {
      console.error('Error calculating cart total:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh cart data when items change
  useEffect(() => {
    if (items.length > 0) {
      refreshCartData();
    } else {
      setCartData(null);
    }
  }, [items]);

  const addItem = (item: CartItem) => {
    cartStorage.addItem(item);
    const updatedCart = cartStorage.getCart();
    setItems(updatedCart);
  };

  const removeItem = (productId: string, color?: string, size?: string) => {
    cartStorage.removeItem(productId, color, size);
    const updatedCart = cartStorage.getCart();
    setItems(updatedCart);
  };

  const updateQuantity = (productId: string, quantity: number, color?: string, size?: string) => {
    cartStorage.updateQuantity(productId, quantity, color, size);
    const updatedCart = cartStorage.getCart();
    setItems(updatedCart);
  };

  const clearCart = () => {
    cartStorage.clearCart();
    setItems([]);
    setCartData(null);
  };

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  const value: CartContextType = {
    items,
    itemCount,
    cartData,
    isLoading,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    refreshCartData,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
