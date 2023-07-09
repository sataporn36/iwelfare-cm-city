import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService as AuthGuard } from './auth-guard.service';
import { ForgetPasswordPageComponent } from './forget-password/forget-password-page.component';
import { LoginPageComponent } from './Login/login-page.component';
import { NavbarCmcityComponent } from './navbar-cmcity/navbar-cmcity.component';
import { BeneficiaryPageComponent } from './navbar-cmcity/page/beneficiary-page/beneficiary-page.component';
import { DepositPageComponent } from './navbar-cmcity/page/deposit-page/deposit-page.component';
import { DividendPageComponent } from './navbar-cmcity/page/dividend-page/dividend-page.component';
import { GuaranteeObligationPageComponent } from './navbar-cmcity/page/guarantee-obligation-page/guarantee-obligation-page.component';
import { LoanPageComponent } from './navbar-cmcity/page/loan-page/loan-page.component';
import { LoanRightsPageComponent } from './navbar-cmcity/page/loan-rights-page/loan-rights-page.component';
import { MainPageComponent } from './navbar-cmcity/page/main-page/main-page.component';
import { MessagePageComponent } from './navbar-cmcity/page/message-page/message-page.component';
import { ProfilePageComponent } from './navbar-cmcity/page/profile-page/profile-page.component';
import { SharePageComponent } from './navbar-cmcity/page/share-page/share-page.component';
import { PageNotFoundComponent } from './PageNotFound/page-not-found.component';
import { RegisterPageComponent } from './Register/register-page.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AdminComponentComponent } from './navbar-cmcity/component/admin-component/admin-component.component';
import { AdminPage1Component } from './navbar-cmcity/component/admin-component/page/admin-page1/admin-page1.component';
import { AdminPage2Component } from './navbar-cmcity/component/admin-component/page/admin-page2/admin-page2.component';
import { AdminPage3Component } from './navbar-cmcity/component/admin-component/page/admin-page3/admin-page3.component';
import { AdminPage4Component } from './navbar-cmcity/component/admin-component/page/admin-page4/admin-page4.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'index',
    pathMatch: 'full'
  },
  {
    path: 'index',
    component: LandingPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    component: LoginPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'register',
    component: RegisterPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'forget-password',
    component: ForgetPasswordPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'main',
    component: NavbarCmcityComponent,
    canActivateChild: [AuthGuard],
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
      {
        path: 'message-page',
        component: MessagePageComponent,
      },
      // {
      //   // path: 'admin',
      //   // component: AdminComponentComponent,
      //   // canActivateChild: [AuthGuard],
      //   // children: [
      //   //   {
      //   path: '',
      //   redirectTo: 'admin-page1',
      //   pathMatch: 'full'
      // },
      {
        path: 'admin-page1',
        component: AdminPage1Component,
      },
      {
        path: 'admin-page2',
        component: AdminPage2Component,
      },
      {
        path: 'admin-page3',
        component: AdminPage3Component,
        //   },
        // ]
      },
      {
        path: 'admin-page4',
        component: AdminPage4Component,
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
