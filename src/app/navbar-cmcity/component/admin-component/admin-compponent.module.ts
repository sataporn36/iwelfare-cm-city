import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminCompponentRoutingModule } from './admin-compponent-routing.module';
import { AdminComponent1Component } from './component/admin-component1/admin-component1.component';
import { AdminComponent2Component } from './component/admin-component2/admin-component2.component';
import { AdminComponent3Component } from './component/admin-component3/admin-component3.component';
import { AdminPage1Component } from './page/admin-page1/admin-page1.component';
import { AdminPage2Component } from './page/admin-page2/admin-page2.component';
import { AdminPage3Component } from './page/admin-page3/admin-page3.component';
import { BrowserModule } from '@angular/platform-browser';
import { ToastModule } from 'primeng/toast';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { HttpClientModule } from '@angular/common/http';
import { MenuModule } from 'primeng/menu';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import {InputSwitchModule} from 'primeng/inputswitch';
import { ChipModule } from 'primeng/chip';
import {CarouselModule} from 'primeng/carousel';
import {BlockUIModule} from 'primeng/blockui';
import {CardModule} from 'primeng/card';
import {PanelModule } from 'primeng/panel';
import {NgPipesModule} from 'ngx-pipes';
import { InputNumberModule } from 'primeng/inputnumber';
import {TooltipModule} from 'primeng/tooltip';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { ChartModule } from 'primeng/chart';
import { AdminComponent4Component } from './component/admin-component4/admin-component4.component';
import { AdminPage4Component } from './page/admin-page4/admin-page4.component';

@NgModule({
  declarations: [
    AdminComponent1Component,
    AdminComponent2Component,
    AdminComponent3Component,
    AdminPage1Component,
    AdminPage2Component,
    AdminPage3Component,
    AdminComponent4Component,
    AdminPage4Component
  ],
  imports: [
    CommonModule,
    AdminCompponentRoutingModule,
    CommonModule,
    BrowserModule,
    MenubarModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    PasswordModule,
    HttpClientModule,
    MenuModule,
    ConfirmDialogModule,
    ToastModule,
    TableModule,
    CalendarModule,
    InputSwitchModule,
    ChipModule,
    CarouselModule,
    BlockUIModule,
    CardModule,
    PanelModule,
    NgPipesModule,
    InputNumberModule,
    TooltipModule,
    InputTextareaModule,
    DropdownModule,
    TagModule,
    AvatarModule,
    ChartModule
  ]
})
export class AdminCompponentModule { }
