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

@NgModule({
    declarations: [
        AppComponent,
        NavbarCmcityComponent,
        LoginPageComponent,
        RegisterPageComponent,
        PageNotFoundComponent,
        ForgetPasswordPageComponent,
    ],
    providers: [ConfirmationService,MessageService],
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
        TooltipModule
    ]
})
export class AppModule { }
