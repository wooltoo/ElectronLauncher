import { DownloadItem, webContents } from 'electron';
import { DownloadCallback } from '../general/downloadcallback';
import { DownloadFile } from '../general/downloadfile';
import { DownloadListService } from '../download-list.service';
import { DownloadListServiceState } from './downloadlistservicestate';

export class DownloadHelper
{
    downloading : boolean = false;

    downloadConfig : any = {
        url: "",
        downloadFolder: "",
        onProgress: (progress, item) => {
            this.onProgress(progress, item);
        }
    }

    downloadItem : DownloadItem;
    downloadItemName : string;

    downloadFiles : DownloadFile[] = [];

    constructor(private callback : DownloadCallback, private downloadListService : DownloadListService) { }

    public prepare(items : DownloadFile[], downloadFolder : string) : void
    {
        console.log("### PREPARE BEGIN");
        this.downloadFiles = items;
        this.downloadConfig.downloadFolder = downloadFolder;
        console.log(this.downloadFiles);
        console.log("### PREPARE END");
    }

    public download() : void {
        this.downloadNext();
    }

    public checkForFilesToDownload() : void {
        let handle = setInterval(() => {
            if (this.downloadListService.getState() == DownloadListServiceState.READY) {
                this.callback.OnFilesToDownloadResult(
                    this.downloadListService.getPatches().length > 0
                );
                clearInterval(handle);
            }
        }, 100);
    }

    private downloadNext() : void {
        const { remote } = require('electron');

        let item : DownloadFile = this.downloadFiles.pop();
        if (item == null && this.downloading)
        {
            this.onFinished();
            return;  
        } 

        let cDownloadConfig = Object.assign({}, this.downloadConfig);
        cDownloadConfig.url = item.getResource();

        this.onStart();
        remote.require("electron-download-manager").download(cDownloadConfig, (error, info) => {
            if (error) console.log("Error: " + error);

            this.downloadItemName = null;
            this.downloadNext();
        });
    }

    public interrupt() : void {
        if (this.downloadItem == null)
            return;

        this.downloadItem.cancel();
        this.onInterrupt();
    }

    public pause() : void {
        if (this.downloadItem == null)
            return;

        this.downloadItem.pause();
        this.onPause();
    }

    public resume() : void {
        if (this.downloadItem == null)
            return;

        this.downloadItem.resume();
        this.onResume();
    }

    private onProgress(progress, item) : void
    {
        this.downloadItem = item;
        this.downloadItemName = this.downloadItem.getFilename();
        this.onDownloadSpeedUpdate(progress.speedBytes);
        this.onDownloadProgressUpdate(progress.progress)
    }

    private onDownloadSpeedUpdate(downloadSpeed) : void {
        this.callback.OnDownloadSpeedUpdate(downloadSpeed);
    }

    private onDownloadProgressUpdate(progress) : void {
        this.callback.OnDownloadProgressUpdate(progress);
    }

    private onPause() : void {
        this.callback.OnDownloadPause();
    }

    private onInterrupt() : void {
        this.callback.OnDownloadInterrupt();
    }

    private onResume() : void {
        this.callback.OnDownloadResume();
    }

    private onStart() : void {
        this.downloading = true;
        this.callback.OnDownloadStart();
    }

    private onFinished() : void {
        this.downloading = false;
        this.callback.OnDownloadFinished();
    }
}