import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  Renderer2,
} from '@angular/core'
import { AnimationOptions } from 'ngx-lottie'
import { LottieComponent } from 'ngx-lottie'
import { AnimationItem } from 'lottie-web'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-hero-banner',
  standalone: true,
  imports: [LottieComponent, CommonModule],
  templateUrl: './hero-banner.html',
  styleUrl: './hero-banner.scss',
})
export class HeroBanner implements AfterViewInit {
  @ViewChild('lottieEl', { read: ElementRef }) lottieContainer?: ElementRef
  private animItem?: AnimationItem

  constructor(private renderer: Renderer2) {}

  options: AnimationOptions = {
    path: 'assets/animations/super-hero.json',
    loop: true,
    autoplay: true,
  }

  handleAnimation(anim: AnimationItem): void {
    this.animItem = anim
  }

  ngAfterViewInit(): void {
    if (this.lottieContainer) {
      const native = this.lottieContainer.nativeElement
      this.renderer.listen(native, 'mouseenter', () => this.animItem?.pause())
      this.renderer.listen(native, 'mouseleave', () => this.animItem?.play())
    }
  }
}
