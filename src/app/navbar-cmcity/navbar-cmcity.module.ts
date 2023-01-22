import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavbarCmcityRoutingModule } from './navbar-cmcity-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DepositComponentComponent } from './component/deposit-component/deposit-component.component';
import { DepositPageComponent } from './page/deposit-page/deposit-page.component';
import { MainComponentComponent } from './component/main-component/main-component.component';
import { MainPageComponent } from './page/main-page/main-page.component';

@NgModule({
  declarations: [
    DepositComponentComponent,
    DepositPageComponent,
    MainComponentComponent,
    MainPageComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    NavbarCmcityRoutingModule
  ]
})
export class NavbarCmcityModule { }
