import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './Login/login-page.component';
import { NavbarCmcityComponent } from './navbar-cmcity/navbar-cmcity.component';
import { BeneficiaryPageComponent } from './navbar-cmcity/page/beneficiary-page/beneficiary-page.component';
import { DepositPageComponent } from './navbar-cmcity/page/deposit-page/deposit-page.component';
import { DividendPageComponent } from './navbar-cmcity/page/dividend-page/dividend-page.component';
import { GuaranteeObligationPageComponent } from './navbar-cmcity/page/guarantee-obligation-page/guarantee-obligation-page.component';
import { LoanPageComponent } from './navbar-cmcity/page/loan-page/loan-page.component';
import { LoanRightsPageComponent } from './navbar-cmcity/page/loan-rights-page/loan-rights-page.component';
import { MainPageComponent } from './navbar-cmcity/page/main-page/main-page.component';
import { ProfilePageComponent } from './navbar-cmcity/page/profile-page/profile-page.component';
import { SharePageComponent } from './navbar-cmcity/page/share-page/share-page.component';
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
      path: 'main',
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
        },
        {
          path: 'share-page',
          component: SharePageComponent,
        },
        {
          path: 'loan-page',
          component: LoanPageComponent,
        },
        {
          path: 'loan-rigths-page',
          component: LoanRightsPageComponent,
        },
        {
          path: 'beneficiary-page',
          component: BeneficiaryPageComponent,
        },
        {
          path: 'guarantee-obligation-page',
          component: GuaranteeObligationPageComponent,
        },
        {
          path: 'dividend-page',
          component: DividendPageComponent,
        },
        {
          path: 'profile-page',
          component: ProfilePageComponent,
        },
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
