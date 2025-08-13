import { Injectable } from '@angular/core'
import { Observable, from } from 'rxjs'

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  password: string
  email: string
  firstName: string
  lastName: string
}

export interface LoginResponse {
  access_token: string
  expires_in: number
  refresh_expires_in: number
  refresh_token: string
  token_type: string
  'not-before-policy': number
  session_state: string
  scope: string
}

export interface UserInfo {
  given_name: string
  family_name: string
  name: string
  email: string
  preferred_username: string
  sub: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = 'http://tscore-app.local:8080'

  constructor() {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return from(
      fetch(`${this.baseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      }).then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
      })
    )
  }

  register(credentials: RegisterRequest): Observable<LoginResponse> {
    return from(
      fetch(`${this.baseUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      }).then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
      })
    )
  }

  private decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))
      return JSON.parse(jsonPayload)
    } catch (error) {
      console.error('Error decoding token:', error)
      return null
    }
  }

  getUserInfo(): UserInfo | null {
    const token = this.getAuthToken()
    if (!token) return null
    
    const decodedToken = this.decodeToken(token)
    if (!decodedToken) return null
    
    return {
      given_name: decodedToken.given_name || '',
      family_name: decodedToken.family_name || '',
      name: decodedToken.name || '',
      email: decodedToken.email || '',
      preferred_username: decodedToken.preferred_username || '',
      sub: decodedToken.sub || ''
    }
  }

  isLoggedIn(): boolean {
    const token = this.getAuthToken()
    if (!token) return false
    
    const decodedToken = this.decodeToken(token)
    if (!decodedToken) return false
    
    const currentTime = Math.floor(Date.now() / 1000)
    return decodedToken.exp > currentTime
  }

  setAuthToken(token: string): void {
    localStorage.setItem('authToken', token)
  }

  getAuthToken(): string | null {
    return localStorage.getItem('authToken')
  }

  logout(): void {
    localStorage.removeItem('authToken')
  }
} 