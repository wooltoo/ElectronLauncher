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

  openWebsite(suburl : string) : void {
    shell.openExternal(LauncherConfig.WEBSITE + suburl);
  }

  minimizeWindow() : void {
    let window : Electron.BrowserWindow | null = remote.BrowserWindow.getFocusedWindow();
    if (!window) 
      return;

    window.minimize();
  }

  quitWindow() : void {
    let window : Electron.BrowserWindow | null = remote.BrowserWindow.getFocusedWindow();
    if (!window) 
      return;

    window.close();
  }

  OnPressCogwheel() : void {
    this.homeComponent.OnPressCogwheelButton();
  }

  OnPressHome() : void {
    this.homeComponent.OnPressHomeButton();
  }

  OnPressAddons() : void {
    this.homeComponent.OnPressAddonsButton();
  }
}
