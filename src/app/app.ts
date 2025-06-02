import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { Sidebar } from './sidebar/sidebar'
import { HeroBanner } from './components/hero-banner/hero-banner'
import { TrustedBy } from './components/trusted-by/trusted-by'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar, HeroBanner, TrustedBy],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'whitecomm_frontend'
}
