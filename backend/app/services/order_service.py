from typing import List, Optional, Dict
from datetime import datetime
import secrets
import string

from app.models.order import Order, OrderItem, OrderStatus, PaymentStatus
from app.models.product import Product
from app.models.user import User
from app.schemas.order import (
    OrderCreate, 
    OrderUpdate, 
    OrderResponse,
    OrderListResponse,
    OrderItemResponse,
    CartItem,
    CartResponse
)

class OrderService:
    
    @staticmethod
    async def create_order(order_data: OrderCreate, customer_id: str) -> Order:
        """Create a new order"""
        
        # Get customer info
        customer = await User.get(customer_id)
        if not customer:
            raise ValueError("Customer not found")
        
        # Validate and process items
        order_items = []
        subtotal = 0.0
        
        for item_data in order_data.items:
            product = await Product.get(item_data.product_id)
            if not product:
                raise ValueError(f"Product {item_data.product_id} not found")
            
            if not product.is_in_stock or product.total_stock < item_data.quantity:
                raise ValueError(f"Product {product.name} is out of stock")
            
            # Calculate price (could include variant pricing)
            unit_price = product.get_price_for_variant(item_data.color, item_data.size)
            total_price = unit_price * item_data.quantity
            
            order_item = OrderItem(
                product_id=str(product.id),
                product_name=product.name,
                product_image=product.main_image,
                boutique_id=product.boutique_id,
                boutique_name=product.boutique_name,
                color=item_data.color,
                size=item_data.size,
                sku=item_data.sku,
                unit_price=unit_price,
                quantity=item_data.quantity,
                total_price=total_price
            )
            
            order_items.append(order_item)
            subtotal += total_price
        
        # Calculate fees
        shipping_cost = OrderService._calculate_shipping_cost(order_data, subtotal)
        tax = OrderService._calculate_tax(subtotal)
        discount = 0.0  # TODO: Apply discounts/coupons
        total_amount = subtotal + shipping_cost + tax - discount
        
        # Generate order number
        order_number = OrderService._generate_order_number()
        
        # Create order
        order = Order(
            order_number=order_number,
            customer_id=customer_id,
            customer_email=customer.email,
            customer_phone=customer.phone or order_data.shipping_address.phone,
            items=order_items,
            subtotal=subtotal,
            shipping_cost=shipping_cost,
            tax=tax,
            discount=discount,
            total_amount=total_amount,
            shipping_address=order_data.shipping_address,
            delivery_method=order_data.delivery_method,
            delivery_notes=order_data.delivery_notes,
            payment_info=order_data.payment_info,
            special_instructions=order_data.special_instructions,
            gift_message=order_data.gift_message
        )
        
        await order.save()
        
        # Update product stock
        for item_data, order_item in zip(order_data.items, order_items):
            product = await Product.get(item_data.product_id)
            product.total_stock -= item_data.quantity
            product.sales_count += item_data.quantity
            await product.save()
        
        return order
    
    @staticmethod
    async def get_order_by_id(order_id: str, customer_id: Optional[str] = None) -> Optional[Order]:
        """Get order by ID with optional customer verification"""
        
        order = await Order.get(order_id)
        if not order:
            return None
        
        # Verify customer ownership if customer_id provided
        if customer_id and order.customer_id != customer_id:
            return None
        
        return order
    
    @staticmethod
    async def get_customer_orders(
        customer_id: str,
        page: int = 1,
        size: int = 20,
        status: Optional[OrderStatus] = None
    ) -> OrderListResponse:
        """Get customer's orders with pagination"""
        
        query_conditions = [Order.customer_id == customer_id]
        
        if status:
            query_conditions.append(Order.status == status)
        
        skip = (page - 1) * size
        
        orders = await Order.find(*query_conditions).sort([("created_at", -1)]).skip(skip).limit(size).to_list()
        total = await Order.find(*query_conditions).count()
        
        total_pages = (total + size - 1) // size
        
        order_responses = [OrderService._order_to_response(order) for order in orders]
        
        return OrderListResponse(
            orders=order_responses,
            total=total,
            page=page,
            size=size,
            total_pages=total_pages
        )
    
    @staticmethod
    async def update_order_status(
        order_id: str, 
        new_status: OrderStatus, 
        notes: Optional[str] = None,
        updated_by: Optional[str] = None
    ) -> Optional[Order]:
        """Update order status"""
        
        order = await Order.get(order_id)
        if not order:
            return None
        
        order.add_status_update(new_status, notes, updated_by)
        await order.save()
        
        return order
    
    @staticmethod
    async def cancel_order(order_id: str, customer_id: str, reason: Optional[str] = None) -> bool:
        """Cancel order (customer or admin)"""
        
        order = await Order.get(order_id)
        if not order:
            return False
        
        # Verify customer ownership
        if order.customer_id != customer_id:
            return False
        
        # Check if order can be cancelled
        if not order.can_be_cancelled:
            raise ValueError("Order cannot be cancelled at this stage")
        
        # Update status
        order.add_status_update(OrderStatus.CANCELLED, reason, customer_id)
        await order.save()
        
        # Restore product stock
        for item in order.items:
            product = await Product.get(item.product_id)
            if product:
                product.total_stock += item.quantity
                product.sales_count -= item.quantity
                await product.save()
        
        return True
    
    @staticmethod
    async def calculate_cart_total(cart_items: List[CartItem]) -> CartResponse:
        """Calculate cart totals without creating order"""
        
        items = []
        subtotal = 0.0
        total_items = 0
        
        for cart_item in cart_items:
            product = await Product.get(cart_item.product_id)
            if not product:
                continue
            
            unit_price = product.get_price_for_variant(cart_item.color, cart_item.size)
            total_price = unit_price * cart_item.quantity
            
            item_info = {
                "product_id": str(product.id),
                "product_name": product.name,
                "product_image": product.main_image,
                "boutique_name": product.boutique_name,
                "color": cart_item.color,
                "size": cart_item.size,
                "unit_price": unit_price,
                "quantity": cart_item.quantity,
                "total_price": total_price,
                "is_in_stock": product.is_in_stock,
                "available_stock": product.total_stock
            }
            
            items.append(item_info)
            subtotal += total_price
            total_items += cart_item.quantity
        
        shipping_cost = OrderService._calculate_shipping_cost_simple(subtotal)
        tax = OrderService._calculate_tax(subtotal)
        total_amount = subtotal + shipping_cost + tax
        
        return CartResponse(
            items=items,
            total_items=total_items,
            subtotal=subtotal,
            shipping_cost=shipping_cost,
            tax=tax,
            total_amount=total_amount
        )
    
    @staticmethod
    def _generate_order_number() -> str:
        """Generate unique order number"""
        timestamp = datetime.now().strftime("%Y%m%d")
        random_part = ''.join(secrets.choice(string.digits) for _ in range(6))
        return f"MD{timestamp}{random_part}"
    
    @staticmethod
    def _calculate_shipping_cost(order_data: OrderCreate, subtotal: float) -> float:
        """Calculate shipping cost based on order details"""
        
        # Free shipping threshold
        if subtotal >= 5000:  # 5000 DZD
            return 0.0
        
        # Base shipping cost
        base_cost = 500.0  # 500 DZD
        
        # Delivery method adjustments
        if order_data.delivery_method == "express":
            base_cost *= 1.5
        elif order_data.delivery_method == "pickup_point":
            base_cost *= 0.8
        
        return base_cost
    
    @staticmethod
    def _calculate_shipping_cost_simple(subtotal: float) -> float:
        """Simple shipping cost calculation"""
        return 0.0 if subtotal >= 5000 else 500.0
    
    @staticmethod
    def _calculate_tax(subtotal: float) -> float:
        """Calculate tax (VAT) - Algeria: 19%"""
        return subtotal * 0.19
    
    @staticmethod
    def _order_to_response(order: Order) -> OrderResponse:
        """Convert Order model to OrderResponse"""
        
        item_responses = [
            OrderItemResponse(
                product_id=item.product_id,
                product_name=item.product_name,
                product_image=item.product_image,
                boutique_id=item.boutique_id,
                boutique_name=item.boutique_name,
                color=item.color,
                size=item.size,
                sku=item.sku,
                unit_price=item.unit_price,
                quantity=item.quantity,
                total_price=item.total_price,
                status=item.status
            )
            for item in order.items
        ]
        
        return OrderResponse(
            id=str(order.id),
            order_number=order.order_number,
            customer_id=order.customer_id,
            customer_email=order.customer_email,
            items=item_responses,
            subtotal=order.subtotal,
            shipping_cost=order.shipping_cost,
            tax=order.tax,
            discount=order.discount,
            total_amount=order.total_amount,
            shipping_address=order.shipping_address.dict(),
            delivery_method=order.delivery_method,
            payment_info=order.payment_info.dict(),
            status=order.status,
            tracking_info=order.tracking_info.dict() if order.tracking_info else None,
            created_at=order.created_at,
            updated_at=order.updated_at
        )


class PaymentService:
    """Handle payment processing"""
    
    @staticmethod
    async def process_payment(order: Order) -> bool:
        """Process payment for order"""
        
        payment_method = order.payment_info.method
        
        if payment_method == "cash_on_delivery":
            # COD doesn't require immediate payment processing
            order.payment_info.status = PaymentStatus.PENDING
            return True
        
        elif payment_method == "cib":
            # TODO: Integrate with CIB payment gateway
            return await PaymentService._process_cib_payment(order)
        
        elif payment_method == "edahabia":
            # TODO: Integrate with EDAHABIA payment gateway
            return await PaymentService._process_edahabia_payment(order)
        
        else:
            raise ValueError(f"Unsupported payment method: {payment_method}")
    
    @staticmethod
    async def _process_cib_payment(order: Order) -> bool:
        """Process CIB payment (placeholder)"""
        # TODO: Implement actual CIB integration
        order.payment_info.status = PaymentStatus.COMPLETED
        order.payment_info.transaction_id = f"CIB_{secrets.token_hex(8)}"
        order.payment_info.payment_date = datetime.utcnow()
        return True
    
    @staticmethod
    async def _process_edahabia_payment(order: Order) -> bool:
        """Process EDAHABIA payment (placeholder)"""
        # TODO: Implement actual EDAHABIA integration
        order.payment_info.status = PaymentStatus.COMPLETED
        order.payment_info.transaction_id = f"EDH_{secrets.token_hex(8)}"
        order.payment_info.payment_date = datetime.utcnow()
        return True
