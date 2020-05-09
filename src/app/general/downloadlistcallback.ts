import { DownloadFile } from "./downloadfile";

export interface DownloadListCallback {
    OnNewFilesFetched(downloadFiles : DownloadFile[]) : void;
}