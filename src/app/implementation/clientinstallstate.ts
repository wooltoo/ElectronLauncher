import { HomeComponent } from '../home/home.component';
import { DownloadState } from '../general/downloadstate';
import { DownloadInfoFormatter } from '../general/downloadinfoformatter';
import { ZipInstaller } from '../general/zipinstaller';
import { LocalStorageService } from 'ngx-webstorage';
import { LauncherConfig } from '../general/launcherconfig';
import { DownloadListService } from '../download-list.service';
import { DownloadFile } from '../general/downloadfile';
import { InstallState } from '../general/installstate';
import { ClientHelper } from '../general/clienthelper';

export class ClientInstallState implements InstallState {

    constructor(private homeComponent : HomeComponent,
                private localSt : LocalStorageService,
                private downloadListService : DownloadListService) {

    }

    OnExitState() : void {

    }

    OnEnterState(): void {
        this.homeComponent.state = DownloadState.WAITING_FOR_DOWNLOAD;
        this.homeComponent.isInstalling = true;
        this.homeComponent.hideLanding();
        this.homeComponent.hasFilesToDownload = true;
        this.homeComponent.buttonText = "INSTALL";
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
        this.homeComponent.buttonText = "DOWNLOADING";
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
        this.homeComponent.showInterruptButton = true;
        this.homeComponent.showDownloadStats = true;
        this.homeComponent.showDownloadBar = true;
        this.homeComponent.buttonText = "RESUME INSTALLATION";
    }

    OnDownloadInterrupt(): void {
        this.homeComponent.state = DownloadState.WAITING_FOR_DOWNLOAD;
        this.homeComponent.showPauseButton = false;
        this.homeComponent.showPlayButton = false;
        this.homeComponent.showDownloadStats = false;
        this.homeComponent.showInterruptButton = false;
        this.homeComponent.showDownloadBar = false;
        this.homeComponent.buttonText = "INSTALL";
    }

    OnDownloadResume(): void {
        this.homeComponent.state = DownloadState.DOWNLOADING;
        this.homeComponent.showPauseButton = true;
        this.homeComponent.showPlayButton = false;
        this.homeComponent.showDownloadStats = true;
        this.homeComponent.showInterruptButton = true;
        this.homeComponent.showDownloadBar = true;
        this.homeComponent.buttonText = "DOWNLOADING";
    }

    OnDownloadFileFinished(downloadFile: DownloadFile) {
        if (downloadFile.getName() == LauncherConfig.CLIENT_RESOURCE_NAME) {
          let installer : ZipInstaller = new ZipInstaller(this);
          installer.install(downloadFile, this.localSt.retrieve('requestedClientDirectory'));
        }
    }

    OnDownloadFinished(): void {
        this.homeComponent.state = DownloadState.COMPLETED;
        this.homeComponent.showPauseButton = false;
        this.homeComponent.showPlayButton = false;
        this.homeComponent.showInterruptButton = false;
        this.homeComponent.hasFilesToDownload = true;
        this.homeComponent.buttonText = "INSTALLING";
        this.homeComponent.progressBarWidth = 0;
        this.homeComponent.isInstalling = true;
        this.homeComponent.progress = "";
        this.homeComponent.downloadSpeed = "";
    }

    OnFilesToDownloadResult(hasFilesToCheckForDownload: boolean): void {

    }

    OnInstallExtractionCompleted(downloadFile: DownloadFile): void {
        if (downloadFile.getName() == LauncherConfig.CLIENT_RESOURCE_NAME) {
            this.FinishedInstallingClient();
            this.Cleanup();
            this.homeComponent.OnClientInstallStateFinished();
            this.homeComponent.isUnzipping = false;
        }
    }

    Cleanup() {
        this.homeComponent.showDownloadBar = false;
        this.homeComponent.buttonText = "UPDATE";
    }

    OnInstallProgressUpdate(downloadFile: DownloadFile, progress: number, currFile: number, fileCount: number): void {
        this.homeComponent.state = DownloadState.INSTALLING;
        this.homeComponent.isUnzipping = true;
        this.homeComponent.showPauseButton = false;
        this.homeComponent.showPlayButton = false;
        this.homeComponent.showDownloadStats = true;
        this.homeComponent.showInterruptButton = false;
        this.homeComponent.showDownloadBar = true;
        this.homeComponent.buttonText = "INSTALLING";
        this.homeComponent.downloadSpeed = "";
        this.homeComponent.progress = (progress * 100).toFixed(2).toString() + "%";
        this.homeComponent.progressBarWidth = (progress * 100);
    }

    private FinishedInstallingClient() : void {
        this.localSt.store('clientDirectory', this.localSt.retrieve('requestedClientDirectory'));
        this.homeComponent.isInstalling = false;

        const fs = require('fs');
        const path = require('path');
        let downloadFile = path.join(ClientHelper.getInstance().getClientDirectory(), LauncherConfig.CLIENT_FILE_NAME);
        fs.unlink(downloadFile, (error) => {
            if (error) throw error;
        });
    }
}