import { Component, EventEmitter, Output } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { AuthService } from '../../services/auth.service'

@Component({
  selector: 'app-login-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './login-modal.html',
  styleUrl: './login-modal.scss',
})
export class LoginModal {
  @Output() closeModal = new EventEmitter<void>()
  @Output() loginSuccess = new EventEmitter<void>()
  @Output() showMessage = new EventEmitter<{ message: string, type: 'success' | 'error' }>()
  
  username: string = ''
  password: string = ''
  isLoading = false
  errorMessage = ''
  
  constructor(private authService: AuthService) {}
  
  onClose() {
    this.closeModal.emit()
  }
  
  onSubmit() {
    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter both username and password'
      return
    }
    
    this.isLoading = true
    this.errorMessage = ''
    
    this.authService.login({
      username: this.username,
      password: this.password
    }).subscribe({
      next: (response) => {
        console.log('Login successful:', response)
        
        if (response.access_token) {
          this.authService.setAuthToken(response.access_token)
        }
        
        this.username = ''
        this.password = ''
        this.isLoading = false
        
        this.showMessage.emit({ message: 'Login successful! Welcome back!', type: 'success' })
        
        this.loginSuccess.emit()
        this.onClose()
      },
      error: (error) => {
        console.error('Login failed:', error)
        this.errorMessage = error.message || 'Login failed. Please try again.'
        this.isLoading = false
        this.showMessage.emit({ message: error.message || 'Login failed. Please try again.', type: 'error' })
      }
    })
  }
} 