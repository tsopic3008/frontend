import { Component, EventEmitter, Output } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { AuthService } from '../../services/auth.service'

@Component({
  selector: 'app-register-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './register-modal.html',
  styleUrl: './register-modal.scss',
})
export class RegisterModal {
  @Output() closeModal = new EventEmitter<void>()
  @Output() registerSuccess = new EventEmitter<void>()
  @Output() showMessage = new EventEmitter<{ message: string, type: 'success' | 'error' }>()
  
  username: string = ''
  password: string = ''
  email: string = ''
  firstName: string = ''
  lastName: string = ''
  isLoading = false
  errorMessage = ''
  
  constructor(private authService: AuthService) {}
  
  onClose() {
    this.closeModal.emit()
  }
  
  onSubmit() {
    if (!this.username || !this.password || !this.email || !this.firstName || !this.lastName) {
      this.errorMessage = 'Please fill in all fields'
      return
    }
    
    this.isLoading = true
    this.errorMessage = ''
    
    this.authService.register({
      username: this.username,
      password: this.password,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName
    }).subscribe({
      next: (response) => {
        console.log('Register successful:', response)
        
        if (response.access_token) {
          this.authService.setAuthToken(response.access_token)
        }
        
        this.username = ''
        this.password = ''
        this.email = ''
        this.firstName = ''
        this.lastName = ''
        this.isLoading = false

        this.showMessage.emit({ message: 'Registration successful! Welcome to Whitecomm!', type: 'success' })

        this.registerSuccess.emit()
        this.onClose()
      },
      error: (error) => {
        console.error('Register failed:', error)
        this.errorMessage = error.message || 'Registration failed. Please try again.'
        this.isLoading = false
  
        this.showMessage.emit({ message: error.message || 'Registration failed. Please try again.', type: 'error' })
      }
    })
  }
} 