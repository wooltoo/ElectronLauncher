import { Component, OnInit } from '@angular/core';
import { NewsEntryService } from '../news-entry.service';
import { NewsEntry } from '../news-entry';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {

  newsEntries : NewsEntry[];

  constructor(private newsEntryService : NewsEntryService) {

  }

  ngOnInit(): void {
    this.getEntries();
  }

  getEntries() : void {
    this.newsEntries = this.newsEntryService.getNews();
  }
}
