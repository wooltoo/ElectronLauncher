import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { DownloadState } from '../general/downloadstate';
import { DownloadHelper } from '../general/downloadhelper';
import { DownloadListService } from '../download-list.service';
import { LocalStorageService } from 'ngx-webstorage';
import { HomeInstallManager } from '../implementation/homeinstallmanager';
import { ClientHelper } from '../general/clienthelper';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public downloadHelper : DownloadHelper;
  
  public state : DownloadState = DownloadState.LOADING;
  public downloadSpeed : string = "9.67 MB/s"
  public progress : string = "10%";
  public progressBarWidth : number = 100;
  public hasFilesToDownload : boolean = false;
  public isInstalling : boolean = false;
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

  constructor(private router: Router, 
              public cd: ChangeDetectorRef,
              private zone: NgZone,
              private downloadListService : DownloadListService,
              private localSt : LocalStorageService) 
  {
    ClientHelper.getInstance().setLocalSt(this.localSt);

    this.homeInstallManager = new HomeInstallManager(
      this, 
      this.downloadListService,
      this.localSt
    );

    this.downloadHelper = new DownloadHelper(this.homeInstallManager, this.downloadListService);
  }

  ngOnInit(): void {
    this.localSt.clear('clientDirectory');
    if (ClientHelper.getInstance().hasClientInstalled()) 
      this.hideLanding();
  }

  download()
  {
    if (ClientHelper.getInstance().hasClientInstalled()) {
      console.log("DOWNLOAD PATCHES!");
      this.homeInstallManager.downloadPatches();
    } else {
      console.log("DOWNLOAD CLIENT!");
      this.homeInstallManager.downloadClient();
    }
  }

  startGame() : void {

  }

  public OnPickGamePath(path : string) : void {
    this.isInstalling = true;
    this.hideLanding();
    this.buttonText = "INSTALL";
    this.localSt.store('clientDirectory', path);
  }

  // Called when the landing component requests the client to be downloaded.
  // path = selected client directory.
  public OnSelectClientDownload(path : string) : void {
    this.homeInstallManager.OnSelectClientDownload(path);
  }

  public OnPressCogwheelButton() : void {
    if (this.showLanding)
      return;

    this.showSettingsPage();
  }

  public OnPressHomeButton() : void {
    if (this.showLanding)
      return;

    this.showInfoPage();
  }

  OnPressStartButton() {
    if (this.hasFilesToDownload) {
      if (this.state == DownloadState.WAITING_FOR_DOWNLOAD)
        this.download();
      else if (this.state == DownloadState.PAUSED)
        this.OnPressResumeDownload();
    } 

    this.startGame();
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
    this.showSettings = false;
  }

  public getButtonText() : string {
    if (this.state == DownloadState.DOWNLOADING)
      return "DOWNLOADING";
    else if (this.state == DownloadState.PAUSED)
      return "RESUME DOWNLOAD";
    else if (this.state == DownloadState.COMPLETED)
      return "START GAME";
    else if (this.state == DownloadState.WAITING_FOR_DOWNLOAD) 
      return this.isInstalling ? "INSTALL" : "UPDATE";
    else if (this.state == DownloadState.INSTALLING) 
      return "INSTALLING";
  }
}
