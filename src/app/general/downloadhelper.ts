import { DownloadItem, webContents } from 'electron';
import { DownloadFile } from '../general/downloadfile';
import { DownloadListService } from '../download-list.service';
import { DownloadListServiceState } from './downloadlistservicestate';
import { LauncherConfig } from './launcherconfig'
import { FileRemover } from '../general/fileremover'
import { ClientHelper } from './clienthelper';
import { InstallState } from './installstate';
import { ZipInstaller } from './zipinstaller';
import { DownloadFileFilter } from './downloadfilefilter';

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
    downloadFile : DownloadFile;
    downloadFiles : DownloadFile[] = [];

    constructor(private callback : InstallState, private downloadListService : DownloadListService) { 
        this.checkForFilesToDownload();
        this.checkForFilesToDownloadWrapper();
        this.downloadConfig.downloadFolder = ClientHelper.getInstance().getClientDirectory();
    }

    public add(items : DownloadFile[]) : void
    {
        items.forEach((item) => {
            this.addSingle(item);
        });
    }

    public addSingle(item : DownloadFile) : void {
        if (!DownloadFile.existsInArray(item, this.downloadFiles))
            this.downloadFiles.push(item);
    }

    public download() : void {
        if (this.downloadFiles.length > 0)
            this.downloadNext();
    }

    public isDownloading() : boolean {
        return this.downloading;
    }

    private checkForFilesToDownload() : void {
        if (!ClientHelper.getInstance().hasClientInstalled())
            return;

        if (this.downloadListService.getState() == DownloadListServiceState.READY) {
            let filter : DownloadFileFilter = new DownloadFileFilter(this.downloadListService);
            this.callback.OnFilesToDownloadResult(
                filter.getFilesToInstall().length > 0
            );
        }
    }

    private checkForFilesToDownloadWrapper() : void {
        setInterval(() => {
            this.checkForFilesToDownload();
        }, LauncherConfig.INTERVAL_CHECK_FOR_PATCH_TO_DL);
    }

    private downloadNext() : void {
        const { remote } = require('electron');

        let item : DownloadFile = this.downloadFiles.pop();
        if (item == undefined || item == null && this.downloading)
        {
            this.onFinished();
            return;  
        } 

        if (ClientHelper.getInstance().hasClientInstalled()) {
            FileRemover.removeIfMD5Mismatch(
                item.getFullLocalPath(),
                item.getMD5()
            );
        }

        this.downloadFile = item;
        let cDownloadConfig = Object.assign({}, this.downloadConfig);
        cDownloadConfig.url = item.getResource();
        cDownloadConfig.downloadFolder = item.getLocalDirectory();
        
        this.onStart();
        remote.require("electron-download-manager").download(cDownloadConfig, (error, info) => {
            if (error) console.log("Error: " + error);
            
            this.callback.OnDownloadFileFinished(this.downloadFile);
            this.extract(this.downloadFile);
        });
    }

    private extract(downloadFile : DownloadFile) : void {
        if (!downloadFile.getExtract()) {
            this.extractionComplete();
            return;
        }

        let installer : ZipInstaller = new ZipInstaller(this.callback);
        installer.install(downloadFile, downloadFile.getLocalDirectory(), () => {
            this.extractionComplete();
        });
    }

    private extractionComplete() : void {
        this.downloadFile = null;
        this.downloadNext();
    }

    public interrupt() : void {
        if (this.downloadItem == null || this.downloadItem == undefined)
            return;

        this.downloadFile = null;
        this.downloadItem.cancel();
        this.downloadItem = null;
        this.downloading = false;
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
        console.log("FINISHED!");
        this.downloading = false;
        this.callback.OnDownloadFinished();
    }
}