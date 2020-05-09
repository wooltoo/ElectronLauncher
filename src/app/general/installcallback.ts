import { DownloadFile } from "./downloadfile";

export interface InstallCallback {
    OnInstallExtractionBegin() : void;
    OnInstallExtractionCompleted(downloadFile: DownloadFile) : void;

    // progress: In percentage, 0 to 1.
    OnInstallProgressUpdate(downloadFile: DownloadFile, progress: number, currFile: number, fileCount: number) : void; 
}