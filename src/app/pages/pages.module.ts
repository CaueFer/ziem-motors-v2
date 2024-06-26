import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { SharedModule } from '../shared/shared.module';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { AccountModule } from '../account/account.module';
import { StoresComponent } from './stores/stores.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShowroomComponent } from './showroom/showroom.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ScrollToModule } from '@andrei4ik/ngx-scroll-to';
import { BsDropdownModule,BsDropdownConfig } from 'ngx-bootstrap/dropdown';


@NgModule({
  declarations: [LandingPageComponent, StoresComponent, ShowroomComponent],
  imports: [
    CommonModule,
    PagesRoutingModule,
    SharedModule,
    CarouselModule,
    AccountModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSkeletonLoaderModule,
    ScrollToModule,
    BsDropdownModule
  ],
  providers: [
    BsDropdownConfig
  ]
})
export class PagesModule { }