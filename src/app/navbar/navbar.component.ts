import { Component, OnInit } from '@angular/core';

/*const { remote } = require("electron");
const { shell } = require('electron')*/ //Uncomment when building

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  website = "http://www.website.com";

  constructor() { }

  ngOnInit(): void { }

  openWebsite(suburl) {
    //shell.openExternal(this.website + suburl);
  }

  minimizeWindow() {
    //remote.BrowserWindow.getFocusedWindow().minimize();
  }

  quitWindow() {
    //remote.BrowserWindow.getFocusedWindow().close();
  }
}
