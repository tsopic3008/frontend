import { bootstrapApplication } from '@angular/platform-browser'
import { App } from './app/app'
import { provideLottieOptions } from 'ngx-lottie'
import player from 'lottie-web'

export function playerFactory() {
  return player
}

bootstrapApplication(App, {
  providers: [
    provideLottieOptions({ player: playerFactory }),
  ]
})
