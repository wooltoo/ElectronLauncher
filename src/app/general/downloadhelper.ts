import { DownloadItem } from 'electron';
import { DownloadCallback } from '../general/downloadcallback';

export class DownloadHelper
{
    downloadConfig : any = {
        url: "",
        downloadFolder: "",
        onProgress: (progress, item) => {
            this.onProgress(progress, item);
        }
    }

    downloadItem : DownloadItem;
    callback : DownloadCallback;

    constructor(callbackI : DownloadCallback) {
        this.callback = callbackI;
    }

    prepare(asset : string, downloadFolder : string) : void
    {
        this.downloadConfig.url = asset;
        this.downloadConfig.downloadFolder = downloadFolder;
    }

    download() : void {
        const { remote } = require('electron');

        remote.require("electron-download-manager").download(this.downloadConfig, function(error, info) {
            if (error) {
                console.log("Error: " + error);
            }
            console.log(info);
        });

        this.onStart();
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
        this.callback.OnDownloadStart();
    }
}