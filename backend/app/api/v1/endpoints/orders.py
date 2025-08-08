from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import Optional
from app.models.user import User
from app.models.order import OrderStatus
from app.utils.dependencies import get_current_verified_user
from app.services.order_service import OrderService, PaymentService
from app.schemas.order import (
    OrderCreate,
    OrderResponse,
    OrderListResponse,
    OrderStatusUpdate,
    CartItem,
    CartResponse
)

router = APIRouter()

@router.get("/", response_model=OrderListResponse)
async def get_orders(
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(20, ge=1, le=100, description="Items per page"),
    status: Optional[OrderStatus] = Query(None, description="Filter by order status"),
    current_user: User = Depends(get_current_verified_user)
):
    """
    Obtenir les commandes de l'utilisateur
    
    Permet de filtrer par statut et de paginer les résultats
    """
    return await OrderService.get_customer_orders(
        customer_id=str(current_user.id),
        page=page,
        size=size,
        status=status
    )

@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: str,
    current_user: User = Depends(get_current_verified_user)
):
    """Obtenir les détails d'une commande spécifique"""
    
    order = await OrderService.get_order_by_id(order_id, str(current_user.id))
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Commande non trouvée"
        )
    
    return OrderService._order_to_response(order)

@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(
    order_data: OrderCreate,
    current_user: User = Depends(get_current_verified_user)
):
    """
    Créer une nouvelle commande
    
    Traite automatiquement le paiement selon la méthode choisie
    """
    try:
        # Create order
        order = await OrderService.create_order(order_data, str(current_user.id))
        
        # Process payment
        payment_success = await PaymentService.process_payment(order)
        
        if payment_success:
            # Update order status if payment succeeded
            if order.payment_info.method != "cash_on_delivery":
                await OrderService.update_order_status(
                    str(order.id),
                    OrderStatus.CONFIRMED,
                    "Payment processed successfully"
                )
        else:
            # If payment failed, cancel the order
            await OrderService.update_order_status(
                str(order.id),
                OrderStatus.CANCELLED,
                "Payment failed"
            )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Payment processing failed"
            )
        
        # Reload order to get updated status
        updated_order = await OrderService.get_order_by_id(str(order.id))
        return OrderService._order_to_response(updated_order)
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur lors de la création de la commande"
        )

@router.post("/cart/calculate", response_model=CartResponse)
async def calculate_cart_total(
    cart_items: list[CartItem],
    current_user: User = Depends(get_current_verified_user)
):
    """
    Calculer le total du panier sans créer de commande
    
    Utile pour afficher le récapitulatif avant confirmation
    """
    if not cart_items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Le panier est vide"
        )
    
    return await OrderService.calculate_cart_total(cart_items)

@router.put("/{order_id}/status", response_model=OrderResponse)
async def update_order_status(
    order_id: str,
    status_update: OrderStatusUpdate,
    current_user: User = Depends(get_current_verified_user)
):
    """
    Mettre à jour le statut d'une commande
    
    Seules certaines transitions sont autorisées pour les clients
    """
    order = await OrderService.get_order_by_id(order_id, str(current_user.id))
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Commande non trouvée"
        )
    
    # Check if the status change is allowed for customers
    allowed_customer_transitions = {
        OrderStatus.PENDING: [OrderStatus.CANCELLED],
        OrderStatus.CONFIRMED: [OrderStatus.CANCELLED],
    }
    
    if order.status not in allowed_customer_transitions or \
       status_update.status not in allowed_customer_transitions.get(order.status, []):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Changement de statut non autorisé"
        )
    
    updated_order = await OrderService.update_order_status(
        order_id,
        status_update.status,
        status_update.notes,
        str(current_user.id)
    )
    
    return OrderService._order_to_response(updated_order)

@router.delete("/{order_id}")
async def cancel_order(
    order_id: str,
    current_user: User = Depends(get_current_verified_user)
):
    """Annuler une commande"""
    
    try:
        success = await OrderService.cancel_order(
            order_id, 
            str(current_user.id),
            "Cancelled by customer"
        )
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Commande non trouvée"
            )
        
        return {"message": "Commande annulée avec succès"}
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.get("/{order_id}/track")
async def track_order(
    order_id: str,
    current_user: User = Depends(get_current_verified_user)
):
    """Suivre une commande"""
    
    order = await OrderService.get_order_by_id(order_id, str(current_user.id))
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Commande non trouvée"
        )
    
    return {
        "order_number": order.order_number,
        "status": order.status,
        "tracking_info": order.tracking_info.dict() if order.tracking_info else None,
        "status_history": [
            {
                "status": history.status,
                "timestamp": history.timestamp,
                "notes": history.notes
            }
            for history in order.status_history
        ]
    }
