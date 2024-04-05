import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScrollToModule, ScrollToService } from '@andrei4ik/ngx-scroll-to';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ReactiveFormsModule } from '@angular/forms';

import { NavDefaultComponent } from './micro-components/navs/nav-default/nav-default.component';
import { FooterDefaultComponent } from './micro-components/footers/footer-default/footer-default.component';
import { CubeTestComponent } from './micro-components/3d/cube-test/cube-test.component';
import { RouterLink } from '@angular/router';

@NgModule({
  declarations: [
    FooterDefaultComponent,
    NavDefaultComponent,
    CubeTestComponent,
  ],
  imports: [
    CommonModule,
    ScrollToModule,
    CarouselModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  providers: [
    ScrollToService,

  ],
  exports: [
    FooterDefaultComponent,
    NavDefaultComponent,
    CubeTestComponent,
  ]
})
export class SharedModule { }
