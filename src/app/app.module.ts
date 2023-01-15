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
import { MainProgrameModule } from "./Programe/main-programe.module";
import { MainProgrameComponent } from './Programe/main-programe.component';
import { CommonModule } from '@angular/common';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
    declarations: [
        AppComponent,
        NavbarCmcityComponent,
        LoginPageComponent,
        RegisterPageComponent,
        MainProgrameComponent
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
        MainProgrameModule,
        HttpClientModule
    ]
})
export class AppModule { }
