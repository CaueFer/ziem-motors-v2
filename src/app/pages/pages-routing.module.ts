import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { ShowroomComponent } from './showroom/showroom.component';

const routes: Routes = [
  {path: 'home', component: LandingPageComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {path: 'showroom', component: ShowroomComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
