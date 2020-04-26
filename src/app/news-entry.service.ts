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
    setInterval(() => { this.fetchNews(); }, 1000);
  }

  fetchNews() : void {
    request.get(LauncherConfig.BACKEND_HOST + '/news', (error, response, body) => {
      this.news = [];
      let json = JSON.parse(body);

      json.forEach(obj => {
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
