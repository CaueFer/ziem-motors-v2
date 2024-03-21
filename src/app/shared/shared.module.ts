import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FooterDefaultComponent } from './micro-components/footers/footer-default/footer-default.component';
import { NavDefaultComponent } from './micro-components/navs/nav-default/nav-default.component';
import { ScrollToModule, ScrollToService } from '@andrei4ik/ngx-scroll-to';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { RouterLink } from '@angular/router';


@NgModule({
  declarations: [
    FooterDefaultComponent,
    NavDefaultComponent,
  ],
  imports: [
    CommonModule,
    ScrollToModule,
    CarouselModule,
    RouterLink,
  ],
  providers: [
    ScrollToService,
  ],
  exports: [
    FooterDefaultComponent,
    NavDefaultComponent,
  ]
})
export class SharedModule { }
