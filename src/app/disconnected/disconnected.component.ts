import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LauncherConfig } from '../general/launcherconfig';
import { ipcRenderer } from 'electron';

const request = require('request');
const { shell } = require('electron')

@Component({
  selector: 'app-disconnected',
  templateUrl: './disconnected.component.html',
  styleUrls: ['./disconnected.component.css']
})
export class DisconnectedComponent implements OnInit {

  online : boolean | undefined;
  clickThrough : boolean = true;
  visible : boolean = false;

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

  private onLoadOnline() : void { } 

  private onTurnOnline() : void {
    this.hidePanelAfter(2000);
  }

  private onLoadOffline() : void {
    this.visible = true;
    this.clickThrough = false;
  }

  private onTurnOffLine() : void {
    this.visible = true;
    this.clickThrough = false;
    this.statusText = this.translate.instant('DISCONNECTED.STATUS-CHANGED');
    const element : any = document.querySelector('#disconnected-container');
    element.classList.remove('animated', 'fadeOut');
    element.classList.add('animated', 'fadeIn');
    this.clickThrough = false;
  }

  openWebsite(suburl : string) : void {
    shell.openExternal(LauncherConfig.WEBSITE + suburl);
  }

  private hidePanelAfter(ms : number) : void {
    setTimeout(() => {
      if (!this.online)
        return;

      const element : any = document.querySelector('#disconnected-container');
      element.classList.add('animated', 'fadeOut');
      this.clickThrough = true;
    }, ms);
  }
}
