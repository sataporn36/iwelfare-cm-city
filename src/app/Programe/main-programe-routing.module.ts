import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainProgrameComponent } from './main-programe.component';
import { MainPageComponent } from './page/main-page/main-page.component';
import { ProfilePageComponent } from './page/profile-page/profile-page.component';

const routes: Routes = [
  {
    path: '',
    component: MainProgrameComponent,
    children: [
      {
        path: '',
        redirectTo: '/main',
        pathMatch: 'full'
      },
      {
        path: 'main',
        component: MainPageComponent,
      },
      {
        path: 'profile',
        component: ProfilePageComponent,
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainProgrameRoutingModule { }
