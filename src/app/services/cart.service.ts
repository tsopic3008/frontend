import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { Product } from './product.service'

export interface CartItem {
  product: Product
  quantity: number
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([])
  private cartTotal = new BehaviorSubject<number>(0)
  private cartItemCount = new BehaviorSubject<number>(0)

  constructor() {
    this.loadCartFromStorage()
  }

  getCartItems(): Observable<CartItem[]> {
    return this.cartItems.asObservable()
  }

  getCartTotal(): Observable<number> {
    return this.cartTotal.asObservable()
  }

  getCartItemCount(): Observable<number> {
    return this.cartItemCount.asObservable()
  }

  getCartItemsValue(): CartItem[] {
    return this.cartItems.value
  }

  addToCart(product: Product): void {
    const currentItems = this.cartItems.value
    const existingItem = currentItems.find(item => item.product.id === product.id)

    if (existingItem) {
      existingItem.quantity += 1
      this.updateCart([...currentItems])
    } else {
      const newItem: CartItem = {
        product: product,
        quantity: 1
      }
      this.updateCart([...currentItems, newItem])
    }

    this.showSuccessMessage('Product added to cart!')
  }

  removeFromCart(productId: number): void {
    const currentItems = this.cartItems.value
    const updatedItems = currentItems.filter(item => item.product.id !== productId)
    this.updateCart(updatedItems)
  }

  updateQuantity(productId: number, quantity: number): void {
    const currentItems = this.cartItems.value
    const item = currentItems.find(item => item.product.id === productId)
    
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId)
      } else {
        item.quantity = quantity
        this.updateCart([...currentItems])
      }
    }
  }

  clearCart(): void {
    this.updateCart([])
  }

  private updateCart(items: CartItem[]): void {
    this.cartItems.next(items)
    this.calculateTotal()
    this.calculateItemCount()
    this.saveCartToStorage()
  }

  private calculateTotal(): void {
    const items = this.cartItems.value
    const total = items.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity)
    }, 0)
    this.cartTotal.next(total)
  }

  private calculateItemCount(): void {
    const items = this.cartItems.value
    const count = items.reduce((sum, item) => {
      return sum + item.quantity
    }, 0)
    this.cartItemCount.next(count)
  }

  private saveCartToStorage(): void {
    const cartData = {
      items: this.cartItems.value,
      total: this.cartTotal.value,
      itemCount: this.cartItemCount.value
    }
    localStorage.setItem('cart', JSON.stringify(cartData))
  }

  private loadCartFromStorage(): void {
    const cartData = localStorage.getItem('cart')
    if (cartData) {
      try {
        const parsed = JSON.parse(cartData)
        this.cartItems.next(parsed.items || [])
        this.cartTotal.next(parsed.total || 0)
        this.cartItemCount.next(parsed.itemCount || 0)
      } catch (error) {
        console.error('Error loading cart from storage:', error)
        this.clearCart()
      }
    }
  }

  private showSuccessMessage(message: string): void {
    const appComponent = (window as any).appComponent
    if (appComponent) {
      appComponent.showSuccessMessage(message)
    }
  }
} 