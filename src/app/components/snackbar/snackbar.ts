import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'

export interface SnackbarMessage {
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
}

@Component({
  selector: 'app-snackbar',
  imports: [CommonModule],
  templateUrl: './snackbar.html',
  styleUrl: './snackbar.scss',
})
export class Snackbar {
  @Input() message: SnackbarMessage | null = null
  @Input() show = false
} 