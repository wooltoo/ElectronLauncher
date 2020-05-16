import { DownloadFile } from "./downloadfile";

export interface DownloadCallback
{
    OnDownloadStart() : void;
    OnDownloadSpeedUpdate(downloadSpeed: any) : void;
    OnDownloadProgressUpdate(downloadProgress: any) : void;
    OnDownloadPause() : void;
    OnDownloadInterrupt() : void;
    OnDownloadResume() : void;
    OnDownloadFileFinished(downloadFile : DownloadFile) : void;
    OnDownloadFinished() : void;
    OnFilesToDownloadResult(hasFilesToCheckForDownload : boolean) : void;
}