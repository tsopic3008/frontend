import { Component, OnInit, OnDestroy } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CartService, CartItem } from '../../services/cart.service'
import { OrderService } from '../../services/order.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart implements OnInit, OnDestroy {
  cartItems: CartItem[] = []
  cartTotal: number = 0
  cartItemCount: number = 0
  showCart: boolean = false
  isProcessing: boolean = false

  private subscriptions: Subscription[] = []

  constructor(
    private cartService: CartService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.cartService.getCartItems().subscribe(items => {
        this.cartItems = items
      })
    )

    this.subscriptions.push(
      this.cartService.getCartTotal().subscribe(total => {
        this.cartTotal = total
      })
    )

    this.subscriptions.push(
      this.cartService.getCartItemCount().subscribe(count => {
        this.cartItemCount = count
      })
    )
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }

  toggleCart(): void {
    this.showCart = !this.showCart
  }

  removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId)
  }

  updateQuantity(productId: number, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity)
  }

  clearCart(): void {
    this.cartService.clearCart()
  }

  checkout(): void {
    if (this.cartItems.length === 0) {
      this.showErrorMessage('Your cart is empty')
      return
    }

    this.isProcessing = true

    this.orderService.createOrder().subscribe({
      next: (order) => {
        console.log('Order created successfully:', order)
        this.cartService.clearCart()
        this.showCart = false
        this.showSuccessMessage('Order placed successfully! Thank you for your purchase.')
        this.isProcessing = false
      },
      error: (error) => {
        console.error('Error creating order:', error)
        this.showErrorMessage('Failed to place order. Please try again.')
        this.isProcessing = false
      }
    })
  }

  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`
  }

  getDefaultImageUrl(): string {
    return 'assets/logo/logo.png'
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement
    if (img) {
      img.src = this.getDefaultImageUrl()
    }
  }

  private showSuccessMessage(message: string): void {
    const appComponent = (window as any).appComponent
    if (appComponent) {
      appComponent.showSuccessMessage(message)
    }
  }

  private showErrorMessage(message: string): void {
    const appComponent = (window as any).appComponent
    if (appComponent) {
      appComponent.showErrorMessage(message)
    }
  }
} 