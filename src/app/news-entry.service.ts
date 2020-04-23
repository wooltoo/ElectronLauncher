import { Injectable } from '@angular/core';
import { NewsEntry } from './news-entry';

@Injectable({
  providedIn: 'root'
})
export class NewsEntryService {

  constructor() { }

  placeHolderText : string = "Suspendisse et rhoncus ligula. Aliquam ac ultrices eros. Fusce a lacus porta, consequat felis iaculis, feugiat diam. Mauris consectetur sodales est condimentum convallis.";

  getNews() : NewsEntry[] {
    return [
      new NewsEntry("TALES OF TIMES", "AUGUST 29, 2018", this.placeHolderText),
      new NewsEntry("TALES OF TIMES", "AUGUST 28, 2018", this.placeHolderText),
      new NewsEntry("TALES OF TIMES", "AUGUST 27, 2018", this.placeHolderText),
    ];
  }
}
