import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LauncherConfig } from '../general/launcherconfig';

const request = require('request');
const { shell } = require('electron')

@Component({
  selector: 'app-disconnected',
  templateUrl: './disconnected.component.html',
  styleUrls: ['./disconnected.component.css']
})
export class DisconnectedComponent implements OnInit {

  online : boolean = false;
  clickThrough : boolean = false;

  statusText : string;

  constructor(private translate : TranslateService) { 
    this.statusText = '';

    translate.get('DISCONNECTED.STATUS').subscribe((result : string) => {
      this.statusText = result;
    });
  }

  ngOnInit(): void {
    this.checkConnectivity();
    setInterval(
      () => { this.checkConnectivity(); },
      LauncherConfig.INTERVAL_CHECK_ONLINE_STATUS
    );
  }

  private checkConnectivity() : void {
    if (!window.navigator.onLine) {
      this.setOnline(false);
      return;
    }

    request.get({
      url: LauncherConfig.BACKEND_HOST + '/reachable',
      timeout: LauncherConfig.MAXIMUM_RESPONSE_TIME_ONLINE,
      json: true,
    }, (_error: any, _response: any, json: undefined) => 
    {
      if (_error) {
        this.setOnline(false);
        return;
      }

      if (json == undefined) {
        this.setOnline(false);
        return;
      }

      this.setOnline(true);
    });
  }

  public setOnline(online : boolean) : void {
    if (!this.online && online) 
      this.onTurnOnline();
    else if (this.online && !online)
      this.onTurnOffLine();

    this.online = online;
  }

  private onTurnOnline() : void {
    this.hidePanelAfter(2000);
  }

  private onTurnOffLine() : void {
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
