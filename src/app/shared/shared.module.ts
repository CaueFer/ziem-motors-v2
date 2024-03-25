import { NgModule, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScrollToModule, ScrollToService } from '@andrei4ik/ngx-scroll-to';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { RouterLink } from '@angular/router';

import { NavDefaultComponent } from './micro-components/navs/nav-default/nav-default.component';
import { FooterDefaultComponent } from './micro-components/footers/footer-default/footer-default.component';
import { MapComponent } from './micro-components/map/map.component';
import { CubeTestComponent } from './micro-components/3d/cube-test/cube-test.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    FooterDefaultComponent,
    NavDefaultComponent,
    MapComponent,
    CubeTestComponent,
  ],
  imports: [
    CommonModule,
    ScrollToModule,
    CarouselModule,
    RouterLink,
    LeafletModule,
    ReactiveFormsModule,
  ],
  providers: [
    ScrollToService,
    {provide: Window, useValue: window},
  ],
  exports: [
    FooterDefaultComponent,
    NavDefaultComponent,
    MapComponent,
    CubeTestComponent,
  ]
})
export class SharedModule { }
