import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NewsEntryService } from '../news-entry.service';
import { NewsEntry } from '../news-entry';
import { LauncherConfig } from '../general/launcherconfig';
import { TouchBarSlider } from 'electron';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {

  newsEntries : NewsEntry[] = null;
  showLoadingSpinner : boolean = true;

  constructor(private newsEntryService : NewsEntryService,
              private changeDetectorRef : ChangeDetectorRef) {

  }

  ngOnInit(): void {
    setTimeout(() => { this.getEntries(); }, 200);
    setInterval(
      () => { this.getEntries(); },
      LauncherConfig.INTERVAL_CHECK_FOR_NEWS
    );
  }

  getEntries() : void {
    let news : NewsEntry[] = this.newsEntryService.getNews();
    if (!this.differsFromLoaded(news)) 
      return;

    this.newsEntries = [];
    this.newsEntries.length = 0;
    news.forEach((entry : NewsEntry) => {
      this.newsEntries.push(entry);
    });

    this.showLoadingSpinner = false;
  }

  private differsFromLoaded(news : NewsEntry[]) : boolean {
    if (news == undefined || news == null)
      return false;

    if (this.newsEntries == null)
      return true;

    for(let i = 0; i < this.newsEntries.length; i++) {
      if (news[i].getDateTime() != this.newsEntries[i].getDateTime() ||
          news[i].getText() != this.newsEntries[i].getText() ||
          news[i].getTitle() != this.newsEntries[i].getText())
          return true;
    }

    return false;
  }
}
