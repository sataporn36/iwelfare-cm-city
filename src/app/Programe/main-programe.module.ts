import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainProgrameRoutingModule } from './main-programe-routing.module';
import { MainProgrameComponent } from './main-programe.component';
import { MainCoponentComponent } from './component/main/main-coponent.component';
import { MainPageComponent } from './page/main-page/main-page.component';
import {ImageModule} from 'primeng/image';
import {GalleriaModule} from 'primeng/galleria';
import { ProfilePageComponent } from './page/profile-page/profile-page.component';
import { ProfileComponent } from './component/profile/profile.component';

@NgModule({
  declarations: [
    //MainProgrameComponent,
    MainCoponentComponent,
    MainPageComponent,
    ProfilePageComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    MainProgrameRoutingModule,
    ImageModule,
    GalleriaModule
  ]
})
export class MainProgrameModule { }
