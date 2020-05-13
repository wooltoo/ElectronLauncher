import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';

import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';

import { NavbarComponent } from '../navbar/navbar.component';
import { InfoComponent } from '../info/info.component';
import { NewsEntryComponent } from '../newsentry/newsentry.component';
import { StatusBarComponent } from '../statusbar/statusbar.component'
import { LandingComponent } from '../landing/landing.component';
import { SettingsComponent } from '../settings/settings.component';
import { ModalComponent } from '../modal/modal.component';
import { AddonsComponent } from '../addons/addons.component';
import { AddonComponent } from '../addon/addon.component';

@NgModule({
  declarations: [
    HomeComponent, 
    NavbarComponent, 
    InfoComponent, 
    NewsEntryComponent, 
    StatusBarComponent,
    LandingComponent,
    SettingsComponent,
    ModalComponent,
    AddonsComponent,
    AddonComponent
  ],
  imports: [CommonModule, SharedModule, HomeRoutingModule],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class HomeModule {}
