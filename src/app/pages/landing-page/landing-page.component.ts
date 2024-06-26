import { Component } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {

  mainOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      940: {
        items: 1
      }
    },
    nav: false,
    autoplay: true,
    autoplayTimeout: 3500,
  }

  brandsOption: OwlOptions = {
    items: 1,
    loop: true,
    margin: 24,
    nav: false,
    dots: false,
    autoHeight: false,
    stagePadding: 0,
    responsive: {
      0: {
        items: 4
      },
      912: {
        items: 5
      },
    },
    autoplay: true,
    autoplayTimeout: 2000,
    autoplaySpeed: 1000,
    autoplayHoverPause: true,
  }
}
