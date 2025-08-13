import { Injectable } from '@angular/core'
import { Observable, from } from 'rxjs'
import { CartService, CartItem } from './cart.service'
import { AuthService } from './auth.service'

export interface OrderItem {
  productId: number
  quantity: number
}

export interface OrderRequest {
  userId: string
  items: OrderItem[]
}

export interface Product {
  id: number
  name: string
  description: string
  price: number
  image_url: string | null
  category: {
    id: number
    name: string
  }
}

export interface OrderItemResponse {
  id: number
  product: Product
  quantity: number
}

export interface OrderResponse {
  id: number
  userId: string
  items: OrderItemResponse[]
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly baseUrl = 'http://product-management.local:8080'

  constructor(
    private cartService: CartService,
    private authService: AuthService
  ) {}

  createOrder(): Observable<OrderResponse> {
    const userInfo = this.authService.getUserInfo()
    if (!userInfo) {
      throw new Error('User not authenticated')
    }
    const cartItems = this.cartService.getCartItemsValue()

    const orderItems: OrderItem[] = cartItems.map(item => ({
      productId: item.product.id,
      quantity: item.quantity
    }))

    const orderRequest: OrderRequest = {
      userId: userInfo.sub,
      items: orderItems
    }

    return from(
      fetch(`${this.baseUrl}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderRequest)
      }).then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
      })
    )
  }

  getUserOrders(): Observable<OrderResponse[]> {
    const userInfo = this.authService.getUserInfo()
    if (!userInfo) {
      throw new Error('User not authenticated')
    }

    return from(
      fetch(`${this.baseUrl}/orders?userId=${userInfo.sub}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      }).then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
      })
    )
  }
} 