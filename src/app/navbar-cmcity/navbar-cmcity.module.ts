import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavbarCmcityRoutingModule } from './navbar-cmcity-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DepositComponentComponent } from './component/deposit-component/deposit-component.component';
import { DepositPageComponent } from './page/deposit-page/deposit-page.component';
import { MainComponentComponent } from './component/main-component/main-component.component';
import { MainPageComponent } from './page/main-page/main-page.component';
import { ShareComponentComponent } from './component/share-component/share-component.component';
import { SharePageComponent } from './page/share-page/share-page.component';
import { LoanComponentComponent } from './component/loan-component/loan-component.component';
import { LoanPageComponent } from './page/loan-page/loan-page.component';
import { LoanRightsComponentComponent } from './component/loan-rights-component/loan-rights-component.component';
import { LoanRightsPageComponent } from './page/loan-rights-page/loan-rights-page.component';
import { BeneficiaryComponentComponent } from './component/beneficiary-component/beneficiary-component.component';
import { BeneficiaryPageComponent } from './page/beneficiary-page/beneficiary-page.component';
import { GuaranteeObligationComponentComponent } from './component/guarantee-obligation-component/guarantee-obligation-component.component';
import { GuaranteeObligationPageComponent } from './page/guarantee-obligation-page/guarantee-obligation-page.component';
import { DividendComponentComponent } from './component/dividend-component/dividend-component.component';
import { DividendPageComponent } from './page/dividend-page/dividend-page.component';

@NgModule({
  declarations: [
    DepositComponentComponent,
    DepositPageComponent,
    MainComponentComponent,
    MainPageComponent,
    ShareComponentComponent,
    SharePageComponent,
    LoanComponentComponent,
    LoanPageComponent,
    LoanRightsComponentComponent,
    LoanRightsPageComponent,
    BeneficiaryComponentComponent,
    BeneficiaryPageComponent,
    GuaranteeObligationComponentComponent,
    GuaranteeObligationPageComponent,
    DividendComponentComponent,
    DividendPageComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    NavbarCmcityRoutingModule
  ]
})
export class NavbarCmcityModule { }
