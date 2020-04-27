import { Component, OnInit, Inject } from '@angular/core';
import { HomeComponent } from '../home/home.component';
import { LauncherConfig } from '../general/launcherconfig';

const { remote } = require("electron");
const { shell } = require('electron')

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(@Inject(HomeComponent) private homeComponent : HomeComponent) { }

  ngOnInit(): void { }

  openWebsite(suburl) {
    shell.openExternal(LauncherConfig.WEBSITE + suburl);
  }

  minimizeWindow() {
    remote.BrowserWindow.getFocusedWindow().minimize();
  }

  quitWindow() {
    remote.BrowserWindow.getFocusedWindow().close();
  }

  OnPressCogwheel() : void {
    this.homeComponent.OnPressCogwheelButton();
  }

  OnPressHome() : void {
    this.homeComponent.OnPressHomeButton();
  }
}
