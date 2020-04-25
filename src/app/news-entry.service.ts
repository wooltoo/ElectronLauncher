import { Injectable } from '@angular/core';
import { NewsEntry } from './news-entry';
import { AppConfig } from '../environments/environment';

const request = require("request"); // Need to uncomment when running web

@Injectable({
  providedIn: 'root'
})
export class NewsEntryService {

  news : NewsEntry[];

  constructor() {
    this.fetchNews();
    setInterval(() => { this.fetchNews(); }, 1000);
  }

  fetchNews() : void {
    request.get(AppConfig.backend_url + '/news', (error, response, body) => {
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
