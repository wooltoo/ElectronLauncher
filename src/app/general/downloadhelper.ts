import { DownloadItem } from 'electron';
import { DownloadFile } from '../general/downloadfile';
import { FileRemover } from '../general/fileremover'
import { ClientHelper } from './clienthelper';
import { InstallState } from './installstate';
import { ZipInstaller } from './zipinstaller';
import { FileHelper } from './filehelper';
import { ModalComponent } from '../modal/modal.component';
import { ComponentRegistry, ComponentRegistryEntry } from './componentregistry';
import { Setting, SettingsManager } from './settingsmanager';
import { ModalEntrySingle } from './modalentry';
import { Modals } from './modals';
import { TranslateServiceHolder } from './translateserviceholder';
import { TranslateService } from '@ngx-translate/core';
import { DownloadListObserver } from './downloadlistobserver';

export class DownloadHelper implements DownloadListObserver
{
    downloading : boolean = false;

    downloadConfig : any = {
        url: "",
        downloadFolder: "",
        onProgress: (progress: any, item: any) => {
            this.onProgress(progress, item);
        }
    }

    downloadItem : DownloadItem | undefined | null;
    downloadFile : DownloadFile | undefined | null;
    downloadFiles : DownloadFile[] = [];

    isCheckingForFilesToDownload : boolean = false;
    installState : InstallState | undefined;

    constructor() { }

    public setInstallState(installState : InstallState) : void {
        this.installState = installState;
    }

    public queue(items : DownloadFile[]) : void
    {
        items.forEach((item) => {
            this.queueSingle(item);
        });
    }

    public queueSingle(item : DownloadFile, front : boolean = false) : void {
        if (!DownloadFile.existsInArray(item, this.downloadFiles)) 
        {
            if (front) 
                this.downloadFiles.push(item);
            else 
                this.downloadFiles.unshift(item);

            console.log("QUEUEING!" + JSON.stringify(item));

            this.start();
        }
    }

    private start() : void {
        if (this.isDownloading()) 
            return;

        this.downloading = true;
        this.downloadNext();
    }

    public isDownloading() : boolean {
        return this.downloading;
    }

    OnNewFilesFetched(downloadFiles: DownloadFile[]): void { }

    private downloadNext() : void {
        let item : DownloadFile | undefined = this.downloadFiles.pop();
        if (!item && this.downloading)
        {
            this.onFinished();
            return;  
        } 

        console.log("Next to DL:" + item?.getName());
        console.log("REST: " + JSON.stringify(this.downloadFiles));

        if (!item) return;
        this.removeOldFile(item);
        this.downloadFile = item;

        this.downloadWithSpace(
            item,
            this.prepareDownloadConfig(item)
        );
    }

    private downloadWithSpace(file : DownloadFile, downloadConfig : any) : void {
        if (!FileHelper.hasEnoughSpaceFor(file)) {
            this.showNotEnoughSpace();
            return;
        }

        this.startDownload(downloadConfig);
    }

    private startDownload(cDownloadConfig : any) : void {
        const { remote } = require('electron');

        this.onStart();
        remote.require("electron-download-manager").download(cDownloadConfig, (error: string, info: any) => {
            if (error) 
                throw new Error(error);

            if (!this.downloadFile) 
                throw new Error('Attempt to download undefined or null download file.');
            
            if (this.installState)
                this.installState.OnDownloadFileFinished(this.downloadFile);

            console.log("FINISHED DOWNLOADING: " + this.downloadFile.getName());
            this.extract(this.downloadFile);
        });
    }

    private extract(downloadFile : DownloadFile) : void {
        if (!downloadFile.getExtract()) {
            this.extractionComplete();
            console.log("COMPLETED IMMEDIATELY" + downloadFile.getName())
            return;
        }

        console.log("STARTING EXTRACTION OF: " + downloadFile.getName());
        let installer : ZipInstaller = new ZipInstaller(this.installState);
        installer.install(downloadFile, downloadFile.getLocalDirectory(), () => {
            this.extractionComplete();
            console.log("EXTRACTION COMPLETE: " + downloadFile.getName());
        });
    }

    private extractionComplete() : void {
        this.downloadFile = null;
        this.downloadNext();
    }

    public interrupt() : void {
        if (!this.downloadItem)
            return;

        this.downloadFile = null;
        this.downloadItem.cancel();
        this.downloadItem = null;
        this.downloading = false;

        if (this.installState)
            this.installState.OnDownloadInterrupt();
    }

    public pause() : void {
        if (!this.downloadItem)
            return;

        this.downloadItem.pause();

        if (this.installState)
            this.installState.OnDownloadPause();
    }

    public resume() : void {
        if (!this.downloadItem)
            return;

        this.downloadItem.resume();

        if (this.installState)
            this.installState.OnDownloadResume();
    }

    private onProgress(progress: { speedBytes: any; progress: any; }, item: DownloadItem | null | undefined) : void
    {
        if (this.installState) {
            this.installState.OnDownloadSpeedUpdate(progress.speedBytes);
            this.installState.OnDownloadProgressUpdate(progress.progress);
        }
    }

    private onStart() : void {
        if (this.installState)
            this.installState.OnDownloadStart();
    }
    private onFinished() : void {    
        this.downloading = false;
        if (this.installState)
            this.installState.OnDownloadFinished();
    }

    private removeOldFile(downloadFile : DownloadFile) : void {
        if (ClientHelper.getInstance().hasClientInstalled()) {
            FileRemover.removeIfMD5Mismatch(
                downloadFile.getFullLocalPath(),
                downloadFile.getMD5()
            );
        }
    }

    private prepareDownloadConfig(downloadFile : DownloadFile) : any {
        let cDownloadConfig = Object.assign({}, this.downloadConfig);
        cDownloadConfig.url = downloadFile.getResource();
        cDownloadConfig.downloadFolder = downloadFile.getLocalDirectory();
        return cDownloadConfig;
    }

    private showNotEnoughSpace() : void {
        let translate : TranslateService | null = TranslateServiceHolder.getInstance().getService();
        if (!translate)
            throw new Error('Attempted to show error modal translate service was null.');

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
}