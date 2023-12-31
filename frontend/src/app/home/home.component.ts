import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { DownloadState } from '../general/downloadstate';
import { DownloadListService } from '../download-list.service';
import { LocalStorageService } from 'ngx-webstorage';
import { ClientHelper } from '../general/clienthelper';
import { DownloadInstallState } from '../implementation/downloadinstallstate';
import { spawn } from 'child_process';
import * as path from 'path';
import { LauncherConfig } from '../general/launcherconfig';
import { ComponentRegistryEntry, ComponentRegistry } from '../general/componentregistry';
import { SettingsComponent } from '../settings/settings.component';
import { SettingsManager, Setting } from '../general/settingsmanager';
import { RealmListChanger } from '../general/realmlistchanger';
import { ClientCache } from '../general/clientcache';
import { RealmService } from '../realm.service';
import { DownloadSystem } from '../general/downloadsystem';
import { DownloadListObserver } from '../general/downloadlistobserver';
import { DownloadFile } from '../general/downloadfile';
import { VersionChecker } from '../general/versionchecker';
import { TranslateService } from '@ngx-translate/core';
import { TranslateServiceHolder} from '../general/translateserviceholder';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, DownloadListObserver {
  public state : DownloadState = DownloadState.LOADING;
  public downloadSpeed : string = "9.67 MB/s"
  public progress : string = "10%";
  public progressBarWidth : number = 100;
  public hasFilesToDownload : boolean = false;
  public isInstalling : boolean = false;
  public isUnzipping : boolean = false;
  public buttonText : string = '';
  
  /* Visibility */
  public showPauseButton : boolean = true;
  public showPlayButton : boolean = true;
  public showInterruptButton : boolean = false;
  public showDownloadStats : boolean = true;
  public showDownloadBar : boolean = false;
  public showLanding : boolean = true;
  public showInfo : boolean = false;
  public showSettings : boolean = false;
  public showAddons : boolean = false;

  /* CSS Classes */
  public startButtonReadyCSS : boolean = false;
  
  constructor(
              public cd: ChangeDetectorRef,
              private downloadListService : DownloadListService,
              private localSt : LocalStorageService,
              private realmService : RealmService,
              private translate : TranslateService) 
  {
    TranslateServiceHolder.getInstance().setTranslateService(translate);
    SettingsManager.getInstance().setLocalSt(this.localSt);
    ComponentRegistry.getInstance().register(ComponentRegistryEntry.HOME_COMPONENT, this);
    VersionChecker.setTranslate(this.translate);

    this.translate.get('PRIMARY-BUTTON.TEXT-START').subscribe((result) => {
      this.buttonText = result;
    });
    
    DownloadSystem.getInstance()
      .setDownloadListService(downloadListService)
      .setInstallState(new DownloadInstallState(
        this,
        this.localSt,
        this.downloadListService,
      ));

    downloadListService.observe(this);

    setInterval(() => {
      console.log("STATE: " + this.state);
    }, 100);
  }

  ngOnInit(): void {
    if (LauncherConfig.FORCE_LANDING_SCREEN)
      ClientHelper.getInstance().clearClientDirectory();

    this.checkIfClientHasBeenDeleted();

    if (!LauncherConfig.FORCE_LANDING_SCREEN && ClientHelper.getInstance().hasClientInstalled()) 
      this.hideLanding();

    VersionChecker.check();
  }

  OnNewFilesFetched(downloadFiles: DownloadFile[]): void { }

  StartDownload()
  {
    DownloadSystem.getInstance().queuePatches();
  }

  StartGame() : void {
    let dir : string | undefined | null = ClientHelper.getInstance().getClientDirectory()
    if (!dir)
      throw new Error('Could not start Wow.exe because the game client directory could not be located');

    let changer = new RealmListChanger();
    changer.setRealmList(this.realmService.getRealms()[0].getRealmList());

    let cache = new ClientCache();
    cache.clean();

    let cmd = path.join(dir, 'Wow.exe');
    spawn(cmd, [], {detached: true});
  }

  // Called when the landing component picks a already installed game path.
  public OnPickGamePath(path : string) : void {
    ClientHelper.getInstance().setClientDirectory(path);
    DownloadSystem.getInstance().queuePatches();
    this.hideLanding();
  }

  // Called when the landing component requests the client to be downloaded.
  // path = selected client directory.
  public OnSelectClientDownload(path : string) : void {
    ClientHelper.getInstance().setRequestedClientDirectory(path);
    DownloadSystem.getInstance().queueClient();
    this.hideLanding();
  }

  public OnPressCogwheelButton() : void {
    if (this.showLanding) return;

    this.showSettingsPage();
  }

  public OnPressHomeButton() : void {
    if (this.showLanding) return;

    this.showInfoPage();
  }

  public OnPressAddonsButton() : void {
    if (this.showLanding) return;

    this.showAddonsPage();
  }

  OnPressStartButton() {
    if (this.hasFilesToDownload) {
      if (this.state == DownloadState.WAITING_FOR_DOWNLOAD)
        this.StartDownload();
      else if (this.state == DownloadState.PAUSED)
        this.OnPressResumeDownload();
    } else 
      this.StartGame();
  }

  OnPressPauseDownload() {
    this.state = DownloadState.PAUSED;
    DownloadSystem.getInstance().pause();
  }

  OnPressResumeDownload() {
    this.state = DownloadState.DOWNLOADING;
    DownloadSystem.getInstance().resume();
  }

  OnPressCancelDownload() {
    this.CancelDownload();
  }

  public getTranslate() : TranslateService {
    return this.translate;
  }

  public CancelDownload() : void {
    this.state = DownloadState.WAITING_FOR_DOWNLOAD;
    DownloadSystem.getInstance().cancel();
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

  private showAddonsPage() : void {
    this.hideAll();
    this.showAddons = true;
  }

  private hideAll() {
    this.showInfo = false;
    this.showLanding = false;
    this.showAddons = false;
    this.hideSettings();
  }

  private hideSettings() {
    let settings : SettingsComponent = <SettingsComponent> ComponentRegistry.getInstance().get(ComponentRegistryEntry.SETTINGS_COMPONENT);
    settings.OnHide();
    this.showSettings = false;
  }

  private checkIfClientHasBeenDeleted() {
    if (!ClientHelper.getInstance().hasClientInstalled())
      return;

    let dir : string | undefined | null = ClientHelper.getInstance().getClientDirectory();
    if (!dir)
      throw new Error('Could not locate installed client directory');

    if (!ClientHelper.hasClientInDirectory(dir)) {
      ClientHelper.getInstance().clearClientDirectory();
    }
  }
}
