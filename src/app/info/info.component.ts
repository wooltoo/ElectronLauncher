import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NewsEntryService } from '../news-entry.service';
import { NewsEntry } from '../news-entry';
import { LauncherConfig } from '../general/launcherconfig';
import {DomSanitizer} from '@angular/platform-browser';

const request = require('request');

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {

  newsEntries : NewsEntry[] = [];
  showLoadingSpinner : boolean = true;
  videoUrl : string;
  video : any;

  constructor(private newsEntryService : NewsEntryService,
              private changeDetectorRef : ChangeDetectorRef,
              private sanitizer : DomSanitizer) 
  {
    this.setVideo(LauncherConfig.DEFAULT_YOUTUBE_VIDEO);

    this.checkForYoutubeVideo();
    this.startCheckForYoutubeVideo();
  }

  ngOnInit(): void {
    setTimeout(() => { this.getEntries(); }, 1000);
    setInterval(
      () => { this.getEntries(); },
      LauncherConfig.INTERVAL_CHECK_FOR_NEWS
    );
  }

  private setVideo(url : string) {
    if (this.videoUrl == url)
      return;

    console.log("Setting video!");
    this.videoUrl = url;
    this.video = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  getEntries() : void {
    let news : NewsEntry[] = this.newsEntryService.getNews();
    if (!this.differsFromLoaded(news)) 
      return;

    this.newsEntries.length = 0;
    news.forEach((entry : NewsEntry) => {
      this.newsEntries.push(entry);
    });

    this.showLoadingSpinner = false;
  }

  private differsFromLoaded(news : NewsEntry[]) : boolean {
    if (news == undefined || news == null)
      return false;

    if (this.newsEntries.length != news.length)
      return true;

    for(let i = 0; i < this.newsEntries.length; i++) {
      let timeDiffer = news[i].getDateTime() != this.newsEntries[i].getDateTime();
      let textDiffer = news[i].getText() != this.newsEntries[i].getText();
      let titleDiffer = news[i].getTitle() != this.newsEntries[i].getTitle()

      if (timeDiffer || textDiffer || titleDiffer)
        return true;
    }

    return false;
  }

  private checkForYoutubeVideo() {
    request.get({
      url: LauncherConfig.BACKEND_HOST + '/youtube-video',
      json: true
    }, (error, response, json) => {
      if (json == undefined) {
        console.log("Fetch youtube video response was undefined!");
        return;
      }

      this.setVideo(json['video']);
    });
  }

  private startCheckForYoutubeVideo() {
    setInterval(
      () => { this.checkForYoutubeVideo() },
      LauncherConfig.INTERVAL_CHECK_FOR_YOUTUBE_VIDEO
    );
  }
}
