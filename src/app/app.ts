import { Component } from '@angular/core'
import { RouterOutlet, Router } from '@angular/router'
import { CommonModule } from '@angular/common'
import { Sidebar } from './sidebar/sidebar'
import { HeroBanner } from './components/hero-banner/hero-banner'
import { TrustedBy } from './components/trusted-by/trusted-by'
import { Snackbar, SnackbarMessage } from './components/snackbar/snackbar'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, Sidebar, HeroBanner, TrustedBy, Snackbar],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'whitecomm_frontend'
  showSnackbar = false
  snackbarMessage: SnackbarMessage | null = null

  constructor(private router: Router) {
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

  isHomePage(): boolean {
    return this.router.url === '/'
  }
}
