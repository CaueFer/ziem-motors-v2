import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { SharedModule } from '../shared/shared.module';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { AccountModule } from '../account/account.module';
import { StoresComponent } from './stores/stores.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';


@NgModule({
  declarations: [LandingPageComponent, StoresComponent],
  imports: [
    CommonModule,
    PagesRoutingModule,
    SharedModule,
    CarouselModule,
    AccountModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [

  ]
})
export class PagesModule { }