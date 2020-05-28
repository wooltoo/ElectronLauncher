import { HomeComponent } from '../home/home.component';
import { DownloadState } from '../general/downloadstate';
import { DownloadInfoFormatter } from '../general/downloadinfoformatter';
import { LocalStorageService } from 'ngx-webstorage';
import { LauncherConfig } from '../general/launcherconfig';
import { DownloadListService } from '../download-list.service';
import { DownloadFile } from '../general/downloadfile';
import { InstallState } from '../general/installstate';
import { ClientHelper } from '../general/clienthelper';
import { DownloadSystem } from '../general/downloadsystem';
import { SettingsManager, Setting } from '../general/settingsmanager';
import { FileRemover } from '../general/fileremover';
import { TranslateService } from '@ngx-translate/core';

export class DownloadInstallState implements InstallState {

    private translate : TranslateService;

    constructor(private homeComponent : HomeComponent,
                private localSt : LocalStorageService,
                private downloadListService : DownloadListService
               ) {

        this.translate = homeComponent.getTranslate();
    }

    OnExitState() : void { }

    OnEnterState(): void { 
        if (ClientHelper.getInstance().hasClientInstalled()) {
            this.homeComponent.state = DownloadState.LOADING;
            this.homeComponent.isInstalling = false;
            this.homeComponent.hasFilesToDownload = false;

            this.translate.get('PRIMARY-BUTTON.TEXT-START').subscribe((result) => {
                this.homeComponent.startButtonReadyCSS = true;
                this.homeComponent.buttonText = result;
            });
        }
    }

    OnDownloadStart(): void {
        this.homeComponent.state = DownloadState.DOWNLOADING;
        this.homeComponent.downloadSpeed = "0.00 MB/s"
        this.homeComponent.progress = "0.00%";
        this.homeComponent.progressBarWidth = 0;

        this.homeComponent.showPauseButton = true;
        this.homeComponent.showInterruptButton = true;

        this.homeComponent.showPlayButton = false;
        this.homeComponent.showDownloadStats = true;
        this.homeComponent.showDownloadBar = true;
        this.homeComponent.buttonText = this.translate.instant('PRIMARY-BUTTON.TEXT-DOWNLOADING');
        this.homeComponent.startButtonReadyCSS = false;
    }

    OnDownloadSpeedUpdate(downloadSpeed: any): void {
        this.homeComponent.downloadSpeed = DownloadInfoFormatter.formatDownloadSpeed(downloadSpeed);
    }
    
    OnDownloadProgressUpdate(downloadProgress: any): void {
        this.homeComponent.progressBarWidth = downloadProgress;
        this.homeComponent.progress = DownloadInfoFormatter.formatProgress(downloadProgress);
    }

    OnDownloadPause(): void {
        this.homeComponent.state = DownloadState.PAUSED;
        this.homeComponent.showPauseButton = false;
        this.homeComponent.showPlayButton = true;
        this.homeComponent.buttonText = this.translate.instant('PRIMARY-BUTTON.TEXT-RESUME');
        this.homeComponent.startButtonReadyCSS = false;
    }

    OnDownloadInterrupt(): void {
        this.homeComponent.state = DownloadState.WAITING_FOR_DOWNLOAD;
        this.homeComponent.showPauseButton = false;
        this.homeComponent.showPlayButton = false;
        this.homeComponent.showDownloadStats = false;
        this.homeComponent.showInterruptButton = false;
        this.homeComponent.showDownloadBar = false;

        if (!ClientHelper.getInstance().hasClientInstalled())  
            this.homeComponent.buttonText = this.translate.instant('PRIMARY-BUTTON.TEXT-INSTALL');
        else 
            this.homeComponent.buttonText = this.translate.instant('PRIMARY-BUTTON.TEXT-UPDATE');

        this.homeComponent.startButtonReadyCSS = false;
    }

    OnDownloadResume(): void {
        this.homeComponent.state = DownloadState.DOWNLOADING;
        this.homeComponent.showPauseButton = true;
        this.homeComponent.showPlayButton = false;
        this.homeComponent.showDownloadStats = true;
        this.homeComponent.showDownloadBar = true;
        this.homeComponent.buttonText = this.translate.instant('PRIMARY-BUTTON.TEXT-DOWNLOADING');
        this.homeComponent.startButtonReadyCSS = false;
    }

    OnDownloadFileFinished(downloadFile: DownloadFile) {
        if (downloadFile.getName() == LauncherConfig.CLIENT_RESOURCE_NAME) {
            downloadFile.setExtract(true);

            let requestedDir = ClientHelper.getInstance().getRequestedClientDirectory();
            if (!requestedDir)
              throw new Error('Could not locate requested client directory for extraction of client files.');
  
            downloadFile.setTarget(requestedDir);
        }
    }

    OnDownloadFinished(): void {
        this.homeComponent.state = DownloadState.COMPLETED;
        this.homeComponent.showPauseButton = false;
        this.homeComponent.showPlayButton = false;
        this.homeComponent.showInterruptButton = false;
        this.homeComponent.hasFilesToDownload = false;
        this.homeComponent.buttonText = this.translate.instant('PRIMARY-BUTTON.TEXT-START');
        this.homeComponent.startButtonReadyCSS = true;
        this.homeComponent.progressBarWidth = 0;
        this.homeComponent.isInstalling = false;
        this.homeComponent.progress = "";
        this.homeComponent.downloadSpeed = "";
        this.homeComponent.showDownloadBar = false;

        // Check if we have new files to download immediately.
        DownloadSystem.getInstance().queuePatches();
    }

    OnFilesToDownloadResult(hasFilesToCheckForDownload: boolean): void {
        if (!hasFilesToCheckForDownload || !this.isIdle()) 
            return;
        
        if (SettingsManager.getInstance().getSetting(Setting.SHOULD_AUTO_PATCH)) {
            DownloadSystem.getInstance().queuePatches();
        } else {
            this.homeComponent.state = DownloadState.WAITING_FOR_DOWNLOAD;
            this.homeComponent.buttonText = this.translate.instant('PRIMARY-BUTTON.TEXT-UPDATE');
            this.homeComponent.startButtonReadyCSS = false;
            this.homeComponent.hasFilesToDownload = true;
        }
    }

    OnInstallExtractionBegin(): void {
        if (this.homeComponent.state == DownloadState.INSTALLING)
            return;

        this.homeComponent.state = DownloadState.INSTALLING;
        this.homeComponent.isUnzipping = true;
        this.homeComponent.showPauseButton = false;
        this.homeComponent.showPlayButton = false;
        this.homeComponent.showDownloadStats = true;
        this.homeComponent.showInterruptButton = false;
        this.homeComponent.showDownloadBar = true;
        this.homeComponent.buttonText = this.translate.instant('PRIMARY-BUTTON.TEXT-INSTALLING');
        this.homeComponent.startButtonReadyCSS = false;
        this.homeComponent.downloadSpeed = "";
        this.homeComponent.progress = "0%";
        this.homeComponent.progressBarWidth = 0;
    }

    OnInstallExtractionCompleted(downloadFile: DownloadFile): void {
        if (downloadFile.getName() == LauncherConfig.CLIENT_RESOURCE_NAME) {
            this.FinishedInstallingClient();
        }

        this.homeComponent.isUnzipping = false;
    }

    OnInstallProgressUpdate(_downloadFile: DownloadFile, progress: number, _currFile: number, _fileCount: number): void {
        this.homeComponent.state = DownloadState.INSTALLING;
        this.homeComponent.isUnzipping = true;
        this.homeComponent.showPauseButton = false;
        this.homeComponent.showPlayButton = false;
        this.homeComponent.showDownloadStats = true;
        this.homeComponent.showInterruptButton = false;
        this.homeComponent.showDownloadBar = true;
        this.homeComponent.buttonText = this.translate.instant('PRIMARY-BUTTON.TEXT-INSTALLING');
        this.homeComponent.startButtonReadyCSS = false;
        this.homeComponent.downloadSpeed = "";
        this.homeComponent.progress = (progress * 100).toFixed(2).toString() + "%";
        this.homeComponent.progressBarWidth = (progress * 100);
    }

    GetLocalStorageService(): LocalStorageService {
        return this.localSt;
    }

    private FinishedInstallingClient() : void {
        let requestedDir = ClientHelper.getInstance().getRequestedClientDirectory();
        if (!requestedDir)
            throw new Error('Finished installing client but could not locate installed game client path.');

        ClientHelper.getInstance().setClientDirectory(
            requestedDir
        );

        const path = require('path');
        FileRemover.remove(
            path.join(ClientHelper.getInstance().getRequestedClientDirectory(), LauncherConfig.CLIENT_FILE_NAME)
        );
        
        this.homeComponent.isInstalling = false;
    }

    private isIdle() : boolean {
        return this.homeComponent.state == DownloadState.COMPLETED ||
               this.homeComponent.state == DownloadState.LOADING ||
               this.homeComponent.state == DownloadState.WAITING_FOR_DOWNLOAD;
    }
}