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
import { DownloadSystem } from '../general/downloadsystem';
import { SettingsManager, Setting } from '../general/settingsmanager';

export class DownloadInstallState implements InstallState {

    constructor(private homeComponent : HomeComponent,
                private localSt : LocalStorageService,
                private downloadListService : DownloadListService) {

    }

    OnExitState() : void { }

    OnEnterState(): void { 
        if (!ClientHelper.getInstance().hasClientInstalled()) {
            this.homeComponent.state = DownloadState.WAITING_FOR_DOWNLOAD;
            this.homeComponent.isInstalling = true;
            this.homeComponent.hasFilesToDownload = true;
            this.homeComponent.buttonText = "INSTALL";
        } else {
            this.homeComponent.state = DownloadState.LOADING;
            this.homeComponent.isInstalling = false;
            this.homeComponent.hasFilesToDownload = false;
            this.homeComponent.buttonText = "START GAME";
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
        this.homeComponent.buttonText = "RESUME";
    }

    OnDownloadInterrupt(): void {
        this.homeComponent.state = DownloadState.WAITING_FOR_DOWNLOAD;
        this.homeComponent.showPauseButton = false;
        this.homeComponent.showPlayButton = false;
        this.homeComponent.showDownloadStats = false;
        this.homeComponent.showInterruptButton = false;
        this.homeComponent.showDownloadBar = false;

        if (!ClientHelper.getInstance().hasClientInstalled()) 
            this.homeComponent.buttonText = "INSTALL";
        else 
            this.homeComponent.buttonText = "UPDATE";
    }

    OnDownloadResume(): void {
        this.homeComponent.state = DownloadState.DOWNLOADING;
        this.homeComponent.showPauseButton = true;
        this.homeComponent.showPlayButton = false;
        this.homeComponent.showDownloadStats = true;
        this.homeComponent.showDownloadBar = true;
        this.homeComponent.buttonText = "DOWNLOADING";
    }

    OnDownloadFileFinished(downloadFile: DownloadFile) {
        if (downloadFile.getName() == LauncherConfig.CLIENT_RESOURCE_NAME) {
          let installer : ZipInstaller = new ZipInstaller(this);
          installer.install(downloadFile, ClientHelper.getInstance().getRequestedClientDirectory());
        }
    }

    OnDownloadFinished(): void {
        this.homeComponent.state = DownloadState.COMPLETED;
        this.homeComponent.showPauseButton = false;
        this.homeComponent.showPlayButton = false;
        this.homeComponent.showInterruptButton = false;
        this.homeComponent.hasFilesToDownload = false;
        this.homeComponent.buttonText = "START GAME";
        this.homeComponent.progressBarWidth = 0;
        this.homeComponent.isInstalling = false;
        this.homeComponent.progress = "";
        this.homeComponent.downloadSpeed = "";
        this.homeComponent.showDownloadBar = false;

        // Check if we have new files to download immediately.
        DownloadSystem.getInstance().downloadAll();
    }

    OnFilesToDownloadResult(hasFilesToCheckForDownload: boolean): void {
        if (!hasFilesToCheckForDownload || !this.isIdle()) 
            return;
        
        if (SettingsManager.getInstance().getSetting(Setting.SHOULD_AUTO_PATCH)) {
            DownloadSystem.getInstance().downloadAll();
        } else {
            this.homeComponent.state = DownloadState.WAITING_FOR_DOWNLOAD;
            this.homeComponent.buttonText = "UPDATE";
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
        this.homeComponent.buttonText = "INSTALLING";
        this.homeComponent.downloadSpeed = "";
        this.homeComponent.progress = "0%";
        this.homeComponent.progressBarWidth = 0;
    }

    OnInstallExtractionCompleted(downloadFile: DownloadFile): void {
        if (downloadFile.getName() == LauncherConfig.CLIENT_RESOURCE_NAME) {
            this.FinishedInstallingClient();
            console.log("INSTALL EXTRACTION COMPLETED!");
        }

        this.homeComponent.isUnzipping = false;
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

    GetDownloadListService(): DownloadListService {
        return this.downloadListService;
    }

    GetLocalStorageService(): LocalStorageService {
        return this.localSt;
    }

    private FinishedInstallingClient() : void {
        ClientHelper.getInstance().setClientDirectory(
            ClientHelper.getInstance().getRequestedClientDirectory()
        );
        
        this.homeComponent.isInstalling = false;
    }

    private isIdle() : boolean {
        return this.homeComponent.state == DownloadState.COMPLETED ||
               this.homeComponent.state == DownloadState.LOADING ||
               this.homeComponent.state == DownloadState.WAITING_FOR_DOWNLOAD;
    }
}