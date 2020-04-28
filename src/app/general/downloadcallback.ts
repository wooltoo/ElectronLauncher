import { DownloadFile } from "./downloadfile";

export interface DownloadCallback
{
    OnDownloadStart() : void;
    OnDownloadSpeedUpdate(downloadSpeed) : void;
    OnDownloadProgressUpdate(downloadProgress) : void;
    OnDownloadPause() : void;
    OnDownloadInterrupt() : void;
    OnDownloadResume() : void;
    OnDownloadFileFinished(downloadFile : DownloadFile);
    OnDownloadFinished() : void;
    OnFilesToDownloadResult(hasFilesToCheckForDownload : boolean) : void;
}