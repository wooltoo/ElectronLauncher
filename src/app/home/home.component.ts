import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { DownloadItem } from 'electron';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  zone : NgZone;
  cd : ChangeDetectorRef;
  downloadItem : DownloadItem;

  downloadSpeed : string = "9.67 MB/s"
  progress : string = "10%";
  progressBarWidth : number = 100;

  hasBegunDownloading : boolean = false;
  isDownloading : boolean = false;

  constructor(private router: Router, 
              private cdI: ChangeDetectorRef,
              private zoneI: NgZone) 
  {
    this.cd = cdI;
    this.zone = zoneI;
  }

  ngOnInit(): void { }

  download()
  {
    const { remote } = require('electron');
    const asset = "https://dl.paragon-servers.com/Paragon_3.3.5a_Win.zip";
    const target = "/Users/fredrik/Desktop/DownloadTest";
    
    this.downloadSpeed = "0 MB/s";
    this.progress = "0.00%";
    this.progressBarWidth = 0;
    this.hasBegunDownloading = true;
    this.isDownloading = true;

    remote.require("electron-download-manager").download({
      url: asset,
      downloadFolder: target,
      onProgress: (progress, item) => {
        this.onProgress(progress, item);
      }
    }, function(error, info) {
      if (error) {
        console.log("Error: " + error);
      }
      console.log(info);
    });
  }

  onPauseDownload() {
    if (this.downloadItem == null) 
      return;

    this.downloadItem.pause();
    this.isDownloading = false;
  }

  onResumeDownload() {
    if (this.downloadItem == null)
      return;

    this.downloadItem.resume();
    this.isDownloading = true;
  }

  onCancelDownload() {
    if (this.downloadItem == null)
      return;

    this.downloadItem.cancel();
    this.downloadSpeed = "0.0 MB/s";
    this.progress = "0.00%";
    this.downloadItem = null;
    this.isDownloading = false;
    this.hasBegunDownloading = false;
    this.progressBarWidth = 0;
  }

  onProgress(progress, item) {
    this.downloadItem = item;
    this.downloadSpeed = progress.speed;
    this.progressBarWidth = progress.progress;
    this.progress = this.formatProgress(progress.progress);
    this.cd.detectChanges(); // this line causes the obnoxious terminal output of rendering thread
  }

  formatProgress(progress : string) : string {
    const number = Number(progress);
    return number.toFixed(2).toString() + "%";
  }
}
