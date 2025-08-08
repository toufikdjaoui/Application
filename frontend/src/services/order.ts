import api from './auth';

export interface CartItem {
  product_id: string;
  quantity: number;
  color?: string;
  size?: string;
}

export interface ShippingAddress {
  first_name: string;
  last_name: string;
  phone: string;
  email?: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  additional_info?: string;
}

export interface PaymentInfo {
  method: 'cash_on_delivery' | 'cib' | 'edahabia' | 'bank_transfer';
  transaction_id?: string;
}

export interface OrderCreate {
  items: CartItem[];
  shipping_address: ShippingAddress;
  delivery_method: 'home_delivery' | 'pickup_point' | 'boutique_pickup';
  delivery_notes?: string;
  payment_info: PaymentInfo;
  special_instructions?: string;
  gift_message?: string;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  product_image: string;
  boutique_id: string;
  boutique_name: string;
  color?: string;
  size?: string;
  sku?: string;
  unit_price: number;
  quantity: number;
  total_price: number;
  status: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  customer_email: string;
  items: OrderItem[];
  subtotal: number;
  shipping_cost: number;
  tax: number;
  discount: number;
  total_amount: number;
  shipping_address: ShippingAddress;
  delivery_method: string;
  payment_info: any;
  status: string;
  tracking_info?: any;
  created_at: string;
  updated_at: string;
}

export interface OrderListResponse {
  orders: Order[];
  total: number;
  page: number;
  size: number;
  total_pages: number;
}

export interface CartResponse {
  items: any[];
  total_items: number;
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total_amount: number;
}

export const orderService = {
  async getOrders(page = 1, size = 20, status?: string): Promise<OrderListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    if (status) params.set('status', status);

    const response = await api.get(`/orders?${params}`);
    return response.data;
  },

  async getOrder(orderId: string): Promise<Order> {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },

  async createOrder(orderData: OrderCreate): Promise<Order> {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  async calculateCartTotal(cartItems: CartItem[]): Promise<CartResponse> {
    const response = await api.post('/orders/cart/calculate', cartItems);
    return response.data;
  },

  async updateOrderStatus(orderId: string, status: string, notes?: string): Promise<Order> {
    const response = await api.put(`/orders/${orderId}/status`, {
      status,
      notes,
    });
    return response.data;
  },

  async cancelOrder(orderId: string): Promise<void> {
    await api.delete(`/orders/${orderId}`);
  },

  async trackOrder(orderId: string): Promise<any> {
    const response = await api.get(`/orders/${orderId}/track`);
    return response.data;
  },
};

// Cart management (local storage)
export const cartStorage = {
  getCart(): CartItem[] {
    const cartData = localStorage.getItem('mode_dz_cart');
    return cartData ? JSON.parse(cartData) : [];
  },

  setCart(items: CartItem[]): void {
    localStorage.setItem('mode_dz_cart', JSON.stringify(items));
  },

  addItem(item: CartItem): void {
    const cart = this.getCart();
    const existingItemIndex = cart.findIndex(
      (i) => 
        i.product_id === item.product_id && 
        i.color === item.color && 
        i.size === item.size
    );

    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity += item.quantity;
    } else {
      cart.push(item);
    }

    this.setCart(cart);
  },

  removeItem(productId: string, color?: string, size?: string): void {
    const cart = this.getCart();
    const filteredCart = cart.filter(
      (item) => 
        !(item.product_id === productId && 
          item.color === color && 
          item.size === size)
    );
    this.setCart(filteredCart);
  },

  updateQuantity(productId: string, quantity: number, color?: string, size?: string): void {
    const cart = this.getCart();
    const itemIndex = cart.findIndex(
      (item) => 
        item.product_id === productId && 
        item.color === color && 
        item.size === size
    );

    if (itemIndex >= 0) {
      if (quantity <= 0) {
        cart.splice(itemIndex, 1);
      } else {
        cart[itemIndex].quantity = quantity;
      }
      this.setCart(cart);
    }
  },

  clearCart(): void {
    localStorage.removeItem('mode_dz_cart');
  },

  getItemCount(): number {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
  },
};
