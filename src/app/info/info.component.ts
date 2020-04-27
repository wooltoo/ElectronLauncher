import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NewsEntryService } from '../news-entry.service';
import { NewsEntry } from '../news-entry';
import { LauncherConfig } from '../general/launcherconfig';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {

  newsEntries : NewsEntry[] = [];
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
    this.newsEntries.length = 0;
    this.newsEntryService.getNews().forEach((entry : NewsEntry) => {
      this.newsEntries.push(entry);
    });

    this.showLoadingSpinner = false;
  }
}
