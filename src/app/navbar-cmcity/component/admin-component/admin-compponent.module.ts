import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

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
import { InputSwitchModule } from 'primeng/inputswitch';
import { ChipModule } from 'primeng/chip';
import { CarouselModule } from 'primeng/carousel';
import { BlockUIModule } from 'primeng/blockui';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { NgPipesModule } from 'ngx-pipes';
import { InputNumberModule } from 'primeng/inputnumber';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { ChartModule } from 'primeng/chart';
import { AdminComponent4Component } from './component/admin-component4/admin-component4.component';
import { AdminPage4Component } from './page/admin-page4/admin-page4.component';
import { GalleriaModule } from 'primeng/galleria';
import { PickListModule } from 'primeng/picklist';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PanelMenuModule } from 'primeng/panelmenu';
import { FileUploadModule } from 'primeng/fileupload';
import { ImageModule } from 'primeng/image';
import { SlideMenuModule } from 'primeng/slidemenu';
import { AppComponent } from 'src/app/app.component';
import { AdminNewsPageComponent } from './page/admin-news-page/admin-news-page.component';
import { AdminNewsComponentComponent } from './component/admin-news-component/admin-news-component.component';
import { CheckboxModule } from 'primeng/checkbox';
import { AdminSettingComponentComponent } from './component/admin-setting-component/admin-setting-component.component';
import { AdminSettingPageComponent } from './page/admin-setting-page/admin-setting-page.component';
import { AdminDocComponentComponent } from './component/admin-doc-component/admin-doc-component.component';
import { AdminDocPageComponent } from './page/admin-doc-page/admin-doc-page.component';
import { ConfirmationService } from 'primeng/api';

@NgModule({
  declarations: [
    AdminComponent1Component,
    AdminComponent2Component,
    AdminComponent3Component,
    AdminPage1Component,
    AdminPage2Component,
    AdminPage3Component,
    AdminComponent4Component,
    AdminPage4Component,
    AdminNewsPageComponent,
    AdminNewsComponentComponent,
    AdminSettingComponentComponent,
    AdminSettingPageComponent,
    AdminDocComponentComponent,
    AdminDocPageComponent,
  ],
  bootstrap: [AppComponent],
  providers: [ConfirmationService, DecimalPipe],
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
    ChartModule,
    GalleriaModule,
    PickListModule,
    RadioButtonModule,
    ProgressSpinnerModule,
    PanelMenuModule,
    FileUploadModule,
    ImageModule,
    GalleriaModule,
    PickListModule,
    SlideMenuModule,
    CheckboxModule,
  ],
})
export class AdminCompponentModule {}
