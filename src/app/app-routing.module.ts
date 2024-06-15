import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteGuard } from './core/services/route.guard';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';

const routes: Routes = [
  {path: "", loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)},

  {path: "home", component: LandingPageComponent},
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {path: "account", loadChildren: () => import('./account/account.module').then(m => m.AccountModule)},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [RouteGuard]
})
export class AppRoutingModule { }
