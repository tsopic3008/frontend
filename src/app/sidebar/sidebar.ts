import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { LoginModal } from '../components/login-modal/login-modal'
import { RegisterModal } from '../components/register-modal/register-modal'
import { Cart } from '../components/cart/cart'
import { AuthService } from '../services/auth.service'

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, LoginModal, RegisterModal, Cart],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar implements OnInit {
  showLoginModal = false
  showRegisterModal = false
  isLoggedIn = false
  
  constructor(public authService: AuthService) {}
  
  ngOnInit() {
    this.updateLoginStatus()
  }
  
  openLoginModal() {
    this.showLoginModal = true
  }
  
  closeLoginModal() {
    this.showLoginModal = false
    this.updateLoginStatus()
  }
  
  openRegisterModal() {
    this.showRegisterModal = true
  }
  
  closeRegisterModal() {
    this.showRegisterModal = false
  }
  
  onLoginSuccess() {
    console.log('Login successful, updating status...')
    this.updateLoginStatus()
  }
  
  onRegisterSuccess() {
    console.log('Register successful, updating status...')
    this.updateLoginStatus()
  }
  
  onShowMessage(event: { message: string, type: 'success' | 'error' }) {
    const appComponent = (window as any).appComponent
    if (appComponent) {
      if (event.type === 'success') {
        appComponent.showSuccessMessage(event.message)
      } else {
        appComponent.showErrorMessage(event.message)
      }
    }
  }
  
  logout() {
    this.authService.logout()
    this.updateLoginStatus()
  }
  
  getUserGivenName(): string {
    const userInfo = this.authService.getUserInfo()
    return userInfo?.given_name || 'User'
  }
  
  private updateLoginStatus() {
    this.isLoggedIn = this.authService.isLoggedIn()
    console.log('Login status updated:', this.isLoggedIn)
  }
}
