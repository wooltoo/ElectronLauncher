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
import { FileHelper } from './filehelper';
import { ModalComponent } from '../modal/modal.component';
import { ComponentRegistry, ComponentRegistryEntry } from './componentregistry';
import { Setting, SettingsManager } from './settingsmanager';
import { ModalEntrySingle } from './modalentry';
import { Modals } from './modals';
import { TranslateServiceHolder } from './translateserviceholder';
import { TranslateService } from '@ngx-translate/core';

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
        
        this.downloadWithSpace(cDownloadConfig);
    }

    private downloadWithSpace(downloadConfig : any) : void {
        if (FileHelper.hasEnoughSpaceFor(this.downloadFile)) {
            this.startDownload(downloadConfig);
            return;
        }

        let translate : TranslateService = TranslateServiceHolder.getInstance().getService();
        let modalComponent : ModalComponent = <ModalComponent>ComponentRegistry.getInstance().get(ComponentRegistryEntry.MODAL_COMPONENT);
        let modal : ModalEntrySingle = new ModalEntrySingle(
            Modals.DOWNLOAD_HELPER_NOT_ENOUGH_SPACE,
            translate.instant('MODALS.DOWNLOAD-HELPER-NOT-ENOUGH-SPACE.TITLE'),
            translate.instant('MODALS.DOWNLOAD-HELPER-NOT-ENOUGH-SPACE.TEXT'),
            translate.instant('MODALS.DOWNLOAD-HELPER-NOT-ENOUGH-SPACE.BUTTON-SINGLE'),
            () => {
                SettingsManager.getInstance().setSetting(Setting.SHOULD_AUTO_PATCH, false);
            }
        );
        modalComponent.enqueue(modal);
    }

    private startDownload(cDownloadConfig : any) : void {
        const { remote } = require('electron');

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
        this.callback.OnDownloadInterrupt();
    }

    public pause() : void {
        if (this.downloadItem == null)
            return;

        this.downloadItem.pause();
        this.callback.OnDownloadPause();
    }

    public resume() : void {
        if (this.downloadItem == null)
            return;

        this.downloadItem.resume();
        this.callback.OnDownloadResume();
    }

    private onProgress(progress, item) : void
    {
        this.downloadItem = item;
        this.callback.OnDownloadSpeedUpdate(progress.speedBytes);
        this.callback.OnDownloadProgressUpdate(progress.progress);
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