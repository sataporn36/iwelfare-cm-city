import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './Login/login-page.component';
import { NavbarCmcityComponent } from './navbar-cmcity/navbar-cmcity.component';
import { PageNotFoundComponent } from './PageNotFound/page-not-found.component';
import { RegisterPageComponent } from './Register/register-page.component';

const routes: Routes = [
    {
      path: '',
      redirectTo: 'Login',
      pathMatch: 'full'
    },
    {
      path: 'Login',
      component: LoginPageComponent,
    },
    {
      path: 'Register',
      component: RegisterPageComponent,
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
