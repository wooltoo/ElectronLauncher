import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { DownloadItem } from 'electron';
import { DownloadState } from '../general/downloadstate';
import { DownloadHelper } from '../general/downloadhelper';
import { DownloadCallback } from '../general/downloadcallback';
import { DownloadListService } from '../download-list.service';
import { DownloadPatchFilter } from '../general/downloadpatchfilter'
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, DownloadCallback {

  state : DownloadState = DownloadState.LOADING;

  downloadItem : DownloadItem;
  downloadSpeed : string = "9.67 MB/s"
  progress : string = "10%";
  progressBarWidth : number = 100;

  buttonText : string = "LOADING...";
  downloadHelper : DownloadHelper;
  downloadPatchFilter : DownloadPatchFilter;
  hasFilesToDownload : boolean = false;
  isInstalling : boolean = false;

  showPauseButton : boolean = true;
  showPlayButton : boolean = true;
  showInterruptButton : boolean = false;
  showDownloadStats : boolean = true;
  showDownloadBar : boolean = false;
  showLanding : boolean = true;
  showInfo : boolean = false;
  showSettings : boolean = false;

  constructor(private router: Router, 
              private cd: ChangeDetectorRef,
              private zone: NgZone,
              private downloadListService : DownloadListService,
              private localSt : LocalStorageService) 
  {
    this.downloadHelper = new DownloadHelper(this, this.downloadListService);
    this.downloadPatchFilter = new DownloadPatchFilter(this.downloadListService);
  }

  ngOnInit(): void {
    this.localSt.clear('clientDirectory');
    if (this.hasClientInstalled()) 
      this.hideLanding();
  }

  OnFilesToDownloadResult(hasFilesToCheckForDownload: boolean): void {
    if (this.hasFilesToDownload)
      return;

    if (hasFilesToCheckForDownload)
    {
      let clientDir = this.localSt.retrieve('clientDirectory');
      if (this.downloadPatchFilter.getPatchesToInstall(clientDir).length > 0) {
        this.scheduleDownload();
        return;
      }
    }

    this.buttonText = "START GAME";
  }

  OnDownloadStart() : void {
    this.state = DownloadState.DOWNLOADING;
    this.downloadSpeed = "0.00 MB/s"
    this.progress = "0.00%";
    this.progressBarWidth = 0;
    this.showPauseButton = true;
    this.showInterruptButton = true;
    this.showPlayButton = false;
    this.showDownloadStats = true;
    this.showDownloadBar = true;
    this.buttonText = this.getButtonText();
  }

  OnDownloadSpeedUpdate(downloadSpeed: any): void {
    this.downloadSpeed = this.formatDownloadSpeed(downloadSpeed);
  }

  OnDownloadProgressUpdate(downloadProgress: any): void {
    this.progressBarWidth = downloadProgress;
    this.progress = this.formatProgress(downloadProgress);
    this.cd.detectChanges(); 
  }

  OnDownloadPause(): void {
    this.state = DownloadState.PAUSED;
    this.showPauseButton = false;
    this.showPlayButton = true;
    this.showInterruptButton = true;
    this.showDownloadStats = true;
    this.showDownloadBar = true;
    this.buttonText = this.getButtonText();
  }

  OnDownloadInterrupt(): void {
    this.state = DownloadState.WAITING_FOR_DOWNLOAD;
    this.showPauseButton = false;
    this.showPlayButton = false;
    this.showDownloadStats = false;
    this.showInterruptButton = false;
    this.showDownloadBar = false;
    this.buttonText = this.getButtonText();
  }

  OnDownloadResume() : void {
    this.state = DownloadState.DOWNLOADING;
    this.showPauseButton = true;
    this.showPlayButton = false;
    this.showDownloadStats = true;
    this.showInterruptButton = true;
    this.showDownloadBar = true;
    this.buttonText = this.getButtonText();
  }

  OnDownloadItemFinished(name : string) : void {
    console.log("finished dl" + name);
  }

  OnDownloadFinished() : void {
    this.state = DownloadState.COMPLETED;
    this.showPauseButton = false;
    this.showPlayButton = false;
    this.showDownloadStats = false;
    this.showInterruptButton = false;
    this.showDownloadBar = false;
    this.hasFilesToDownload = false;
    this.buttonText = this.getButtonText();
    this.isInstalling = false;
  }

  download()
  {
    if (this.hasClientInstalled()) {
      console.log("DOWNLOAD PATCHES!");
      this.downloadPatches();
    } else {
      console.log("DOWNLOAD CLIENT!");
      this.downloadClient();
    }
  }

  downloadPatches() : void {
    let clientDir = this.localSt.retrieve('clientDirectory');
    this.downloadHelper.prepare(
      this.downloadPatchFilter.getPatchesToInstall(clientDir),
      clientDir
    );

    this.downloadHelper.download();
    this.state = DownloadState.DOWNLOADING;
  }

  downloadClient() : void {
    let clientTargetDir = this.localSt.retrieve('requestedClientDirectory');
    this.downloadHelper.prepare(
      [this.downloadListService.getClient()],
      clientTargetDir,
    );

    this.downloadHelper.download();
    this.state = DownloadState.DOWNLOADING;
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
    this.state = DownloadState.WAITING_FOR_DOWNLOAD;
    this.isInstalling = true;
    this.localSt.store('requestedClientDirectory', path);
    this.scheduleDownload();
    this.buttonText = this.getButtonText();
    this.hideLanding();
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

  formatProgress(progress : string) : string {
    const number = Number(progress);
    return number.toFixed(2).toString() + "%";
  }

  formatDownloadSpeed(downloadSpeed) : string {
    let downloadSpeedNum = Number(downloadSpeed) / Math.pow(1024,2);
    return downloadSpeedNum.toFixed(2).toString() + " MB/s";
  }

  private hideLanding() : void {
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

  private scheduleDownload() : void {
    this.state = DownloadState.WAITING_FOR_DOWNLOAD;
    this.buttonText = this.getButtonText();    
    this.hasFilesToDownload = true;
  }

  private getButtonText() : string {
    if (this.state == DownloadState.DOWNLOADING)
      return "DOWNLOADING";
    else if (this.state == DownloadState.PAUSED)
      return "RESUME DOWNLOAD";
    else if (this.state == DownloadState.COMPLETED)
      return "START GAME";
    else if (this.state == DownloadState.WAITING_FOR_DOWNLOAD) {
      return this.isInstalling ? "INSTALL" : "UPDATE";
    }
  }
  
  private hasClientInstalled() : boolean {
    return this.localSt.retrieve('clientDirectory') != null
  }
}
