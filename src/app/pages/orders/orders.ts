import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { OrderService, OrderResponse } from '../../services/order.service'
import { AuthService } from '../../services/auth.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.html',
  styleUrl: './orders.scss',
})
export class Orders implements OnInit {
  orders: OrderResponse[] = []
  loading = true
  error: string | null = null

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/'])
      return
    }

    this.loadOrders()
  }

  loadOrders(): void {
    this.loading = true
    this.error = null

    this.orderService.getUserOrders().subscribe({
      next: (orders) => {
        this.orders = orders
        this.loading = false
      },
      error: (error) => {
        this.error = 'Failed to load orders. Please try again later.'
        this.loading = false
        console.error('Error loading orders:', error)
      }
    })
  }

  calculateOrderTotal(order: OrderResponse): number {
    return order.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity)
    }, 0)
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

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return '#ffc107'
      case 'processing':
        return '#17a2b8'
      case 'shipped':
        return '#28a745'
      case 'delivered':
        return '#28a745'
      case 'cancelled':
        return '#dc3545'
      default:
        return '#6c757d'
    }
  }

  goBack(): void {
    this.router.navigate(['/'])
  }
} 