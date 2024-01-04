import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarCmcityComponent } from './navbar-cmcity/navbar-cmcity.component';
import {MenubarModule} from 'primeng/menubar';
import {ButtonModule} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import { LoginPageComponent } from './Login/login-page.component';
import {InputTextModule} from 'primeng/inputtext';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';
import {PasswordModule} from 'primeng/password';
import { RegisterPageComponent } from './Register/register-page.component';
import { CommonModule } from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import { PageNotFoundComponent } from './PageNotFound/page-not-found.component';
import {MenuModule} from 'primeng/menu';
import { NavbarCmcityModule } from './navbar-cmcity/navbar-cmcity.module';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ToastModule} from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import {TableModule} from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { ForgetPasswordPageComponent } from './forget-password/forget-password-page.component';
import {TooltipModule} from 'primeng/tooltip';
import {NgxWebstorageModule} from 'ngx-webstorage';
import { AuthGuardService } from './auth-guard.service';
import { BnNgIdleService } from 'bn-ng-idle'; 
import { ChipModule } from 'primeng/chip';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { PanelMenuModule } from 'primeng/panelmenu';
import { PageCloseComponentComponent } from './PageClosedForMaintenance/page-close-component.component';

@NgModule({
    declarations: [	
        AppComponent,
        NavbarCmcityComponent,
        LoginPageComponent,
        RegisterPageComponent,
        PageNotFoundComponent,
        ForgetPasswordPageComponent,
        LandingPageComponent,
        PageCloseComponentComponent,
   ],
    providers: [ConfirmationService,MessageService,AuthGuardService,BnNgIdleService],
    bootstrap: [AppComponent],
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        MenubarModule,
        ButtonModule,
        DialogModule,
        InputTextModule,
        FormsModule,
        ReactiveFormsModule,
        PasswordModule,
        HttpClientModule,
        MenuModule,
        NavbarCmcityModule,
        ConfirmDialogModule,
        ToastModule,
        TableModule,
        CalendarModule,
        TooltipModule,
        NgxWebstorageModule.forRoot(),
        ChipModule,
        PanelMenuModule
    ]
})
export class AppModule { }
