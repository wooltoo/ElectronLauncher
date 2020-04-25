import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { DownloadItem } from 'electron';
import { DownloadState } from '../general/downloadstate';
//import { DownloadHelper } from '../general/downloadhelper';
import { DownloadCallback } from '../general/downloadcallback';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, DownloadCallback {

  state : DownloadState = DownloadState.WAITING_FOR_DOWNLOAD;

  downloadItem : DownloadItem;

  downloadSpeed : string = "9.67 MB/s"
  progress : string = "10%";
  progressBarWidth : number = 100;

  buttonText : string = "DOWNLOAD";
  //downloadHelper : DownloadHelper;

  showPauseButton : boolean = false;
  showPlayButton : boolean = false;
  showInterruptButton : boolean = false;
  showDownloadStats : boolean = false;
  showDownloadBar : boolean = false;

  constructor(private router: Router, 
              private cd: ChangeDetectorRef,
              private zone: NgZone) 
  {
    //this.downloadHelper = new DownloadHelper(this);
  }

  ngOnInit(): void { }

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
    this.state = DownloadState.INTERRUPTED;
    this.showPauseButton = false;
    this.showPlayButton = false;
    this.showDownloadStats = false;
    this.showInterruptButton = false;
    this.showDownloadBar = false;
    this.buttonText = "DOWNLOAD";
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

  download()
  {
    ///Users/fredrik/Desktop/DownloadTest
    if (this.state == DownloadState.WAITING_FOR_DOWNLOAD || this.state == DownloadState.INTERRUPTED)
    {
      /*this.downloadHelper.prepare(
        "https://dl.paragon-servers.com/Paragon_3.3.5a_Win.zip", 
        "D:/DownloadTest"
      );
      this.downloadHelper.download();*/
    } else if (this.state == DownloadState.PAUSED)
    {
      this.OnPressResumeDownload();
    }
  }

  OnPressPauseDownload() {
    //this.downloadHelper.pause();
  }

  OnPressResumeDownload() {
    //this.downloadHelper.resume();
  }

  OnPressCancelDownload() {
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
}
