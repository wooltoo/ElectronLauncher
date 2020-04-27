import { Injectable } from '@angular/core';
import { NewsEntry } from './news-entry';
import { LauncherConfig } from './general/launcherconfig';

const request = require("request");

@Injectable({
  providedIn: 'root'
})
export class NewsEntryService {

  news : NewsEntry[] = [];

  constructor() {
    this.fetchNews();
    setInterval(() => { this.fetchNews(); }, 100);
  }

  fetchNews() : void {
    request.get({url: LauncherConfig.BACKEND_HOST + '/news', json: true}, (error, response, body) => {
      this.news = [];

      body.forEach(obj => {
        this.news.push(
          new NewsEntry(obj["title"], obj["date"], obj["text"])
        );
      });
    });
  }

  getNews() : NewsEntry[] {
    return this.news;
  }
}
