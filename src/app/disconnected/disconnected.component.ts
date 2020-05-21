import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LauncherConfig } from '../general/launcherconfig';
import { ipcRenderer } from 'electron';
import { AnimateCSS } from '../general/animatecss';

const { shell } = require('electron')

@Component({
  selector: 'app-disconnected',
  templateUrl: './disconnected.component.html',
  styleUrls: ['./disconnected.component.css']
})
export class DisconnectedComponent implements OnInit {

  online : boolean | undefined;

  noSpace : boolean = false;
  visible : boolean = false;
  draggable : boolean = false;

  statusText : string = '';

  constructor(private translate : TranslateService) { 
    translate.get('DISCONNECTED.STATUS').subscribe((result : string) => {
      this.statusText = result;
    });
  }

  ngOnInit(): void {
    this.checkConnectivity();
    setInterval(() => {
      this.checkConnectivity()
    }, 100);
  }

  private checkConnectivity() : void {
    this.setOnline(ipcRenderer.sendSync('is-online'));
  }

  public setOnline(online : boolean) : void {
    if (this.online == undefined && online) 
      this.onLoadOnline();
    else if (!this.online && online) 
      this.onTurnOnline();
    else if (this.online == undefined && !online)
      this.onLoadOffline();
    else if (this.online && !online) 
      this.onTurnOffLine();

    this.online = online;
  }

  private onLoadOnline() : void { 
    this.visible = false;
    this.noSpace = true;
    this.draggable = false;
  } 

  private onTurnOnline() : void {
    this.hidePanelAfter(3500);
  }

  private onLoadOffline() : void {
    this.visible = true;
    this.noSpace = false;
    this.draggable = true;
  }

  private onTurnOffLine() : void {
    this.visible = true;
    this.noSpace = false;
    this.draggable = true;
    this.statusText = this.translate.instant('DISCONNECTED.STATUS-CHANGED');

    AnimateCSS.animate('#disconnected-container', 'fadeIn').then((_message) => {
      console.log("ANIMATED fadeIn!");
    })
  }

  openWebsite(suburl : string) : void {
    shell.openExternal(LauncherConfig.WEBSITE + suburl);
  }

  private hidePanelAfter(ms : number) : void {
    setTimeout(() => {
      if (!this.online)
        return;

      this.draggable = false;

      /*const element : any = document.querySelector('#disconnected-container');
      element.classList.add('animated', 'fadeOut');*/
      AnimateCSS.animate('#disconnected-container', 'fadeOut').then((_message) => {
        console.log("ANIMATED fadeOut!");
        this.visible = false;
        this.noSpace = true;
      })
    }, ms);
  }

  
}
