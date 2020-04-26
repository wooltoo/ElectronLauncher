import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { DownloadItem } from 'electron';
import { DownloadState } from '../general/downloadstate';
//import { DownloadHelper } from '../general/downloadhelper';
import { DownloadCallback } from '../general/downloadcallback';
import { DownloadListService } from '../download-list.service';
//import { DownloadPatchFilter } from '../general/downloadpatchfilter'


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
  //downloadHelper : DownloadHelper;
  //downloadPatchFilter : DownloadPatchFilter;

  showPauseButton : boolean = false;
  showPlayButton : boolean = false;
  showInterruptButton : boolean = false;
  showDownloadStats : boolean = false;
  showDownloadBar : boolean = false;

  hasFilesToDownload : boolean = false;
  
  showLanding : boolean = true;
  showInfo : boolean = false;

  constructor(private router: Router, 
              private cd: ChangeDetectorRef,
              private zone: NgZone,
              private downloadListService : DownloadListService) 
  {
    //this.downloadHelper = new DownloadHelper(this, this.downloadListService);
    //this.downloadPatchFilter = new DownloadPatchFilter(this.downloadListService);
  }

  ngOnInit(): void { }

  OnFilesToDownloadResult(hasFilesToCheckForDownload: boolean): void {
    if (this.hasFilesToDownload)
      return;

    if (hasFilesToCheckForDownload)
    {
      /*if (this.downloadPatchFilter.getPatchesToInstall().length > 0 ) {
        this.state = DownloadState.WAITING_FOR_DOWNLOAD;
        this.buttonText = "UPDATE";
        this.hasFilesToDownload = true;
        return;
      }*/
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
    this.buttonText = "DOWNLOADING";
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
    this.buttonText = "RESUME DOWNLOAD";
  }

  OnDownloadInterrupt(): void {
    this.state = DownloadState.WAITING_FOR_DOWNLOAD;
    this.showPauseButton = false;
    this.showPlayButton = false;
    this.showDownloadStats = false;
    this.showInterruptButton = false;
    this.showDownloadBar = false;
    this.buttonText = "UPDATE";
  }

  OnDownloadResume() : void {
    this.state = DownloadState.DOWNLOADING;
    this.showPauseButton = true;
    this.showPlayButton = false;
    this.showDownloadStats = true;
    this.showInterruptButton = true;
    this.showDownloadBar = true;
    this.buttonText = "DOWNLOADING";
  }

  OnDownloadFinished() : void {
    this.state = DownloadState.COMPLETED;
    this.showPauseButton = false;
    this.showPlayButton = false;
    this.showDownloadStats = false;
    this.showInterruptButton = false;
    this.showDownloadBar = false;
    this.hasFilesToDownload = false;
    this.buttonText = "START GAME";
  }

  download()
  {
    /*this.downloadHelper.prepare(
      //this.downloadListService.getPatches().concat(this.downloadListService.getClient()), 
      this.downloadPatchFilter.getPatchesToInstall(),
      "D:/DownloadTest"
    );

    this.downloadHelper.download();*/
    this.state = DownloadState.DOWNLOADING;
  }

  startGame() : void {

  }

  public OnPickGamePath(path : string) : void {
    this.hideLanding();
  }

  // Called when the landing component requests the client to be downloaded.
  // path = selected client directory.
  public OnSelectClientDownload(path : string) : void {

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
    //this.downloadHelper.pause();
  }

  OnPressResumeDownload() {
    console.log("RESUME PRESSED");
    this.state = DownloadState.DOWNLOADING;
    //this.downloadHelper.resume();
  }

  OnPressCancelDownload() {
    this.state = DownloadState.WAITING_FOR_DOWNLOAD;
    //this.downloadHelper.interrupt();
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
}
