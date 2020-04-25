import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NewsEntryService } from '../news-entry.service';
import { NewsEntry } from '../news-entry';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {

  newsEntries : NewsEntry[];

  constructor(private newsEntryService : NewsEntryService,
              private changeDetectorRef : ChangeDetectorRef) {

  }

  ngOnInit(): void {
    this.getEntries();
    setInterval(() => { this.getEntries(); }, 1000);
  }

  getEntries() : void {
    this.newsEntries = this.newsEntryService.getNews();
    this.changeDetectorRef.detectChanges();
  }
}
