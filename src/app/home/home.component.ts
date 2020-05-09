import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { DownloadState } from '../general/downloadstate';
import { DownloadHelper } from '../general/downloadhelper';
import { DownloadListService } from '../download-list.service';
import { LocalStorageService } from 'ngx-webstorage';
import { HomeInstallManager } from '../implementation/homeinstallmanager';
import { ClientHelper } from '../general/clienthelper';
import { ClientInstallState } from '../implementation/clientinstallstate';
import { PatchInstallState } from '../implementation/patchinstallstate';
import { DownloadInstallState } from '../implementation/downloadinstallstate';
import { spawn } from 'child_process';
import * as path from 'path';
import { LauncherConfig } from '../general/launcherconfig';
import { ComponentRegistryEntry, ComponentRegistry } from '../general/componentregistry';
import { SettingsComponent } from '../settings/settings.component';
import { SettingsManager } from '../general/settingsmanager';
import { RealmListChanger } from '../general/realmlistchanger';
import { RealmService } from '../realm.service';
import { DownloadSystem } from '../general/downloadsystem';
import { DownloadListCallback } from '../general/downloadlistcallback';
import { DownloadFile } from '../general/downloadfile';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, DownloadListCallback {
  public downloadHelper : DownloadHelper;
  
  public state : DownloadState = DownloadState.LOADING;
  public downloadSpeed : string = "9.67 MB/s"
  public progress : string = "10%";
  public progressBarWidth : number = 100;
  public hasFilesToDownload : boolean = false;
  public isInstalling : boolean = false;
  public isUnzipping : boolean = false;
  public buttonText : string = "LOADING...";
  
  public showPauseButton : boolean = true;
  public showPlayButton : boolean = true;
  public showInterruptButton : boolean = false;
  public showDownloadStats : boolean = true;
  public showDownloadBar : boolean = false;
  public showLanding : boolean = true;
  public showInfo : boolean = false;
  public showSettings : boolean = false;

  homeInstallManager : HomeInstallManager;

  constructor(
              public cd: ChangeDetectorRef,
              private downloadListService : DownloadListService,
              private localSt : LocalStorageService,
              private realmService : RealmService) 
  {
    SettingsManager.getInstance().setLocalSt(this.localSt);
    ComponentRegistry.getInstance().register(ComponentRegistryEntry.HOME_COMPONENT, this);
    
    DownloadSystem.getInstance().setInstallState(new DownloadInstallState(
      this,
      this.localSt,
      this.downloadListService
    ));

    downloadListService.observe(this);
  }

  ngOnInit(): void {
    if (!LauncherConfig.FORCE_LANDING_SCREEN && ClientHelper.getInstance().hasClientInstalled()) 
      this.hideLanding();
  }

  OnNewFilesFetched(downloadFiles: DownloadFile[]): void {
    console.log("New files to dl?");
    DownloadSystem.getInstance().downloadAll();
  }

  Download()
  {
    if (ClientHelper.getInstance().hasClientInstalled()) {
      DownloadSystem.getInstance().downloadAll();
    }
  }

  StartGame() : void {
    let changer = new RealmListChanger();
    changer.setRealmList(this.realmService.getRealms()[0].getRealmList());

    let cmd = path.join(ClientHelper.getInstance().getClientDirectory(), 'Wow.exe');
    spawn(cmd, [], {detached: true});
  }

  // Called when the landing component picks a already installed game path.
  public OnPickGamePath(path : string) : void {
    ClientHelper.getInstance().setClientDirectory(path);
    DownloadSystem.getInstance().downloadAll();
    this.hideLanding();
  }

  // Called when the landing component requests the client to be downloaded.
  // path = selected client directory.
  public OnSelectClientDownload(path : string) : void {
    this.localSt.store('requestedClientDirectory', path);
    DownloadSystem.getInstance().downloadClient();
  }

  public OnClientInstallStateFinished() : void {
    DownloadSystem.getInstance().downloadAll();
  }

  public OnPressCogwheelButton() : void {
    if (this.showLanding) return;

    this.showSettingsPage();
  }

  public OnPressHomeButton() : void {
    if (this.showLanding) return;

    this.showInfoPage();
  }

  OnPressStartButton() {
    if (this.hasFilesToDownload) {
      if (this.state == DownloadState.WAITING_FOR_DOWNLOAD)
        this.Download();
      else if (this.state == DownloadState.PAUSED)
        this.OnPressResumeDownload();
    } else 
      this.StartGame();
  }

  OnPressPauseDownload() {
    this.state = DownloadState.PAUSED;
    this.downloadHelper.pause();
  }

  OnPressResumeDownload() {
    this.state = DownloadState.DOWNLOADING;
    this.downloadHelper.resume();
  }

  OnPressCancelDownload() {
    this.CancelDownload();
  }

  public CancelDownload() : void {
    this.state = DownloadState.WAITING_FOR_DOWNLOAD;
    this.downloadHelper.interrupt();
  }

  public hideLanding() : void {
    this.showLanding = false;
    this.showInfo = true;
  }

  private showSettingsPage() : void {
    this.hideAll();
    this.showSettings = true;
  }

  private showInfoPage() : void {
    this.hideAll();
    this.showInfo = true;
  }

  private hideAll() {
    this.showInfo = false;
    this.showLanding = false;
    this.hideSettings();
  }

  private hideSettings() {
    let settings : SettingsComponent = <SettingsComponent> ComponentRegistry.getInstance().get(ComponentRegistryEntry.SETTINGS_COMPONENT);
    settings.OnHide();
    this.showSettings = false;
  }
}
