import { DownloadItem } from 'electron';
import { DownloadFile } from '../general/downloadfile';
import { DownloadListService } from '../download-list.service';
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

    constructor(private downloadListService : DownloadListService) { 
        downloadListService.observe(this);
        this.downloadConfig.downloadFolder = ClientHelper.getInstance().getClientDirectory();
    }

    public setInstallState(installState : InstallState) : void {
        this.installState = installState;
    }

    public add(items : DownloadFile[]) : void
    {
        items.forEach((item) => {
            this.addSingle(item);
        });
    }

    public addSingle(item : DownloadFile) : void {
        if (!DownloadFile.existsInArray(item, this.downloadFiles))
            this.downloadFiles.unshift(item);
    }

    public download() : boolean {
        console.log("DownloadHelper # CALLED DOWNLOAD!");
        if (this.isDownloading())
            return false;

        if (this.downloadFiles.length < 1)
            return false;

        this.downloadNext();
        return true;
    }

    public isDownloading() : boolean {
        return this.downloading;
    }

    OnNewFilesFetched(downloadFiles: DownloadFile[]): void { }

    private downloadNext() : void {
        let item : DownloadFile | undefined = this.downloadFiles.pop();
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
        if (!this.downloadFile)
            throw new Error('Attempted to download undefined with space.');

        if (FileHelper.hasEnoughSpaceFor(this.downloadFile)) {
            this.startDownload(downloadConfig);
            return;
        }

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

            this.extract(this.downloadFile);
        });
    }

    private extract(downloadFile : DownloadFile) : void {
        console.log("Extracting: " + downloadFile.getName());
        if (!downloadFile.getExtract()) {
            this.extractionComplete();
            return;
        }

        console.log("Extracting #2");
        let installer : ZipInstaller = new ZipInstaller(this.installState);
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

        console.log("INTERRUPTING");
        this.downloadFile = null;
        this.downloadItem.cancel();
        this.downloadItem = null;
        this.downloading = false;

        if (this.installState)
            this.installState.OnDownloadInterrupt();
    }

    public pause() : void {
        if (this.downloadItem == null)
            return;

        console.log("PAUSE");
        this.downloadItem.pause();

        if (this.installState)
            this.installState.OnDownloadPause();
    }


    public resume() : void {
        if (this.downloadItem == null)
            return;

        this.downloadItem.resume();

        if (this.installState)
            this.installState.OnDownloadResume();
    }

    private onProgress(progress: { speedBytes: any; progress: any; }, item: DownloadItem | null | undefined) : void
    {
        this.downloadItem = item;
        if (this.installState) {
            this.installState.OnDownloadSpeedUpdate(progress.speedBytes);
            this.installState.OnDownloadProgressUpdate(progress.progress);
        }
    }

    private onStart() : void {
        this.downloading = true;

        if (this.installState)
            this.installState.OnDownloadStart();
    }

    private onFinished() : void {
        this.downloading = false;

        if (this.installState)
            this.installState.OnDownloadFinished();
    }
}