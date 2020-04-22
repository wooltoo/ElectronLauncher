import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';

import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';

import { NavbarComponent } from '../navbar/navbar.component';
import { InfoComponent } from '../info/info.component';

@NgModule({
  declarations: [HomeComponent, NavbarComponent, InfoComponent],
  imports: [CommonModule, SharedModule, HomeRoutingModule]
})
export class HomeModule {}
