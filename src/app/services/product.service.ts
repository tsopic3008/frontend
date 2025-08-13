import { Injectable } from '@angular/core'
import { Observable, from } from 'rxjs'

export interface Product {
  id: number
  name: string
  description: string
  price: number
  categoryName: string
  imageUrl: string | null
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly baseUrl = 'http://product-management.local:8080'

  constructor() {}

  getProducts(): Observable<Product[]> {
    return from(
      fetch(`${this.baseUrl}/products`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
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