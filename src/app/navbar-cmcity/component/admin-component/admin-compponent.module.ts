import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminCompponentRoutingModule } from './admin-compponent-routing.module';
import { AdminComponent1Component } from './component/admin-component1/admin-component1.component';
import { AdminComponent2Component } from './component/admin-component2/admin-component2.component';
import { AdminComponent3Component } from './component/admin-component3/admin-component3.component';
import { AdminPage1Component } from './page/admin-page1/admin-page1.component';
import { AdminPage2Component } from './page/admin-page2/admin-page2.component';
import { AdminPage3Component } from './page/admin-page3/admin-page3.component';


@NgModule({
  declarations: [
    AdminComponent1Component,
    AdminComponent2Component,
    AdminComponent3Component,
    AdminPage1Component,
    AdminPage2Component,
    AdminPage3Component
  ],
  imports: [
    CommonModule,
    AdminCompponentRoutingModule
  ]
})
export class AdminCompponentModule { }
