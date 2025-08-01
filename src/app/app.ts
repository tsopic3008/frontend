import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { Sidebar } from './sidebar/sidebar'
import { HeroBanner } from './components/hero-banner/hero-banner'
import { TrustedBy } from './components/trusted-by/trusted-by'
import { LoginModal } from './components/login-modal/login-modal'
import { RegisterModal } from './components/register-modal/register-modal'
import { Snackbar, SnackbarMessage } from './components/snackbar/snackbar'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar, HeroBanner, TrustedBy, LoginModal, RegisterModal, Snackbar],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'whitecomm_frontend'
  showSnackbar = false
  snackbarMessage: SnackbarMessage | null = null

  constructor() {
    ;(window as any).appComponent = this
  }

  showSuccessMessage(message: string) {
    this.snackbarMessage = { message, type: 'success' }
    this.showSnackbar = true
    
    setTimeout(() => {
      this.showSnackbar = false
    }, 3000)
  }

  showErrorMessage(message: string) {
    this.snackbarMessage = { message, type: 'error' }
    this.showSnackbar = true
    
    setTimeout(() => {
      this.showSnackbar = false
    }, 5000)
  }
}
