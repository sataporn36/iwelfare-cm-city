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
// import {MenuItem} from 'primeng/api';

@NgModule({
    declarations: [
        AppComponent,
        NavbarCmcityComponent,
        LoginPageComponent,
        RegisterPageComponent,
        PageNotFoundComponent,
    ],
    providers: [],
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
        NavbarCmcityModule
    ]
})
export class AppModule { }
