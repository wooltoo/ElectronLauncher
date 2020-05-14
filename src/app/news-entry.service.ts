import { Injectable } from '@angular/core';
import { NewsEntry } from './news-entry';
import { LauncherConfig } from './general/launcherconfig';
import { NewsServiceCallback } from './general/newsservicecallback';

const request = require("request");

@Injectable({
  providedIn: 'root'
})
export class NewsEntryService {

  //Key: News ID, Value: NewsEntry
  news : Object = {};
  callbacks : NewsServiceCallback[] = [];

  constructor() {
    this.fetchNews();

    setInterval(
      () => { this.fetchNews(); }
      , LauncherConfig.INTERVAL_CHECK_FOR_NEWS_REMOTE
    );
  }

  public observe(observer : NewsServiceCallback) {
    this.callbacks.push(observer);
  }

  public fetchNews() : void {
    request.get({url: LauncherConfig.BACKEND_HOST + '/news', json: true}, (error, response, body) => {
      if (body == undefined) {
        console.log("News was undefined.");
        return;
      }

      let hasBeenModified = false;
      let beforeCount = this.getNews().length;

      this.news = [];
      body.forEach(obj => {
        if (!this.news.hasOwnProperty(obj['id'])) {
          this.news[obj['id']] = new NewsEntry(obj['id'], obj['title'], obj['date'], obj['text']);
        } else {
          if (this.updateNewsEntry(obj))
            hasBeenModified = true;
        }
      });

      let addedNewAddon = beforeCount !== this.getNews().length;

      if (addedNewAddon || hasBeenModified) {
        this.notifyNews();
      }
    });
  }

  private updateNewsEntry(obj : any) : boolean {
    let entry : NewsEntry = this.news[obj['id']];

    let modified = false;
    if (entry.getTitle() != obj['title']) {
      entry.setTitle(obj['title']);
      modified = true;
    }

    if (entry.getText() != obj['text']) {
      entry.setText(obj['text']);
      modified = true;
    }

    if (entry.getDateTime() != obj['date']) {
      entry.setDateTime(obj['date']);
      modified = true;
    }

    return modified;
  }

  public getNews() : NewsEntry[] {
    return (<any>Object).values(this.news);
  }

  private notifyNews() : void {
    this.callbacks.forEach((observer : NewsServiceCallback) => {
      observer.OnNewsUpdated(this.getNews());
    });
  }
}
