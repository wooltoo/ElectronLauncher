import { DownloadFile } from "./downloadfile";

export interface DownloadListObserver {
    OnNewFilesFetched(downloadFiles : DownloadFile[]) : void;
}