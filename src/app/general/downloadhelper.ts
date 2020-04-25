import { DownloadItem, webContents } from 'electron';
import { DownloadCallback } from '../general/downloadcallback';
import { DownloadFile } from '../general/downloadfile';

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
    downloadFiles : DownloadFile[] = [];

    constructor(private callback : DownloadCallback) { }

    prepare(items : DownloadFile[], downloadFolder : string) : void
    {
        this.downloadFiles = items;
        this.downloadConfig.downloadFolder = downloadFolder;
    }

    download() : void {
        this.downloadNext();
    }

    downloadNext() : void {
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
            
            this.downloadNext();
        });
    }

    interrupt() : void {
        if (this.downloadItem == null)
            return;

        this.downloadItem.cancel();
        this.onInterrupt();
    }

    pause() : void {
        if (this.downloadItem == null)
            return;

        this.downloadItem.pause();
        this.onPause();
    }

    resume() : void {
        if (this.downloadItem == null)
            return;

        this.downloadItem.resume();
        this.onResume();
    }

    onProgress(progress, item) : void
    {
        this.downloadItem = item;
        this.onDownloadSpeedUpdate(progress.speedBytes);
        this.onDownloadProgressUpdate(progress.progress)
    }

    onDownloadSpeedUpdate(downloadSpeed) : void {
        this.callback.OnDownloadSpeedUpdate(downloadSpeed);
    }

    onDownloadProgressUpdate(progress) : void {
        this.callback.OnDownloadProgressUpdate(progress);
    }

    onPause() : void {
        this.callback.OnDownloadPause();
    }

    onInterrupt() : void {
        this.callback.OnDownloadInterrupt();
    }

    onResume() : void {
        this.callback.OnDownloadResume();
    }

    onStart() : void {
        this.downloading = true;
        this.callback.OnDownloadStart();
    }

    onFinished() : void {
        this.downloading = false;
        this.callback.OnDownloadFinished();
    }
}