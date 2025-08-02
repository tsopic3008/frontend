import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ProductService, Product } from '../../services/product.service'
import { CartService } from '../../services/cart.service'
import { AuthService } from '../../services/auth.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products implements OnInit {
  products: Product[] = []
  loading = true
  error: string | null = null

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/'])
      return
    }

    this.loadProducts()
  }

  loadProducts(): void {
    this.loading = true
    this.error = null

    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products
        this.loading = false
      },
      error: (error) => {
        this.error = 'Failed to load products. Please try again later.'
        this.loading = false
        console.error('Error loading products:', error)
      }
    })
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product)
  }

  getDefaultImageUrl(): string {
    return 'assets/logo/logo.png'
  }

  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement
    if (img) {
      img.src = this.getDefaultImageUrl()
    }
  }

  goBack(): void {
    this.router.navigate(['/'])
  }
} 