import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './Login/login-page.component';
import { NavbarCmcityComponent } from './navbar-cmcity/navbar-cmcity.component';
import { DepositPageComponent } from './navbar-cmcity/page/deposit-page/deposit-page.component';
import { MainPageComponent } from './navbar-cmcity/page/main-page/main-page.component';
import { PageNotFoundComponent } from './PageNotFound/page-not-found.component';
import { RegisterPageComponent } from './Register/register-page.component';

const routes: Routes = [
    {
      path: '',
      redirectTo: 'login',
      pathMatch: 'full'
    },
    {
      path: 'login',
      component: LoginPageComponent,
    },
    {
      path: 'register',
      component: RegisterPageComponent,
    },
    {
      path: 'navbar',
      component: NavbarCmcityComponent,
      children: [
        {
          path: '',
          redirectTo: 'main-page',
          pathMatch: 'full'
        },
        {
          path: 'main-page',
          component: MainPageComponent,
        },
        {
          path: 'deposit-page',
          component: DepositPageComponent,
        }
      ]
    },
    {
      path: '**',
      component: PageNotFoundComponent,
    },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
