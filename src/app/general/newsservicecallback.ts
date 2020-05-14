import { NewsEntry } from '../news-entry';

export interface NewsServiceCallback {
    OnNewsUpdated(news : NewsEntry[]) : void;
}