import { Component, OnInit, Inject } from '@angular/core';
import { HomeComponent } from '../home/home.component';

const { remote } = require("electron");
const { shell } = require('electron')

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  website = "http://www.website.com";

  constructor(@Inject(HomeComponent) private homeComponent : HomeComponent) { }

  ngOnInit(): void { }

  openWebsite(suburl) {
    shell.openExternal(this.website + suburl);
  }

  minimizeWindow() {
    console.log("minimize pressed!");
    remote.BrowserWindow.getFocusedWindow().minimize();
  }

  quitWindow() {
    remote.BrowserWindow.getFocusedWindow().close();
  }

  OnPressCogwheel() : void {
    console.log("cogwheel pressed!");
    this.homeComponent.OnPressCogwheelButton();
  }
}
